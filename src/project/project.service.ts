import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Project } from './entities/project.entity';
import { IProjectService } from './project.interface';

@Injectable()
export class ProjectService implements IProjectService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }
}
