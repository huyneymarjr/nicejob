import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from '../resumes/schemas/resume.schema';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage("Create a new job")
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch jobs with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Get('by-hr')
  @ResponseMessage("Fetch jobs managed by HR")
  @SkipCheckPermission()
  findAllByHr(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
    @User() user: IUser
  ) {
    return this.jobsService.findAllByHr(+currentPage, +limit, qs, user);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("Fetch a job by id")
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a job")
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a job")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }

  @Get('locations/:companyId')
  @Public()
  @ResponseMessage("Fetch job locations by company ID")
  async getJobLocations(@Param('companyId') companyId: string) {
    return this.jobsService.getJobLocationsByCompany(companyId);
  }

  @Get('skills/company/:companyId')
  @Public()
  @ResponseMessage("Fetch skills by company ID")
  async getSkillsByCompany(@Param('companyId') companyId: string) {
    return this.jobsService.getSkillsByCompany(companyId);
  }

  @Get('by-company/:companyId')
  @Public()
  @ResponseMessage("Fetch jobs by company ID")
  async getJobsByCompany(@Param('companyId') companyId: string) {
    return this.jobsService.getJobsByCompany(companyId);
  }

  @Get('statistics/dashboard')
  @SkipCheckPermission()
  @ResponseMessage("Get dashboard statistics")
  async getDashboardStatistics() {
    return this.jobsService.getDashboardStatistics();
  }

  @Get('top-jobs/most-applied')
  @Public()
  @ResponseMessage("Get top 10 jobs with most resumes")
  async getTopJobsWithMostResumes() {
    return this.jobsService.getTopJobsWithMostResumes();
  }
}
