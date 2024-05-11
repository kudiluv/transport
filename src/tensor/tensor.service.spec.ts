import { Test, TestingModule } from '@nestjs/testing';
import { TensorService } from './tensor.service';

describe('TensorService', () => {
  let service: TensorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TensorService],
    }).compile();

    service = module.get<TensorService>(TensorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
