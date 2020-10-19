import {
  IsBoolean,
  IsLatLong,
  IsString,
  ValidateNested,
} from 'class-validator';

class LocationDto {
  @IsLatLong()
  Lat: number;

  @IsLatLong()
  Lon: number;
}

export class StationFuelupDto {
  @IsString()
  Id: string;

  @IsBoolean()
  Enable: boolean;

  @IsString()
  Name: string;

  @IsString()
  Address: string;

  @ValidateNested()
  Location: LocationDto;

  /** TODO: validation */
  Columns: {
    [k: string]: string[];
  };
}
