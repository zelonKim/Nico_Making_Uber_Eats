import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LessThan } from 'typeorm';
import {
  CreatePaymentInput,
  createPaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentsOutput } from './dtos/get-payments.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Respository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Respository<Restaurant>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createPayment({
    transactionId,
    restaurantId,
  }: CreatePaymentInput): Promise<createPaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restuarant) {
        return {
          ok: false,
          error: 'Restaurants not found',
        };
      }
      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'You are not allowed to do this',
        };
      }


      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );
    restaurant.isPromoted = true;
    const date = new Date();
    date.setDate(date.getDate() + 7); // returns the date 7days after
    restaurant.promotedUntil = date;
    this.restaurants.save(restaurant);
      return {
        ok: true,
      };
    } catch {
      return { ok: false, error: 'Can not create payment' };
    }
  }

  async getPayments(user: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.payments.find({ user: user });
      return {
        ok: true,
        payments,
      };
    } catch {
      return {
        ok: false,
        error: 'Can not load payments',
      };
    }
  }

  @Interval(2000)
  async checkPromotedRestaurants() {
    const restaurants = await this.restaurants.find({
      isPromoted: true,
      promotedUntil: LessThan(new Date()),
    });

    restaurants.forEach(async (restaurant) => {
      restaurant.isPromoted = false;
      restaurant.promotedUntil = null;
      await this.restaurants.save(restaurant);
    }); // if promotedUntil is less than Now date, ends the promotion
  }
}
