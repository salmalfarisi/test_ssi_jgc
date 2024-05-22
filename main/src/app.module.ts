import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "",
      "database": "test",
      "entities": [join(__dirname, '**', '*.entity.{ts,js}')],
      "synchronize": false
    }), 
    EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
