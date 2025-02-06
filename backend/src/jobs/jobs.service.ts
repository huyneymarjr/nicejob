import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { JobDocument, Job } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { CompanyDocument, Company } from 'src/companies/schemas/company.schema';
import { Model } from 'mongoose';
import { Resume, ResumeDocument } from 'src/resumes/schemas/resume.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    const {
      name, skills, company, salary, quantity,
      level, description, startDate, endDate,
      isActive, location
    } = createJobDto;

    // Check if the user is HR
    if (user.role.name === 'HR') {
      // Ensure the company ID matches the user's company ID
      if (company._id.toString() !== user.company._id.toString()) {
        throw new BadRequestException('Không thể tạo mới việc làm này cho công ty khác');
      }
    }

    let newJob = await this.jobModel.create({
      name, skills, company, salary, quantity,
      level, description, startDate, endDate,
      isActive, location,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    // Increment totalJobs for the company
    await this.companyModel.updateOne(
      { _id: createJobDto.company._id },
      { $inc: { totalJobs: 1 } }
    );

    return {
      _id: newJob?._id,
      createdAt: newJob?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found job`;

    return await this.jobModel.findById(id);
  }

  async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
    // Check if job exists
    const job = await this.jobModel.findById(_id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // If user is HR, verify they belong to the job's company
    if (user.role.name === 'HR') {
      if (job.company._id.toString() !== user.company._id.toString()) {
        throw new ForbiddenException('Bạn không có quyền cập nhật job của công ty khác');
      }

      // Remove company-related fields from the update data for HR users
      const { company, ...allowedUpdates } = updateJobDto;
      
      return await this.jobModel.updateOne(
        { _id },
        {
          ...allowedUpdates,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      );
    }

    // For admin users, allow all updates
    return await this.jobModel.updateOne(
      { _id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return `not found job`;

    const job = await this.jobModel.findById(_id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.companyModel.updateOne(
      { _id: job.company._id },
      { $inc: { totalJobs: -1 } }
    );

    await this.jobModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      });

    await this.resumeModel.updateMany(
      { jobId: _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );

    await this.resumeModel.softDelete({
      jobId: _id
    });

    return this.jobModel.softDelete({
      _id
    });
  }

  async getJobLocationsByCompany(companyId: string) {
    const jobs = await this.jobModel.find({ 'company._id': companyId }).select('location');
    return jobs.map(job => job.location);
  }

  async getSkillsByCompany(companyId: string) {
    const jobs = await this.jobModel.find({ 'company._id': companyId }).select('skills');
    return jobs.map(job => job.skills);
  }

  async findByCompanyId(company_id: string): Promise<Job[]> {
    return this.jobModel.find({ company_id }).exec();
  }

  async getJobsByCompany(companyId: string) {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new BadRequestException(`Invalid company ID: ${companyId}`);
    }

    return await this.jobModel.find({ 'company._id': companyId, isDeleted: false }).exec();
  }

  async getDashboardStatistics() {
    const totalJobs = await this.jobModel.countDocuments({
      isDeleted: false
    });

    const totalJobsWithDeleted = await this.jobModel.countDocuments({}); // đếm tất cả jobs kể cả đã xóa

    const totalJobsDeleted = await this.jobModel.countDocuments({
      isDeleted: true
    });

    return {
      totalJobs,
      totalJobsWithDeleted,
      totalJobsDeleted
    };
  }

  async findAllByHr(currentPage: number, limit: number, qs: string, user: IUser) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    if (user.role.name === 'HR' && user.company?._id) {
      filter['company._id'] = user.company._id;
    }
    
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit, 
        pages: totalPages,
        total: totalItems
      },
      result
    }
  }

  async getTopJobsWithMostResumes() {
    // Aggregate để đếm số lượng resume cho mỗi job
    const result = await this.resumeModel.aggregate([
      {
        $group: {
          _id: "$jobId",
          totalResumes: { $sum: 1 }
        }
      },
      {
        $sort: { totalResumes: -1 } // Sắp xếp giảm dần
      },
      {
        $limit: 10 // Lấy top 10
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id", 
          as: "jobInfo"
        }
      },
      {
        $unwind: "$jobInfo"
      },
      {
        $project: {
          jobName: "$jobInfo.name",
          companyName: "$jobInfo.company.name",
          totalResumes: 1,
          salary: "$jobInfo.salary",
          skills: "$jobInfo.skills"
        }
      }
    ]);

    return result;
  }
}
