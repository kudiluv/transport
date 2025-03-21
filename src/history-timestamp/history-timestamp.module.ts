import { Module } from '@nestjs/common';
import { HistoryTimestampService } from './history-timestamp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryTimestamp } from './history-timestamp.entity';

@Module({
    imports: [TypeOrmModule.forFeature([HistoryTimestamp])],
    providers: [HistoryTimestampService],
    exports: [HistoryTimestampService],
})
export class HistoryTimestampModule {}
