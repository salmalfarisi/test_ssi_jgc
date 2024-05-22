import {
    IsBoolean,
    IsOptional,
    IsString,
    MaxLength,
    Length
  } from 'class-validator';

export class UpdateEmployeeDto {
    id:number;

    @IsString()
    @MaxLength(200)
    name:string;
    
    @IsString()
    @Length(8,8)
    nip:string;

    @IsString()
    @MaxLength(200)
    roles:string;

    @IsString()
    @MaxLength(200)
    department:string;

    join_date:Date;

    @IsOptional()
    url_photo:string;

    @IsString()
    status:string;

    @IsBoolean()
    isActive:boolean;

    @IsBoolean()
    isDelete:boolean;

    @IsOptional()
    created_at:Date;

    @IsOptional()
    updated_at:Date;
}
