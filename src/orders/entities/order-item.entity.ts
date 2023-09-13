import { Dish } from "src/restaurants/entities/dish.entity";
import { ManyToOne } from "typeorm";

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity { 
    @Field(type => Dish)
    @ManyToOne(
        type => Dish, {nullable: true, onDelete: 'CASCADE'}
    )
    dish: Dish;

    @Field(type => [DishOption], {nullable: true})
    @Column({ type: 'json', nullable: true})
    options?: DishOption[];
}