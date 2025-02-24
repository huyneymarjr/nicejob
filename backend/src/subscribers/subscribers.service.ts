import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
    
    private mailerService: MailerService
  ) { }

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { name, email, skills } = createSubscriberDto;
    const isExist = await this.subscriberModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`)
    }

    let newSubs = await this.subscriberModel.create({
      name, email, skills,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return {
      _id: newSubs?._id,
      createdBy: newSubs?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.subscriberModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select(projection as any)
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
      return `not found subscribers`;

    return await this.subscriberModel.findOne({
      _id: id
    })
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    // Update subscriber info
    const updated = await this.subscriberModel.updateOne(
      { email: user.email },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      },
      { upsert: true }
    );

    // Find jobs matching subscriber skills
    const subscriber = await this.subscriberModel.findOne({ email: user.email });
    if (subscriber) {
      const subscriberSkills = subscriber.skills;
      const jobsWithMatchingSkills = await this.jobModel.find({ 
        skills: { $in: subscriberSkills },
        isDeleted: false
      });

      if (jobsWithMatchingSkills?.length) {
        // Format jobs data for email
        const jobs = jobsWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }
        });

        // Send notification email
        await this.mailerService.sendMail({
          to: user.email,
          from: '"NiceJob" <support@nicejob.com>',
          subject: 'Job Matches Based on Your Skills',
          template: 'new-job',
          context: {
            receiver: subscriber.name || user.email,
            jobs: jobs
          }
        });
      }
    }

    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found subscribers`;


    await this.subscriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.subscriberModel.softDelete({
      _id: id
    })
  }

  async getSkills(user: IUser) {
    const { email } = user;
    return await this.subscriberModel.findOne({ email }, { skills: 1 })
  }
}