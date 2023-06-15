import { Test, TestingModule } from '@nestjs/testing';
import { ProjectmangementService } from './project.service';

describe('ProjectmangementService', () => {
  let service: ProjectmangementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectmangementService],
    }).compile();

    service = module.get<ProjectmangementService>(ProjectmangementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
