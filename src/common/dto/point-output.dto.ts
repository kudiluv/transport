import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'typeorm';

export class PointOutputDto implements Point {
    @ApiProperty()
    type: 'Point';
    @ApiProperty()
    coordinates: number[];

    static from(point: Point) {
        const dto = new PointOutputDto();
        dto.type = point.type;
        dto.coordinates = point.coordinates;
        return dto;
    }
}
