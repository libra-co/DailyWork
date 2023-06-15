/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-12 17:52:54
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-12 17:59:20
 * @FilePath: /DailyWork/src/projectList/projectmangement.controller.spec.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: liuhongbo liuhongbo@dip-ai.com
 * @Date: 2023-06-12 17:52:54
 * @LastEditors: liuhongbo liuhongbo@dip-ai.com
 * @LastEditTime: 2023-06-12 17:53:24
 * @FilePath: /DailyWork/src/projectMangement/projectmangement.controller.spec.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectmangementController } from './project.controller';
import { ProjectmangementService } from './project.service';

describe('ProjectmangementController', () => {
  let controller: ProjectmangementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectmangementController],
      providers: [ProjectmangementService],
    }).compile();

    controller = module.get<ProjectmangementController>(ProjectmangementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
