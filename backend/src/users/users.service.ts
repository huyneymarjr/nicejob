import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto, UpdateProfileDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import { USER_ROLE } from 'src/databases/sample';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { hashPasswordHelper } from 'src/helpers/utils';
import { CodeAuthDto, ForgotPasswordAuthDto, RetryActiveDto, RetryPasswordDto } from 'src/auth/dto/create-auth.dto';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private MailerService: MailerService
  ) { }


  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const {
      name, email, password, age,
      gender, address, role
    } = createUserDto;

    // Check if email exists
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`);
    }

    // Get role details
    const roleDetails = await this.roleModel.findById(role);
    if (!roleDetails) {
      throw new BadRequestException('Role không tồn tại');
    }

    // Only set company if role is HR
    let userData: any = {
      name, 
      email,
      password: this.getHashPassword(password),
      age,
      gender, 
      address, 
      role,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    };

    if (roleDetails.name === 'HR') {
      if (!createUserDto.company) {
        throw new BadRequestException('Company là bắt buộc đối với tài khoản HR');
      }
      userData.company = createUserDto.company;
    }

    let newUser = await this.userModel.create(userData);
    return newUser;
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    //add logic check email
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`)
    }

    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name, email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?._id
    })
    return newRegister;
  }

  async findAll(currentPage: number, limit: number, qs: string, isDeleted?: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    delete filter.isDeleted;

    if (isDeleted === 'true') {
      filter.isDeleted = true;
    } else if (isDeleted === 'false') {
      filter.isDeleted = false;
    }

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    return await this.userModel.findOne({
      _id: id
    })
      .select("-password")
      .populate({ path: "role", select: { name: 1, _id: 1 } })


    //exclude >< include
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({
      path: "role",
      select: { name: 1 }
    });
  }


  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser, _id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new BadRequestException(`Không tìm thấy người dùng có id = ${_id}`);

    const updated = await this.userModel.updateOne(
      { _id: _id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;
  }

  async remove(id: string, user: IUser) {

    if (!mongoose.Types.ObjectId.isValid(id))
      return `not found user`;

    const foundUser = await this.userModel.findById(id);
    if (foundUser && foundUser.email === "admin@gmail.com") {
      throw new BadRequestException("Không thể xóa tài khoản admin@gmail.com");
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.userModel.softDelete({
      _id: id
    })
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken }
    )
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
      .populate({
        path: "role",
        select: { name: 1 }
      });
  }

  async restore(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Không tìm thấy người dùng có id = ${id}`);

    const foundUser = await this.userModel.findOne({ _id: id, isDeleted: true });
    if (!foundUser) {
      throw new BadRequestException("Người dùng không tồn tại hoặc chưa bị xóa.");
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        isDeleted: false,
        deletedBy: null, 
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return foundUser;
  }

  async handleActive(data: CodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })
    if (!user) {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }

    //check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
      //valid => update user
      await this.userModel.updateOne({ _id: data._id }, {
        isActive: true
      })
      return { isBeforeCheck };
    } else {
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }
  }

  async retryActive(data: RetryActiveDto) {
    //check email
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if (user.isActive) {
      throw new BadRequestException("Tài khoản đã được kích hoạt")
    }

    //send Email
    const { v4: uuidv4 } = require('uuid');
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })

    //send email
    this.MailerService.sendMail({
      to: user.email, 
      subject: 'Activate your account at @nicejob', 
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id }
  }

  async retryPassword(data: RetryPasswordDto) {
    //check email
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    //send Email
    const { v4: uuidv4 } = require('uuid'); 
    const codeId = uuidv4();

    //update user
    await user.updateOne({
      codeId: codeId,
      codeExpired: new Date(Date.now() + 5 * 60 * 1000), 
    });

    //send email
    this.MailerService.sendMail({
      to: user.email, 
      subject: 'Change your password account at @neymar', 
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });
    return { _id: user._id, email: user.email, codeId: codeId };
  }

  async forgotPassword(data: ForgotPasswordAuthDto) {
    // Validate that the code is provided
    if (!data.code) {
        throw new BadRequestException('Mã code không được để trống');
    }

    if (data.confirmPassword !== data.password) {
        throw new BadRequestException(
            'Mật khẩu/xác nhận mật khẩu không chính xác.',
        );
    }

    // Check email
    const user = await this.userModel.findOne({ email: data.email });

    if (!user) {
        throw new BadRequestException('Tài khoản không tồn tại');
    }

    // Check if the provided code matches the user's codeId
    if (user.codeId !== data.code) {
        throw new BadRequestException('Mã code không hợp lệ');
    }

    // Check expire code
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);

    if (isBeforeCheck) {
        // Valid => update password
        const newPassword = await hashPasswordHelper(data.password);
        await user.updateOne({ password: newPassword });
        return { isBeforeCheck };
    } else {
        throw new BadRequestException('Mã code không hợp lệ hoặc đã hết hạn');
    }
  }

  async changePassword(user: IUser, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto;

    // Validate user exists
    const existingUser = await this.userModel.findById(user._id);
    if (!existingUser) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // Check if old password is correct
    const isValidPassword = this.isValidPassword(
      oldPassword,
      existingUser.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu mới và xác nhận mật khẩu không khớp',
      );
    }

    // Hash new password and update
    const hashedNewPassword = this.getHashPassword(newPassword);

    const updated = await this.userModel.updateOne(
      { _id: user._id },
      {
        password: hashedNewPassword,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );

    return {
      message: 'Đổi mật khẩu thành công',
    };
  }

  async updateProfile(user: IUser, updateProfileDto: UpdateProfileDto) {
    const updated = await this.userModel.updateOne(
      { _id: user._id },
      {
        ...updateProfileDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );

    return {
      message: "Cập nhật thông tin thành công"
    };
  }

  async getDashboardStatistics() {
    const totalUser = await this.userModel.countDocuments({
      isDeleted: false
    });

    const totalUserWithDeleted = await this.userModel.countDocuments({}); // đếm tất cả user kể cả đã xóa

    const totalUserDeleted = await this.userModel.countDocuments({
      isDeleted: true
    });

    return {
      totalUser,
      totalUserWithDeleted, 
      totalUserDeleted
    };
  }

}
