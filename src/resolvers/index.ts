import UserResolver from "./user.resolver";
import ProductResolver from "./product.resolver";
import EventResolver from "./event.resolver";
import { VoucherEntity } from "../entity/voucher.entity";

export const resolvers = [
  UserResolver,
  ProductResolver,
  EventResolver,
  VoucherEntity
] as const;
