import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { registerInput, LoginInput, User } from "../schema/user.schema";
import UserService from "../service/user.service";
import Context from "../types/context";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  register(@Arg("input") input: registerInput) {
    return this.userService.register(input);
  }

  @Mutation(() => String) // Returns the JWT
  login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context);
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: Context) {
    return context.user;
  }
}
