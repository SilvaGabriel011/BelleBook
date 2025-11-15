import {
  IsDateString,
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RecurringScheduleDto {
  @IsEnum(['daily', 'weekly'])
  frequency: 'daily' | 'weekly';

  @IsDateString()
  until: string;
}

export class BlockTimeDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  reason: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecurringScheduleDto)
  recurring?: RecurringScheduleDto;
}
