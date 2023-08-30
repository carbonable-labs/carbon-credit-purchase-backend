import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PROJECT_SERVICE } from './project.interface';

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: PROJECT_SERVICE,
      useClass: ProjectService,
    },
  ],
})
export class ProjectModule {}
