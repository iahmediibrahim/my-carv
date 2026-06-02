import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
@Serialize(ReportDto)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(
    @Param('id') id: string,
    @Body() approveReportDto: ApproveReportDto,
  ) {
    console.log(id);
    return this.reportsService.changeApproval(approveReportDto.approved, +id);
  }

  @Get()
  getEstimate(@Query() getEstimateDto: GetEstimateDto) {
    return this.reportsService.getEstimate(getEstimateDto);
  }
}
