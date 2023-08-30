import { Project } from './entities/project.entity';

export const PROJECT_SERVICE = 'PROJECT SERVICE';

export interface IProjectService {
  findAll(): Promise<Project[]>;
}
