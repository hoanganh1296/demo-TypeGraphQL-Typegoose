import { DataSource } from "typeorm";
import {get} from "node-emoji";
import config from "config";
import { EventEntity } from "../entity/event.entity";
import { VoucherEntity } from "../entity/voucher.entity";

const postgresqlHost = config.get<string>("postgreSQL_Host");
const postgresqlPort = config.get<number>("postgreSQL_Port");
const postgresqlUserName = config.get<string>("postgreSQL_UserName");
const postgresqlPassword = config.get<string>("postgreSQL_Password");

const entities = [EventEntity,VoucherEntity];

export const AppDataSource = new DataSource({
  type: "postgres",
  host: postgresqlHost,
  port: postgresqlPort,
  entities,
  synchronize: true,
  logging: false,
  username: postgresqlUserName,
  password: postgresqlPassword,
  database: "graphQL",
  migrations: ['./src/migrations/*.ts'],
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
