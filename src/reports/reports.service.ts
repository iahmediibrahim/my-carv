import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(createReportDto: CreateReportDto, user: User) {
    const report = this.repo.create(createReportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(approved: boolean, id: number) {
    const report = await this.repo.findOne({
      where: {
        id,
      },
    });
    if (!report) {
      throw new NotFoundException('no report found!');
    }
    report.approved = approved;

    return this.repo.save(report);
  }

  async getEstimate(getEstimateDto: GetEstimateDto) {
    
  }
}
