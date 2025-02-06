import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Company, CompanyDocument } from 'src/companies/schemas/company.schema';


@Injectable()
export class ResumesService {

  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    private readonly mailerService: MailerService
  ) { }
  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const { url, companyId, jobId } = createUserCvDto;
    const { email, _id } = user;

    const newCV = await this.resumeModel.create({
      url, companyId, email, jobId,
      userId: _id,
      status: "PENDING",
      createdBy: { _id, email },
      history: [
        {
          status: "PENDING",
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ]
    })

    return {
      _id: newCV?._id,
      createdAt: newCV?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string, user: IUser) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    if (user.role.name === 'HR' && user.company?._id) {
      filter['companyId'] = user.company._id;
    }

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện t���i
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("not found resume")
    }

    return await this.resumeModel.findById(id);
  }
  async findByUsers(user: IUser) {
    return await this.resumeModel.find({
      userId: user._id,
    })
      .sort("-createdAt")
      .populate([
        {
          path: "companyId",
          select: { name: 1 }
        },
        {
          path: "jobId",
          select: { name: 1 }
        }
      ])
  }

  async update(_id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException("not found resume")
    }

    const resume = await this.resumeModel.findById(_id)
      .populate([
        {
          path: "jobId",
          select: { name: 1 }
        },
        {
          path: "companyId", 
          select: { name: 1 }
        }
      ]);

    if (!resume) {
      throw new BadRequestException("Resume not found");
    }

    const updated = await this.resumeModel.updateOne(
      { _id },
      {
        status,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        }
      });

    let message = '';
    switch(status) {
      case 'PENDING':
        message = 'Your resume status is currently pending.';
        break;
      case 'REVIEWING':
        message = 'Your resume is currently under review by our HR team.';
        break;
      case 'APPROVED':
        message = 'Congratulations! Your resume has been approved. Our HR team will contact you soon for next steps.';
        break;
      case 'REJECTED':
        message = 'We regret to inform you that we will not be moving forward with your application at this time.';
        break;
      default:
        message = 'Your resume status has been updated.';
    }

    await this.mailerService.sendMail({
      to: resume.email,
      subject: 'Resume Status Update',
      template: 'resume-status',
      context: {
        name: resume.email.split('@')[0], 
        status: status,
        jobName: (await this.jobModel.findById(resume.jobId)).name,
        companyName: (await this.companyModel.findById(resume.companyId)).name,
        message: message
      },
    });

    return updated;
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.resumeModel.softDelete({
      _id: id
    })
  }

  async getDashboardStatistics() {
    const totalResumes = await this.resumeModel.countDocuments({
      isDeleted: false
    });

    const totalResumesWithDeleted = await this.resumeModel.countDocuments({}); // count all resumes including deleted

    const totalResumesDeleted = await this.resumeModel.countDocuments({
      isDeleted: true
    });

    return {
      totalResumes,
      totalResumesWithDeleted,
      totalResumesDeleted
    };
  }
}