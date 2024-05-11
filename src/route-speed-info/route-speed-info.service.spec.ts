import { Test, TestingModule } from '@nestjs/testing';
import { RouteSpeedInfoService } from './route-speed-info.service';

describe('RouteSpeedInfoService', () => {
  let service: RouteSpeedInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteSpeedInfoService],
    }).compile();

    service = module.get<RouteSpeedInfoService>(RouteSpeedInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
