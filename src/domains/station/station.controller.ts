import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { StationResponseDto } from './dto/station.dto';
import { StationService } from './station.service';

@Controller('station')
export class StationController {
  constructor(private readonly service: StationService) {}

  @Get()
  @ApiOperation({ description: 'Get all stations with prices' })
  @ApiOkResponse({ type: StationResponseDto, isArray: true })
  @ApiServiceUnavailableResponse()
  async get(): Promise<StationResponseDto[]> {
    const stations = await this.service.get();

    if (!stations || !stations.length) {
      throw new ServiceUnavailableException();
    }

    return stations;
  }
}
