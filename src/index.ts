import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import morgan from "morgan";

import { resolvers } from "./resolvers";
import { User } from "./schema/user.schema";
import Context from "./types/context";
import authChecker from "./utils/authChecker";
import { verifyJwt } from "./utils/jwt";
import { connectToMongo } from "./utils/mongo";
import { postgresqlConnection } from "./utils/mysqlDataSource";
import "./bull/workers/sendMail.worker" 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import config from "config";
import serverAdapter from "./bull";
dotenv.config();

async function bootstrap() {
  // Build the schema
  const schema = await buildSchema({
    resolvers,
    authChecker,
  });
  // Init express
  const app = express();
  app.use(cookieParser());
  // app.use(morgan("combined"));
  app.use('/admin/queues', serverAdapter.getRouter());

  // Create the apollo server
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx;

      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<User>(ctx.req.cookies.accessToken);
        context.user = user;
      }
      return context;
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();
  // apply middleware to server

  server.applyMiddleware({ app });

  // app.listen on express server
  app.listen({ port: 4000 }, () => {
    console.log("App is listening on http://localhost:4000");
  });
  connectToMongo();
  postgresqlConnection();
}

bootstrap();
