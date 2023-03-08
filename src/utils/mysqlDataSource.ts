import { DataSource } from "typeorm";
import {get} from "node-emoji";
import config from "config";
import { EventEntity } from "../entity/event.entity";
import { VoucherEntity } from "../entity/voucher.entity";

const mysqlHost = config.get<string>("mySQL_Host");
const mysqlPort = config.get<number>("mySQL_Port");
const mysqlUserName = config.get<string>("mySQL_UserName");
const mysqlPassword = config.get<string>("mySQL_Password");

const entities = [EventEntity,VoucherEntity];

const AppDataSource = new DataSource({
  type: "mysql",
  host: mysqlHost,
  port: mysqlPort,
  entities,
  synchronize: true,
  logging: true,
  username: mysqlUserName,
  password: mysqlPassword,
  database: "db",
  migrations: [],
  subscribers: [],
});


export const mysqlConnection = async (): Promise<void> => {
    try {
      await AppDataSource.initialize();
      console.log(get("dvd"), "DB init -> Done!", get("dvd"));
      entities.forEach((entity) => console.log(`Created ${entity.name}`));
    } catch (error) {
      console.log(error);
    }
  };
