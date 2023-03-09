import { DataSource } from "typeorm";
import * as path from "path";
import { get } from "node-emoji";
import config from "config";
import { EventEntity } from "../entities/event.entity";
import { VoucherEntity } from "../entities/voucher.entity";

const postgresqlHost = config.get<string>("postgreSQL_Host");
const postgresqlPort = config.get<number>("postgreSQL_Port");
const postgresqlUserName = config.get<string>("postgreSQL_UserName");
const postgresqlPassword = config.get<string>("postgreSQL_Password");

const entities = [EventEntity, VoucherEntity];

export const AppDataSource = new DataSource({
  type: "postgres",
  host: postgresqlHost,
  port: postgresqlPort,
  entities: [path.join(__dirname, "..", "/entities/*.ts")],
  synchronize: true,
  logging: false,
  username: postgresqlUserName,
  password: postgresqlPassword,
  database: "graphQL",
  migrations: [path.join(__dirname, "..", "/migrations/*.ts")],
  subscribers: [],
});

export const postgresqlConnection = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log(get("dvd"), "DB init -> Done!", get("dvd"));
    entities.forEach((entity) => console.log(`Created ${entity.name}`));
  } catch (error) {
    console.log(error);
  }
};
