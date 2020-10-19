import Axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StationFuelupDto, StationResponseDto, PriceFuelupDto } from './dto';

@Injectable()
export class StationService {
  private readonly logger = new Logger(StationService.name);
  private readonly serverUrl: string;
  private readonly apikey: string;

  constructor(private readonly config: ConfigService) {
    /** TODO: validate config */
    this.serverUrl = this.config.get<string>('SERVER');
    this.apikey = this.config.get<string>('API_KEY');
  }

  async get(): Promise<StationResponseDto[]> {
    let stations: StationFuelupDto[];

    try {
      stations = await this.makeRequest<StationFuelupDto>(
        this.serverUrl,
        '/v1/station',
        { apikey: this.apikey },
      );
    } catch (error) {
      return null;
    }

    let prices: PriceFuelupDto[];

    try {
      prices = await this.makeRequest<PriceFuelupDto>(
        this.serverUrl,
        '/v1/price',
        { apikey: this.apikey },
      );
    } catch (error) {
      return null;
    }

    /**
     * Создаем Map с ценами для удобного и эффективного
     * поиска на следующем этапе
     */
    const priceMap = prices.reduce((acc, price) => {
      let prices: Record<string, number> = {};

      if (acc.has(price.StationID)) {
        prices = acc.get(price.StationID);
      }

      prices[price.ProductId] = price.Price;
      acc.set(price.StationID, prices);

      return acc;
    }, new Map<string, Record<string, number>>());

    const result: StationResponseDto[] = [];

    for (const station of stations) {
      const res = new StationResponseDto();

      res.Id = station.Id;
      res.Address = station.Address;
      res.Enable = station.Enable === 'true' ? true : false;
      res.Location = station.Location;
      res.Name = station.Name;
      res.Columns = {};

      for (const key in station.Columns) {
        res.Columns[key] = [];

        for (const fuel of station.Columns[key].Fuels) {
          const prices = priceMap.get(station.Id);

          /**
           * FIXME:
           * Что делать если нет цен к этой станции?
           * Сделал что бы возвращало цену 0, но нужно уточнить
           */
          if (!prices) {
            res.Columns[key].push({
              Fuel: fuel,
              Price: 0,
            });

            continue;
          }

          const price = prices[fuel];

          res.Columns[key].push({
            Fuel: fuel,
            Price: price ?? 0,
          });
        }
      }

      result.push(res);
    }

    return result;
  }

  private async makeRequest<T>(
    base: string,
    url: string,
    params: any,
  ): Promise<T[]> {
    let i = 0;

    while (i < 5) {
      try {
        const response = await Axios({
          baseURL: base,
          url,
          params,
          method: 'GET',
        });

        /** TODO: validate incoming data */
        return response.data as T[];
      } catch (error) {
        this.logger.error(JSON.stringify(error));
        i += 1;
      }
    }

    throw new Error('Unable to retrieve data');
  }
}
