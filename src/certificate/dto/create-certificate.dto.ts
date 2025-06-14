import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateCertificateDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString()
  dob: string;

  @IsNotEmpty({ message: 'Matric No. is required' })
  @IsString()
  matricNo: string;

  @IsNotEmpty({ message: 'Course is required' })
  @IsString()
  course: string;

  @IsNotEmpty({ message: 'Grade is required' })
  @IsIn(['A', 'B', 'C', 'D', 'F'])
  grade: string;

  @IsNotEmpty({ message: 'Graduation year is required' })
  @IsNumberString()
  graduationYear: string;
}
