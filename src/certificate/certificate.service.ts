import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Account, Contract, RpcProvider, getChecksumAddress } from 'starknet';

@Injectable()
export class CertificateService {
  private minterContract: Contract;
  private account: Account;
  private provider: RpcProvider;
  private walletAddress: string;
  private mintingAddress: string;
  private certicateGeneratorUrl: string;

  constructor(private prisma: PrismaService) {
    this.setup();
  }

  async setup(): Promise<void> {
    const walletAddress = process.env.ARGENT_WALLET_ADDRESS;
    const mintingAddress = process.env.MINTER_ADDRESS;

    const provider = new RpcProvider({
      nodeUrl: `${process.env.NODE_URL}?apikey=${process.env.RPC_API_KEY}`,
    });

    const account = new Account(
      provider,
      walletAddress,
      process.env.ARGENT_WALLET_PK,
    );

    const { abi: minterAbi } = await provider.getClassAt(mintingAddress);

    if (minterAbi === undefined) {
      throw new Error('no abi.');
    }

    const minterContract = new Contract(minterAbi, mintingAddress, provider);

    minterContract.connect(account);

    this.minterContract = minterContract;
    this.account = account;
    this.provider = provider;
    this.walletAddress = walletAddress;
    this.mintingAddress = mintingAddress;
    this.certicateGeneratorUrl = process.env.CERTIFICATE_GENERATOR_URL;
  }

  async mint(orderId?: string): Promise<string> {
    const order = orderId
      ? await this.prisma.order.findUniqueOrThrow({
          where: { id: orderId },
          include: { user: true },
        })
      : null;

    const call = this.minterContract.populate('mint', [
      orderId ? order.user.walletAddress : this.walletAddress,
      [1, 2, 3],
      [10, 20, 30],
    ]);

    const res = await this.account.execute({
      contractAddress: this.mintingAddress,
      entrypoint: 'mint',
      calldata: call.calldata,
    });
    console.log('reponse:', res);
    await this.provider.waitForTransaction(res.transaction_hash);

    return res.transaction_hash;
  }

  async retrieveMetadata(transactionHash: string): Promise<string> {
    const tx = await this.provider.getTransactionReceipt(transactionHash);

    const mintingEvent = tx.events.find(
      (event) =>
        getChecksumAddress(event.from_address) ===
        getChecksumAddress(this.walletAddress),
    );

    const tokenId = mintingEvent.data[2];

    const metadata = await this.minterContract.call('token_uri', [tokenId]);

    return metadata.toString();
  }

  async generateCertificate(metadata: string): Promise<ArrayBuffer> {
    const fetchResponse = await fetch(this.certicateGeneratorUrl, {
      method: 'POST',
      body: JSON.stringify({ metadata }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Convert response to ArrayBuffer
    return await fetchResponse.arrayBuffer();
  }
}
