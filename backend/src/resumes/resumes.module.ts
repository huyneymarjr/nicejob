import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './schemas/resume.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { Job, JobSchema } from '../jobs/schemas/job.schema';
import { Company, CompanySchema } from '../companies/schemas/company.schema';

@Module({
  controllers: [ResumesController],
  providers: [ResumesService],
  imports: [
    MongooseModule.forFeature([
      { name: Resume.name, schema: ResumeSchema },
      { name: Job.name, schema: JobSchema },
      { name: Company.name, schema: CompanySchema }
    ]),
    MailerModule
  ],
})
export class ResumesModule { }