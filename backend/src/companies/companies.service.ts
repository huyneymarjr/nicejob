import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { Resume, ResumeDocument } from 'src/resumes/schemas/resume.schema';


@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>
  ) { }


  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.companyModel.find(filter)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found company with id=${id}`)
    }

    return await this.companyModel.findById(id);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )

  }

  async remove(id: string, user: IUser) {
    // Update deletedBy for company
    await this.companyModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );

    // Update deletedBy for all jobs belonging to this company
    await this.jobModel.updateMany(
      { 'company._id': id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );

    // Update deletedBy for all resumes related to this company
    await this.resumeModel.updateMany(
      { companyId: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );

    // Soft delete all jobs belonging to this company
    await this.jobModel.softDelete({
      'company._id': id
    });

    // Soft delete all resumes related to this company
    await this.resumeModel.softDelete({
      companyId: id
    });

    // Soft delete the company
    return this.companyModel.softDelete({
      _id: id
    });
  }

  async getTotalJobs(companyId: string) {
    return await this.jobModel.countDocuments({ 'company._id': companyId, isDeleted: false });
  }

  async getDashboardStatistics() {
    const totalCompany = await this.companyModel.countDocuments({
      isDeleted: false
    });

    const totalCompanyWithDeleted = await this.companyModel.countDocuments({}); // đếm tất cả companies kể cả đã xóa

    const totalCompanyDeleted = await this.companyModel.countDocuments({
      isDeleted: true
    });

    return {
      totalCompany,
      totalCompanyWithDeleted,
      totalCompanyDeleted
    };
  }

  async getTopCompanies() {
    // Aggregate để đếm số lượng jobs cho mỗi company và sắp xếp giảm dần
    const topCompanies = await this.companyModel.aggregate([
      {
        $match: { isDeleted: false } // Chỉ lấy các công ty chưa bị xóa
      },
      {
        $project: {
          name: 1,
          logo: 1, 
          totalJobs: 1,
          location: "$address"
        }
      },
      {
        $sort: { totalJobs: -1 } // Sắp xếp giảm dần theo totalJobs
      },
      {
        $limit: 10 // Giới hạn 10 kết quả
      }
    ]);

    return {
      data: topCompanies,
      meta: {
        total: topCompanies.length
      }
    };
  }
}
