import {
  Args,
  Query,
  Resolver,
  Mutation,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/authUser.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  CategoryInput,
  CategoryOutput,
} from 'src/restaurants/dtos/category.dto';
import { User, UserRole } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import {
  CreateRestaurantDto,
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((returns) => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantData: CreateRestaurantInput,
  ): Promise<boolean> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantData,
    );
  }


  @Mutation((returns) => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() authUser: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }


  @Mutation((returns) => EditRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput);
  }


  @Query((returns) => RestaurantsOutput)
  restaurants(@Args('input') restaurantsInput: RestaurantsInput): Promise<Restaurant[]> {
    return this.restaurantService.allRestaurants(restaurantsInput);
  }


  @Query(returns => RestaurantOutput)
  restaurant(
    @Args('iniput') restaurantInput: RestaurantInput
  ): Promise<RestaurantOutput>{
    return this.restaurantService.findRestaurantById(restaurantInput)
  }


  @Query(returns => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') searchRestauratnInput: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
      return this.restaurantService.searchRestaurantByName(
        searchRestauratnInput,
      );
    }
}


/////////////////////////////


@Resolver((of) => Cateogry)
export class CateogryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField((type) => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    // @Parent() extracts the parent/root object from the underlying platform
    return this.restaurantService.countRestaurants(category);
  }

  @Query((type) => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }

  @Query((type) => CategoryOutput)
  category(@Args('input') categoryInput: CategoryInput): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}
