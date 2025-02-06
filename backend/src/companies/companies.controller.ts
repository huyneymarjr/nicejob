import {
  Controller, Get, Post, Body, Patch,
  Param, Delete,
  Query
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch List Company with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {

    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Get('top-companies')
  @Public()
  @ResponseMessage("Get top 10 companies by jobs")
  async getTopCompanies() {
    return this.companiesService.getTopCompanies();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser 
  ) {
    return this.companiesService.remove(id, user);
  }

  @Get(':id/total-jobs')
  @Public()
  @ResponseMessage("Get Company's Total Jobs")
  async getTotalJobs(@Param('id') id: string) {
    const totalJobs = await this.companiesService.getTotalJobs(id);
    return { totalJobs };
  }

  @Get('statistics/dashboard') 
  @SkipCheckPermission()
  @ResponseMessage("Get Company Dashboard Statistics")
  async getDashboardStatistics() {
    return this.companiesService.getDashboardStatistics();
  }
}