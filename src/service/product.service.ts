import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  ProductModel,
  UpdateProductInput
} from "../schema/product.schema";
import { User } from "../schema/user.schema";

class ProductService {
  async createProduct(input: CreateProductInput & { user: User["_id"] }) {
    return ProductModel.create(input);
  }

  async findProducts() {
    // Pagination login
    return ProductModel.find().lean();
  }

  async findSingleProduct(input: GetProductInput) {
    return ProductModel.findOne(input).lean();
  }

  async updateProduct(input: UpdateProductInput & { user: User["_id"] }) {
    return ProductModel.findOneAndUpdate({productId: input.productId},{
      user:input.user,
      name:input.name,
      description:input.description,
      price:input.price,
    },{new:true})
  }

  async deleteProduct(productId: string) {
    await ProductModel.deleteOne({ productId }).lean();
    return true;
  }
}

export default ProductService;
