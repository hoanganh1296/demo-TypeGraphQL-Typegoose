import EventResolver from "./event.resolver";
import ProductResolver from "./product.resolver";
import UserResolver from "./user.resolver";
import VoucherResolver from "./voucher.resolver";


export const resolvers = [
  UserResolver,
  ProductResolver,
  EventResolver,
  VoucherResolver,
] as const;
