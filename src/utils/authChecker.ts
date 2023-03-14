import { AuthCheckerInterface, ResolverData } from "type-graphql";
import { User, UserModel } from '../schema/user.schema';
import Context from "../types/context";
import { verifyJwt } from './jwt';


export class CustomAuthChecker implements AuthCheckerInterface<Context>{
  async check({context}:ResolverData<Context>,roles:string[]):Promise<boolean>{
    try {
      const authorization = context.req.headers.authorization;
      if (!authorization) return false;
      const [schema, token] = authorization.split(' ');
      if (schema !== 'Bearer') return false;
      const payload = verifyJwt<User>(token);
      //
      const user = await UserModel.findById(payload?._id).lean();

      if (!user) return false;

      if (!roles.includes(user.role) && roles.length !== 0) return false;

      context.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
