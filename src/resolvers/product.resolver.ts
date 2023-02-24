import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  Product,
  ProductResponse,
  UpdateProductInput
} from "../schema/product.schema";
import ProductService from "../service/product.service";
import Context from "../types/context";

@Resolver()
export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService();
  }

  @Authorized()
  @Mutation(() => Product)
  createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.productService.createProduct({ ...input, user: user?._id });
  }

  @Authorized()
  @Mutation(() => Product)
  updateProduct(
    @Arg("input") input: UpdateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.productService.createProduct({ ...input, user: user?._id });
  }
  
  @Authorized()
  @Mutation(()=>Boolean!)
  deleteProduct(
    @Arg("productId") productId:string,
    @Ctx() context:Context
  ){
    return this.productService.deleteProduct(productId)
  }

  @Query(() => [Product])
  products() {
    return this.productService.findProducts();
  }

  @Query(() => Product)
  product(@Arg("input") input: GetProductInput) {
    return this.productService.findSingleProduct(input);
  }
}
