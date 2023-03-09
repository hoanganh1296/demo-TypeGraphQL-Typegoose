import { VoucherEntity } from "../entities/voucher.entity";
import { Mutation, Resolver, Arg } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import { CreateVoucherInput } from "../types/voucher.types";
import { customAlphabet } from "nanoid";
import { EventEntity } from "../entities/event.entity";
import { AppDataSource } from "../utils/mysqlDataSource";
import { InsertResult } from "typeorm";

@Resolver()
export default class VoucherResolver {
  @Mutation(() => VoucherEntity)
  async createVoucher(
    @Arg("input") input: CreateVoucherInput
  ): Promise<InsertResult> {
    const code = nanoid();
    const voucher = await AppDataSource.manager.transaction(
      "SERIALIZABLE",
      async (transactionalEntityManager) => {
        const event = await transactionalEntityManager
          .createQueryBuilder(EventEntity, "events")
          .where("events.id = :id", { id: input.eventId })
          .andWhere('"events"."quantityCreated" < "events"."maxVoucher"')
          .getOne();

        if (!event) {
          throw new ApolloError("Maximum voucher", "400");
        }

        const newVoucher = await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(VoucherEntity)
          .values({ code: code, event: event })
          .returning("*")
          .execute();

        await transactionalEntityManager
          .createQueryBuilder(EventEntity, "events")
          .update(EventEntity)
          .set({ quantityCreated: () => '"events"."quantityCreated" + 1' })
          .where("id = :id", { id: input.eventId })
          .execute();

        return newVoucher.raw[0];
      }
    );
    return voucher;
  }
}

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);
