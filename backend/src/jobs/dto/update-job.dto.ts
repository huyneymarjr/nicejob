import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}

export class UpdateJobHrDto extends OmitType(UpdateJobDto, ['company'] as const) {}
