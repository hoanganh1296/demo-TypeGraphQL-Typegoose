import { registerEnumType } from "type-graphql";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

registerEnumType(Role, {
  name: "Role",
  description: "Role of users",
  valuesConfig: {
    USER: {
      description: "Normal user",
    },
    ADMIN: {
      description: "Administrator",
    },
  },
});
