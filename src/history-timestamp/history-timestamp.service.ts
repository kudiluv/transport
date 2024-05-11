import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryTimestamp } from './history-timestamp.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class HistoryTimestampService {
  constructor(
    @InjectRepository(HistoryTimestamp)
    private historyTimestampRepository: Repository<HistoryTimestamp>,
    private dataSource: DataSource,
  ) {}

  public createWithManager(manager: EntityManager): Promise<HistoryTimestamp> {
    const historyTimestamp = this.historyTimestampRepository.create();
    return manager.save(historyTimestamp);
  }

  public create(manager?: EntityManager) {
    if (manager) {
      return this.createWithManager(manager);
    }
    return this.dataSource.transaction(async (m) => {
      return this.createWithManager(m);
    });
  }

  public async getLast(): Promise<HistoryTimestamp> {
    const max = await this.historyTimestampRepository.maximum('id');
    return this.historyTimestampRepository
      .createQueryBuilder('timestamp')
      .where('id = :max', { max })
      .getOne();
  }
}
