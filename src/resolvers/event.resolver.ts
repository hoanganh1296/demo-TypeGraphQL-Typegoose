import { ApolloError } from "apollo-server-errors";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { EventEntity } from "../entity/event.entity";
import {
  CreateEventInput,
  DeleteEventInput,
  DeleteEventResponse,
  GetEventInput,
  UpdateEventInput,
} from "../types/event.types";
import errorHandler from "../utils/error";

@Resolver()
export default class EventResolver {
  @Query(() => [EventEntity])
  async events(): Promise<EventEntity[]> {
    return await EventEntity.find();
  }

  @Query(() => EventEntity)
  async event(@Arg("input") input: GetEventInput): Promise<EventEntity> {
    const event = await EventEntity.findOneBy({ id: input.eventId });
    if (!event) {
      throw new ApolloError("Event not found", "400");
    }
    return event;
  }

  @Mutation(() => EventEntity)
  async createEvent(@Arg("input") input: CreateEventInput):Promise<EventEntity> {
    const newEvent = new EventEntity();
    newEvent.title = input.title;
    newEvent.maxVoucher = input.maxVoucher;
    await newEvent.save();
    return newEvent;
  }

  @Mutation(() => EventEntity)
  async updateEvent(
    @Arg("input") input: UpdateEventInput
  ): Promise<Partial<EventEntity> | undefined> {
    try {
      const foundEvent = await EventEntity.findOneBy({ id: input.eventId });
      if (!foundEvent) {
        throw new ApolloError("Event not found", "400");
      }
      if(foundEvent.quantityCreated > input.maxVoucher){
        throw new ApolloError("Maximum voucher must be greater than quantity issued", "400")
      }
      foundEvent.title = input.title;
      foundEvent.maxVoucher = input.maxVoucher;
      foundEvent.save();
      return foundEvent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      errorHandler(error);
    }
  }

  @Mutation(() => DeleteEventResponse)
  async deleteEvent(@Arg("input") input: DeleteEventInput): Promise<object> {
    const foundEvent = await EventEntity.findOneBy({ id: input.eventId });
    if (!foundEvent) {
      throw new ApolloError("Event not found", "400");
    }
    await EventEntity.delete({ id: input.eventId });
    return { message: "Event deleted" };
  }
}
