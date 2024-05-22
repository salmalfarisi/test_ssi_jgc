import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    Length
  } from 'class-validator';

export class CreateEmployeeDto {
    id:number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    name:string;
    
    @IsNotEmpty()
    @IsString()
    @Length(8,8)
    nip:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    roles:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    department:string;

    @IsNotEmpty()
    join_date:Date;

    @IsOptional()
    url_photo:string;

    @IsNotEmpty()
    @IsString()
    status:string;

    @IsNotEmpty()
    @IsBoolean()
    isActive:boolean;

    @IsNotEmpty()
    @IsBoolean()
    isDelete:boolean;

    @IsOptional()
    created_at:Date;

    @IsOptional()
    updated_at:Date;
}
