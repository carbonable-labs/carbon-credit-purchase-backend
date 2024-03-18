import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Account, Contract, RpcProvider, getChecksumAddress } from 'starknet';

interface SetupResponse {
  minterContract: Contract;
  account: Account;
  provider: RpcProvider;
  walletAddress: string;
  mintingAddress: string;
}

@Injectable()
export class CertificateService {
  constructor(private prisma: PrismaService) {}

  async setup(): Promise<SetupResponse> {
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

    return { minterContract, account, provider, walletAddress, mintingAddress };
  }

  async mint(orderId?: string): Promise<string> {
    const { minterContract, account, provider, walletAddress, mintingAddress } =
      await this.setup();

    const order = orderId
      ? await this.prisma.order.findUniqueOrThrow({
          where: { id: orderId },
          include: { user: true },
        })
      : null;

    const call = minterContract.populate('mint', [
      orderId ? order.user.walletAddress : walletAddress,
      [1, 2, 3],
      [10, 20, 30],
    ]);

    const res = await account.execute({
      contractAddress: mintingAddress,
      entrypoint: 'mint',
      calldata: call.calldata,
    });
    console.log('reponse:', res);
    await provider.waitForTransaction(res.transaction_hash);

    return res.transaction_hash;
  }

  async retrieveMetadata(transactionHash: string): Promise<string> {
    const { provider, walletAddress, minterContract } = await this.setup();

    const tx = await provider.getTransactionReceipt(transactionHash);

    const mintingEvent = tx.events.find(
      (event) =>
        getChecksumAddress(event.from_address) ===
        getChecksumAddress(walletAddress),
    );

    const tokenId = mintingEvent.data[2];

    const metadata = await minterContract.call('token_uri', [tokenId]);

    return metadata.toString();
  }

  async generateCertificate() {
    console.log('Generating certificate');
  }
}
