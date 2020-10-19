import { ApiExtraModels, ApiResponseProperty } from '@nestjs/swagger';

export class StationFuelDto {
  [k: string]: number;
}

export class LocationDto {
  @ApiResponseProperty()
  Lat: number;

  @ApiResponseProperty()
  Lon: number;
}

@ApiExtraModels(LocationDto)
@ApiExtraModels(StationFuelDto)
export class StationResponseDto {
  /**
   * Уникальный идентификатор станции АЗС
   */
  @ApiResponseProperty()
  Id: string;

  /**
   * Статус станции: true - доступна, false - выключена
   */
  @ApiResponseProperty()
  Enable: boolean;

  /**
   * Наименование станции
   */
  @ApiResponseProperty()
  Name: string;

  /**
   * Адрес станции
   */
  @ApiResponseProperty()
  Address: string;

  /**
   * Гео-координаты станции
   */
  @ApiResponseProperty()
  Location: LocationDto;

  /**
   * Список ТРК на АЗС.
   */
  @ApiResponseProperty()
  Columns: {
    [k: string]: StationFuelDto;
  };
}
