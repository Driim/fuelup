import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { StationModule } from "./station.module";
import { StationService } from "./station.service";

import axios from 'axios';
import { PriceFuelupDto, StationFuelupDto } from "./dto";

jest.mock('axios');

describe('Fuelup', () => {
  let service: StationService;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        StationModule
      ]
    }).compile();

    service = app.get<StationService>(StationService);
  });

  it('should return null if /v1/station unavailabel', async () => {
    // some hack to get rid of typescript
    (axios as any).mockImplementation(() => Promise.reject(new Error('test')));

    const result = await service.get();

    expect(result).toBeNull();
    expect(axios).toBeCalledTimes(5);
  });

  it('should return prepared data', async () => {
    const id = '1';
    (axios as any).mockImplementation((options) => {
      if (options.url === '/tanker/station') {
        const dto = new StationFuelupDto();
        dto.Id = id;
        dto.Name = 'test';
        dto.Location = {
          Lat: 1,
          Lon: 1,
        };
        dto.Enable = true;
        dto.Address = 'test address';
        dto.Columns = {
          '1': ['a92', 'a95', 'a95_premium'],
          '2': ['diesel', 'diesel_premium']
        }
        return Promise.resolve({ data: [dto] });
      }
      
      if (options.url === '/tanker/price') {
        const result: PriceFuelupDto[] = [];

        result.push(new PriceFuelupDto());
        result[0].StationId = id;
        result[0].ProductId = 'a92';
        result[0].Price = 5;

        result.push(new PriceFuelupDto());
        result[1].StationId = id;
        result[1].ProductId = 'a95';
        result[1].Price = 10;

        result.push(new PriceFuelupDto());
        result[2].StationId = id;
        result[2].ProductId = 'a95_premium';
        result[2].Price = 20;

        result.push(new PriceFuelupDto());
        result[3].StationId = id;
        result[3].ProductId = 'diesel';
        result[3].Price = 40;

        /** нет diesel_premium */

        return Promise.resolve({ data: result });
      }
    });

    const result = await service.get();

    expect(result.length).toBe(1);
    expect(result[0].Id).toBe(id);
    expect(result[0].Columns['1']['a92']).toBe(5);
    /** diesel_premium */
    expect(result[0].Columns['2']['diesel_premium']).toBeUndefined();
  });

  afterAll(async () => {
    return app.close();
  });
});