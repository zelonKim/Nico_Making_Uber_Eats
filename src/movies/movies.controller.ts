import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') movieId: number): Movie {
    return this.moviesService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData);
  }

  @Delete(':id')
  remove(@Param('id') movieId: number) {
    return this.moviesService.deleteOne(movieId);
  }

  @Patch(':id')
  patch(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto) {
    return this.moviesService.update(movieId, updateData);
  }
}



/////////////////////////

/* 
  @Get() // GET http://localhost:3000/movies
  getAll() {
    return 'This will return all movies';
  }

  @Get('search') // GET localhost:3000/movies/search?year=1995
  search(@Query('year') searchingYear: string) {
    // 쿼리스트링 키의 해당 값을 가져온 후, 이를 searchingYear 변수에 담아줌.
    return `We are searching for a movie released after ${searchingYear}`; // We are searching for a movie released after 1995
  }

  @Post() // POST http://localhost:3000/movies
  create(@Body() movieData) {
    return movieData; // Body에 입력된 값이 출력됨. { "name": "Seongjin", "director": "Nico" }
  }

  @Delete('/:id') // DELETE http://localhost:3000/movies/1
  remove(@Param('id') movieId: string) {
    return `This will delete a movie with the id ${movieId}`; // This will delete a movie with the id 1
  }

  @Patch('/:id') // PATCH http://localhost:3000/movies/1
  patch(@Param('id') movieId: string, @Body() updateData) {
    return {
      updatedMovie: movieId,
      ...updateData,
    }; // { "updatedMovie": "1", "name": "Seongjin", "director": "Nico" }
  } 
  */
