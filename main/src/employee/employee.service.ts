import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeService {

    constructor(@InjectRepository(Employee) private EmployeesRepository: Repository<Employee>) { }

    async get(): Promise<Employee[]> {
        return await this.EmployeesRepository.find({
          where:[{"isDelete":false}]
        });
    }
      
    async getById(_id: number): Promise<Employee> {
        var data = await this.EmployeesRepository.find({
            select: ["name", "nip", "roles", "department", "photo", "join_date", "status", "isActive"],
            where: [{ "id": _id }]
        });
        return data[0];
    }

    async checkExist(name:string, nip:string) {
        var data = await this.EmployeesRepository.find({
            where:[
              { "name" : name },
              { "nip" : nip }
            ]
        });

        if(data.length == 0)
        {
          return false; 
        }
        else
        {
          return true;
        }
    }

    async create(Employee: Employee) {
      this.EmployeesRepository.save(Employee);
    }

    async update(target:number, Employee: Employee) {
      this.EmployeesRepository.update({ id:target },  Employee)
    }

    async delete(target:number) {
        var update = new Employee();
        update.isDelete = true;
        var date = new Date();
        date.setHours(date.getHours() + 7);
        update.updated_at = date;
        this.EmployeesRepository.update({ id:target },  update);
    }
}