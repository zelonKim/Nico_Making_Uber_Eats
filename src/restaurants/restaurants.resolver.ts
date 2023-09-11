import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/authUser.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import {
  CreateRestaurantDto,
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';


@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((returns) => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant( // 'createRestaurant()'can be executed only when user`s role is 'Owner'
    @AuthUser() authUser: User,
    @Args('input') createRestaurantData: CreateRestaurantInput,
  ): Promise<boolean> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantData,
    );
  }


  
  @Query((returns) => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }

}
