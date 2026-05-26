import { userRolesEnum } from "./constants";

export type UserRoleType = (typeof userRolesEnum)[number];

export type AccessPayloadType = {
  userId: string;
  username: string;
  role: UserRoleType;
};

export type RefreshPayloadType = {
  username: string;
};
