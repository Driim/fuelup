import { IsNumber, IsString } from 'class-validator';

export class PriceFuelupDto {
  @IsString()
  StationId: string;

  @IsString()
  ProductId: string;

  @IsNumber()
  Price: number;
}
