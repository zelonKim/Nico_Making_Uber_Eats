import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { FieldsOnCorrectTypeRule } from 'graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((type) => String, { defaultValue: 'New York' })
  @Column()
  @IsString()
  address: string;

  // 많은 레스토랑은 하나의 오너만 가짐.
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;

  // 많은 레스토랑은 하나의 카테고리만 가짐.
  @Field((type) => Category, { nullable: true }) // 레스토랑은 카테고리를 가지지 않을 수도 있음.
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;


  @Field(type => [Dish])
  @OneToMany(
    type => Dish,
    dish => dish.restaurant,
  )
  menu: Dish[];
}


