import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query, Response, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

const path = require('path');

const multer = require("multer");

const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};

export const uploadFoto = {
  fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(jpg|png|jpeg)$/)) {
          cb(null, true);
      } else {
          cb("File is not supported", false);
      }
  },
  storage: diskStorage({
      destination: (req: any, file: any, cb: any) => {
        cb(null, process.env.PATH_UPLOAD);
      },
      filename: (req: any, file: any, cb: any) => {
          const fileName = file.originalname.toLowerCase().split(' ').join('-');
          // const fileName = "employee_" + new Date().toISOString() + "." + file.mimetype.split("/")[1];
          cb(null, fileName)
      },
  }),
};

export const uploadCSV = {
  fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(csv)$/)) {
          cb(null, true);
      } else {
          cb("File is not supported", false);
      }
  },
  storage: diskStorage({
      destination: (req: any, file: any, cb: any) => {
        cb(null, process.env.PATH_UPLOAD);
      },
      filename: (req: any, file: any, cb: any) => {
          const fileName = file.originalname.toLowerCase().split(' ').join('-');
          cb(null, fileName)
      },
  }),
};

@Controller('api/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService,
    private readonly config: ConfigService
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], uploadFoto))
  async create(
    @UploadedFiles() file:{
      photo?: Express.Multer.File[],
    },
    @Body() createEmployeeDto: CreateEmployeeDto) {
      var insertdata = new Employee();
      if(file.photo != undefined && file.photo != null)
      {
        var getdate = Math.floor(new Date().getTime() / 1000)
        var changename = "employee_" + getdate + "." + file.photo[0].mimetype.split("/")[1];
        await fse.move(this.config.get<string>('PATH_UPLOAD') + file.photo[0].filename, this.config.get<string>('IMAGE_EMPLOYEE') + changename);
        insertdata.photo = changename;
      }
      else
      {
        insertdata.photo = createEmployeeDto.url_photo;
      }

      insertdata.name = createEmployeeDto.name;
      insertdata.nip = createEmployeeDto.nip;
      insertdata.roles = createEmployeeDto.roles;
      insertdata.department = createEmployeeDto.department;
      insertdata.join_date = createEmployeeDto.join_date;
      insertdata.status = createEmployeeDto.status;
      insertdata.isActive = true;
      insertdata.isDelete = false;
      insertdata.created_at = new Date();
      insertdata.updated_at = new Date();

      // await this.employeeService.create(insertdata);

      return {
        insertdata
      }
  }

  @Get()
  findAll() {
    return this.employeeService.get();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.getById(parseInt(id));
  }

  @Post(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], uploadFoto))
  async update(
    @Param('id') id: string, 
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFiles() file:{
      photo?: Express.Multer.File[],
    },
  ) {
    var data = await this.employeeService.getById(parseInt(id));
    var updatedata = new Employee();

    if(file.photo != undefined && file.photo != null)
    {
      var getdate = Math.floor(new Date().getTime() / 1000)
      var changename = "employee_" + getdate + "." + file.photo[0].mimetype.split("/")[1];
      await fse.move(this.config.get<string>('PATH_UPLOAD') + file.photo[0].filename, this.config.get<string>('IMAGE_EMPLOYEE') + changename);
      updatedata.photo = changename;

      var checkurl = data.photo.includes("http");
      if(checkurl == false)
      {
        try
        {
          let dummyfile = this.config.get<string>('IMAGE_EMPLOYEE') + data.photo;
          let getCurrentpath = path.dirname(fs.realpathSync(dummyfile));
          console.log(getCurrentpath);
          await fse.rm(getCurrentpath.replace(dummyfile, "") + "//" + dummyfile.split("/")[4], { recursive:true }, (err) => {
              if (err) {
                throw err;
              }
              console.log(`${data.photo} is deleted!`);
            }
          );
        }
        catch(e)
        {
          // kosong aja kalo emang datanya gak ada
          // await this.error.generateBadRequestException("Error " + e);
        }  
      }
    }
    else
    {
      updatedata.photo = updateEmployeeDto.url_photo;
    }

    updatedata.name = updateEmployeeDto.name;
    updatedata.nip = updateEmployeeDto.nip;
    updatedata.roles = updateEmployeeDto.roles;
    updatedata.department = updateEmployeeDto.department;
    updatedata.join_date = updateEmployeeDto.join_date;
    updatedata.status = updateEmployeeDto.status;
    updatedata.updated_at = new Date(); 

    await this.employeeService.update(parseInt(id), updatedata);
    return {
      updatedata
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.employeeService.delete(parseInt(id));

    return {
      message:"Successfully delete data"
    }
  }

  @Post('upload/csv')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'csv', maxCount: 1 }], uploadCSV))
  async testcsv(
    @UploadedFiles() file:{
      csv?: Express.Multer.File[],
    },
  ) {
    const csvtojson = require('csvtojson');
    var array = await csvtojson().fromFile(file.csv[0].path);
    for(var i = 0; i < array.length; i++)
    {
      var getdata = array[i];
      if(getdata.nama != null && getdata.nama != undefined && getdata.nomor != null && getdata.nomor != undefined)
      {
        var result = await this.employeeService.checkExist(getdata.nama, getdata.nomor);
        if(result == false)
        {
          var insertdata = new Employee();
          insertdata.name = getdata.nama;
          insertdata.nip = getdata.nomor;
          insertdata.roles = getdata.jabatan;
          insertdata.department = getdata.departmen;
          insertdata.join_date = getdata.tanggal_masuk;
          insertdata.photo = getdata.foto;
          insertdata.status = getdata.status;
          insertdata.isDelete = false;
          insertdata.isActive = true;
          insertdata.created_at = new Date();
          insertdata.updated_at = new Date();
          
          await this.employeeService.create(insertdata);
        }  
      }
    }

    return {
      success:true
    }
  }

  @Get('download/file')
  async exportData(
    @Query('type') type: string,
    @Response() res
  )
  {
    if(type != 'csv' && type != 'pdf')
    {
      throw new BadRequestException("type field must csv or pdf");
    }

    var DB = await this.employeeService.get();
    var data = [];
    for(var i = 0; i < DB.length; i++)
    {
      var getdata = DB[i];
      var setoutput = {};
      setoutput['name'] = getdata.name;
      setoutput['nip'] = getdata.nip;
      setoutput['roles'] = getdata.roles;
      setoutput['department'] = getdata.department;
      setoutput['join_date'] = new Date(getdata.join_date).toISOString().split("T")[0];
      setoutput['photo'] = getdata.photo;
      setoutput['status'] = getdata.status;

      data.push(setoutput);
    }
    // console.log(data);

    if(type == "csv")
    {
      const csvWriter = require('csv-writer');

      try
      {
        // console.log(path.resolve(process.env.CSV_FILE, 'data_employee.csv'));
        const writer = await csvWriter.createObjectCsvWriter({
          path: path.resolve(process.env.CSV_FILE, 'data_employee.csv'),
          header: [
            { id: 'name', title: 'nama' },
            { id: 'nip', title: 'nomor' },
            { id: 'roles', title: 'jabatan' },
            { id: 'department', title: 'departmen' },
            { id: 'join_date', title: 'tanggal_masuk' },
            { id: 'photo', title: 'foto' },
            { id: 'status', title: 'status' },
          ],
        });
        
        await writer.writeRecords(data).then(success => {
          console.log('Done!');
        }).catch(e => {
          console.log(e)
        });

        const options = {
            root: path.resolve(process.env.CSV_FILE)
        };
    
        const fileName = 'data_employee.csv';
        res.sendFile(fileName, options, function (err) {
            if (err) {
                console.error('Error sending file:', err);
            } else {
                console.log('Sent:', fileName);
            }
        });
      }
      catch(e)
      {
        console.log(e);
      } 
    }
    else if(type == "pdf")
    {
      var outputdata = [];
      outputdata.push([
        { text: 'Nama', style: 'tableHeader' },
        { text: 'Nomor', style: 'tableHeader' },
        { text: 'Jabatan', style: 'tableHeader' },
        { text: 'Departmen', style: 'tableHeader' },
        { text: 'Tanggal Masuk', style: 'tableHeader' },
        { text: 'Foto', style: 'tableHeader' },
        { text: 'Status', style: 'tableHeader' },
      ]);

      for(var i = 0; i < data.length; i++)
      {
        var getconvertdata = data[i];
        var setarray = [];
        var panjangdata = Object.values(getconvertdata);
        for(var j = 0; j < panjangdata.length; j++)
        {
          setarray.push(
            {
              text:panjangdata[j]
            }
          );  
        }
        outputdata.push(setarray);
      }
      var setfile = {
        pageOrientation: 'landscape',
        content:
        [
          {
            table: 
            {
              headerRows: 1,
              widths: [ 100, 100, 100, 100, 100, 100, 100],
              body: outputdata
            }
          },
        ],
        styles: 
        {
          header: 
          {
            fontSize: 18,
            bold: true,
            margin: [0, 5, 0, 5],
            alignment: 'center'
          },
          tableHeader: 
          {
            fillColor: '#000000',
            color: 'white'
          }
        }
      };

      var PdfPrinter = require('pdfmake');

      var fonts = {
        Roboto: {
          normal: 'public/font/ARIAL.ttf',
          bold: 'public/font/ARIALBD.ttf',
          italics: 'public/font/ARIALI.ttf',
          bolditalics: 'public/font/ARIALBI.ttf'
        }
     }

      var printer = new PdfPrinter(fonts);
      var pdfDoc = printer.createPdfKitDocument(setfile, {});
      await pdfDoc.pipe(fs.createWriteStream(process.env.CSV_FILE + 'data_employee.pdf'));
      await pdfDoc.end();

      const options = {
        root: path.resolve(process.env.CSV_FILE)
      };

      const fileName = 'data_employee.pdf';
      res.sendFile(fileName, options, function (err) {
          if (err) {
              console.error('Error sending file:', err);
          } else {
              console.log('Sent:', fileName);
          }
      });
    }
    else
    {
      throw new BadRequestException("ERROR")
    }
  }
}
