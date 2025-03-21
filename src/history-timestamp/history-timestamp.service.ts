import { Injectable } from '@nestjs/common';
import { HistoryTimestamp } from './history-timestamp.entity';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class HistoryTimestampService {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>) {}

    private get txRepository() {
        return this.txHost.tx.getRepository(HistoryTimestamp);
    }

    @Transactional()
    public async getOrCreateLast(): Promise<HistoryTimestamp> {
        const max = await this.txRepository.maximum('id');
        if (!max) {
            return this.txRepository.save(this.txRepository.create());
        }

        return (await this.txRepository.createQueryBuilder('timestamp').where('id = :max', { max }).getOne())!;
    }

    public async create() {
        return this.txRepository.save(this.txRepository.create());
    }
}
