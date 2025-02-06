import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {}

export class RetryPasswordDto { 
    @IsString()
    email: string;
}

export class RetryActiveDto { 
    @IsString()
    email: string;
}

export class CodeAuthDto {
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsNotEmpty({ message: "code không được để trống" })
    code: string;

}

export class ForgotPasswordAuthDto {
    @IsNotEmpty({ message: "Mã code không được để trống" })
    code: string;

    @IsNotEmpty({ message: "password không được để trống" })
    password: string;

    @IsNotEmpty({ message: "confirmPassword không được để trống" })
    confirmPassword: string;

    @IsNotEmpty({ message: "email không được để trống" })
    email: string;
}
