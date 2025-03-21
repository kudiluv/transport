import { ApiProperty } from '@nestjs/swagger';
import { BusStation } from 'bus-stations/bus-station.entity';
import { PointOutputDto } from 'common/dto/point-output.dto';

export class BusStationOutputDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ type: PointOutputDto })
    coordinates: [number, number];

    @ApiProperty()
    name: string;

    static fromEntity(entity: BusStation) {
        const dto = new BusStationOutputDto();
        dto.id = entity.id;
        dto.coordinates = [entity.coordinates.coordinates[0], entity.coordinates.coordinates[1]];
        dto.name = entity.name;
        return dto;
    }

    static fromListEntity(entities: BusStation[]) {
        return entities.map((entity) => BusStationOutputDto.fromEntity(entity));
    }

    toCBOR(_writer: any, _options: any) {
        return [1000, [this.id, this.coordinates, this.name]];
    }
}
