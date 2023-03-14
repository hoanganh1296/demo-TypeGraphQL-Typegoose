import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Application, Request } from "express";
import { Server } from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";

import { resolvers } from "./resolvers";
import { User } from "./schema/user.schema";
import Context from "./types/context";
import { CustomAuthChecker } from "./utils/authChecker";
import { connectMongoDB } from "./utils/mongo";
import { postgresqlConnection } from "./utils/mysqlDataSource";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import config from "config";
import "./bull/workers/sendMail.worker";
import serverAdapter from "./bull";
import { shutdownGracefully } from "./utils/helpers/gracefull-shutdown";
import { emailQueue } from "./bull/queues/queue.email";
dotenv.config();

async function bootstrap() {
  // Build the schema
  const schema = await buildSchema({
    resolvers,
    authChecker: CustomAuthChecker,
    container: Container,
  });
  // Init express
  const app: Application = express();
  let server: Server;
  app.use(cookieParser());
  // app.use(morgan("combined"));
  app.use("/admin/queues", serverAdapter.getRouter());

  // Create the apollo server
  const serverApolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): Context => {
      return {
        req: req,
        res: res,
        user: (req as Request & { user?: User }).user,
      };
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await serverApolloServer.start();
  // apply middleware to server

  serverApolloServer.applyMiddleware({ app });

  // app.listen on express server
  emailQueue.resume().then(() => {
    server = app.listen({ port: 4000 }, () => {
      console.log("🚀 App is listening on http://localhost:4000");
    });
  });
  connectMongoDB();
  postgresqlConnection();

  // Gracefully shutdown
  process.on("SIGINT", () => shutdownGracefully(server));
  process.on("SIGTERM", () => shutdownGracefully(server));
}

export default bootstrap;
