import { VoucherEntity } from "./../entity/voucher.entity";
import { Mutation, Resolver, Arg } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import { CreateVoucherInput } from "../types/voucher.types";
import { customAlphabet } from "nanoid";
import { EventEntity } from "../entity/event.entity";

@Resolver()
export default class VoucherResolver {
  @Mutation(() => VoucherEntity)
  async createVoucher(
    @Arg("input") input: CreateVoucherInput
  ): Promise<VoucherEntity> {
    const event = await EventEntity.findOneBy({ id: input.eventId });
    if (!event) {
      throw new ApolloError("Event not found", "400");
    }
    if (event.quantityCreated >= event.maxVoucher) {
      throw new ApolloError("Maximum Voucher!", "400");
    }
    const newVoucher = new VoucherEntity();
    newVoucher.code = nanoid().toUpperCase();
    newVoucher.event = event;
    await newVoucher.save();
    event.quantityCreated += 1;
    await event.save();
    return newVoucher;
  }
}

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);
