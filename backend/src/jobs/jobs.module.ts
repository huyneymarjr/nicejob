import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schemas/job.schema';
import { Company, CompanySchema } from '../companies/schemas/company.schema';
import { Resume, ResumeSchema } from 'src/resumes/schemas/resume.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Resume.name, schema: ResumeSchema }
    ])
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [MongooseModule]
})
export class JobsModule {}
