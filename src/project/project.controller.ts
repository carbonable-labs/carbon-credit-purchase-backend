import { Controller, Get, Inject } from '@nestjs/common';
import { IProjectService, PROJECT_SERVICE } from './project.interface';
import { Project } from './entities/project.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(
    @Inject(PROJECT_SERVICE)
    private readonly _projectService: IProjectService,
  ) {}

  @ApiOperation({ summary: 'Get all projects' })
  @ApiOkResponse({
    description: 'Return all projects.',
  })
  @Get()
  findAll(): Promise<Project[]> {
    return this._projectService.findAll();
  }
}
