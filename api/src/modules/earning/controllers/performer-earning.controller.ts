import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Query
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { EarningService } from '../services/earning.service';
import {
  EarningSearchRequestPayload
} from '../payloads';
import { EarningDto, IEarningStatResponse } from '../dtos/earning.dto';

@Injectable()
@Controller('performer/earning')
export class PerformerEarningController {
  constructor(private readonly earningService: EarningService) {}

  @Get('/search')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() req: EarningSearchRequestPayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<PageableData<EarningDto>>> {
    const data = await this.earningService.search(req, user);
    return DataResponse.ok(data);
  }

  @Get('/stats')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async performerStats(
    @Query() req: EarningSearchRequestPayload,
    @CurrentUser() user: PerformerDto
  ): Promise<DataResponse<IEarningStatResponse>> {
    req.performerId = user._id;
    const data = await this.earningService.stats(req);
    return DataResponse.ok(data);
  }
}
