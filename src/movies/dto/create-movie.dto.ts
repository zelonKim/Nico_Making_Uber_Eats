import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  @IsOptional()
  @IsString({ each: true }) // each옵션을 통해 모든 요소를 각각 하나씩 검사함.
  readonly genres: string[];
}
