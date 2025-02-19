import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Injectable,
  Param,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { StateService } from '../services/state.service';

@Injectable()
@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get(':countryCode')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  list(
    @Param('countryCode') code: string
  ) {
    return DataResponse.ok(this.stateService.getStatesByCountry(code));
  }
}
