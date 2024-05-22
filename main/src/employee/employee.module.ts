import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), ConfigModule.forRoot(),],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
