import { IsNumber, IsString } from 'class-validator';

export class PriceFuelupDto {
  @IsString()
  StationID: string;

  @IsString()
  ProductId: string;

  @IsNumber()
  Price: number;
}
