import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import { registerInput, LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context";
import { signJwt } from "../utils/jwt";

class UserService {
  async register(input: registerInput) {
    const e = "Email is already registered";

    // Get our user by email
    const user = await UserModel.find().findByEmail(input.email).lean();

    if (user) {
      throw new ApolloError(e);
    }
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const e = "Invalid email or password";

    // Get our user by email
    const user = await UserModel.find().findByEmail(input.email).lean();

    if (!user) {
      throw new ApolloError(e);
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError(e);
    }

    // sign a jwt
    const token = signJwt(user);

    // set a cookie for the jwt
    context.res.cookie("accessToken", token, {
      maxAge: 3600000*24*7, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "none",
      secure: false,
    });

    // return the jwt
    return token;
  }
}

export default UserService;
