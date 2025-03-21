import { ApiProperty } from '@nestjs/swagger';
import { RouteType } from 'routes/enums/route-type.enum';
import { Route } from 'routes/route.entity';

export class RouteItemOfListDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    num: string;

    @ApiProperty()
    type: RouteType;

    private static fromEntity(entity: Route): RouteItemOfListDto {
        const dto = new RouteItemOfListDto();

        dto.id = entity.id;
        dto.num = entity.num;
        dto.type = entity.type;

        return dto;
    }

    static getListFromEntities(entities: Route[]): RouteItemOfListDto[] {
        return entities.map((entity) => RouteItemOfListDto.fromEntity(entity));
    }
}
