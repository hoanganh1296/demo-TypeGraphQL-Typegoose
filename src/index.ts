import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginDrainHttpServer
} from "apollo-server-core";
import http from "http";
import { resolvers } from "./resolvers";
import { connectToMongo } from "./utils/mongo";
import { verifyJwt } from "./utils/jwt";
import { User } from "./schema/user.schema";
import Context from "./types/context";
import authChecker from "./utils/authChecker";

export const corsOptions = {
  origin: [
    'https://studio.apollographql.com',
    'http://localhost:4000',
    'http://localhost:3000',
  ],
  credentials: true,
};

async function bootstrap() {
  // Build the schema

  const schema = await buildSchema({
    resolvers,
    authChecker,
  });

  // Init express
  const app = express();
  app.use(cookieParser());
  app.use(cors(corsOptions))
  app.use(express.urlencoded({ extended: true}))
  const httpServer = http.createServer(app);

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
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();
  // apply middleware to server

  server.applyMiddleware({ app,cors:corsOptions });

  // app.listen on express server
  app.listen({ port: 4000 }, () => {
    console.log("App is listening on http://localhost:4000");
  });
  connectToMongo();
  process.on("unhandledRejection", (err: any) => {
    console.log("UNHANDLED REJECTION ?? Shutting down...");
    console.log(err);
    console.error("Error?", err.message);

    httpServer.close(async () => {
      process.exit(1);
    });
  });
}

bootstrap();
