import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
export class CreateProjectDto {

    @ApiProperty({example: 'project name'})
    @IsString()
    name: string;

    @ApiProperty({example: 'Description'})
    @IsString()
    description: string;
}

//Remaining data we will update later