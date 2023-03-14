import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput, LoginInput, User } from "../schema/user.schema";
import UserService from "../service/user.service";
import Context from "../types/context";
import { Role } from "../types/type.enum";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => String) // Returns the JWT
  login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
    return this.userService.login(input, context);
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  me(@Ctx() { user }: Required<Context>) {
    return user;
  }

  @Authorized(Role.ADMIN)
  @Query(() => [User])
  public async allUser(): Promise<User[]> {
    const response =  this.userService.getAllUsers();
    return response;
  }
}
