import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';
import { CodeAuthDto, ForgotPasswordAuthDto, RetryActiveDto, RetryPasswordDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            throw new BadRequestException('Tài khoản không tồn tại');
        }

        if (!user.isActive) {
            throw new BadRequestException('Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản.');
        }

        const isValid = this.usersService.isValidPassword(pass, user.password);
        if (!isValid) {
            throw new BadRequestException('Mật khẩu không chính xác');
        }

        const { password, ...result } = user.toObject();
        return result;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        
        const payload: any = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        if (role.name === 'HR') {
            payload.company = user.company;
        }

        const refresh_token = this.createRefreshToken(payload);

        await this.usersService.updateUserToken(refresh_token, _id);

        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        });

        const responseData: any = {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions: user.permissions
            }
        };

        if (role.name === 'HR') {
            responseData.user.company = user.company;
        }

        return responseData;
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return {
            _id: newUser?._id,
        };
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
        });
        return refresh_token;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })
            let user = await this.usersService.findUserByToken(refreshToken);
            if (user) {
                const { _id, name, email, role, company, age, gender, address } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role,
                    company,
                    age,
                    gender,
                    address
                };

                const refresh_token = this.createRefreshToken(payload);

                await this.usersService.updateUserToken(refresh_token, _id.toString());

                const userRole = user.role as unknown as { _id: string; name: string }
                const temp = await this.rolesService.findOne(userRole._id)

                response.clearCookie("refresh_token");

                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
                })


                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        company,
                        permissions: temp?.permissions ?? [],
                        age,
                        gender,
                        address
                    }
                };
            } else {
                throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
            }
        } catch (error) {
            throw new BadRequestException(`Refresh token không hợp lệ. Vui lòng login.`)
        }
    }

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "ok";
    }

    checkCode = async (data: CodeAuthDto) => {
        return await this.usersService.handleActive(data);
    }
    
    retryActive = async (data: RetryActiveDto) => {
        return await this.usersService.retryActive(data);
    }

    retryPassword = async (data: RetryPasswordDto) => {
        return await this.usersService.retryPassword(data);
    }
    
    forgotPassword = async (data: ForgotPasswordAuthDto) => {
        return await this.usersService.forgotPassword(data);
    }

    async getProfile(user: IUser) {
        const foundUser = await this.userModel.findOne({ _id: user._id })
            .select('name email age gender address') 
            .lean();
    
        return foundUser;
    }

}
