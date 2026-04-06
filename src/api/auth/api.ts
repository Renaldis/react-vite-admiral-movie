import { api } from "@/libs/axios/api";
import { TLoginOidcParam, TLoginParam, TLoginResponse } from "./type";
import { PERMISSIONS } from "@/commons/constants/permissions";

export const postLogin = async (_payload: TLoginParam): Promise<TLoginResponse> => {
  const data = Promise.resolve({
    data: {
      access_token: "access_token",
      refresh_token: "refresh_token",
      user: {
        id: "1",
        name: "Renaldi",
        email: "renaldis@gmail.com",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: [
          {
            id: "1",
            key: "admin",
            name: "Admin",
            permissions: [
              {
                id: "1",
                key: PERMISSIONS.USERS.READ_USERS,
                name: PERMISSIONS.USERS.READ_USERS,
              },
              {
                id: "2",
                key: PERMISSIONS.PERMISSIONS.READ_PERMISSIONS,
                name: PERMISSIONS.PERMISSIONS.READ_PERMISSIONS,
              },
              {
                id: "3",
                key: PERMISSIONS.ROLES.READ_ROLES,
                name: PERMISSIONS.ROLES.READ_ROLES,
              },
            ],
          },
        ],
      },
    },
  });
  //const { data } = await api({
  //  url: "/auth/login",
  //  method: "POST",
  //  data: payload,
  //});
  return data;
};

export const postLoginOidc = async (payload: TLoginOidcParam): Promise<TLoginResponse> => {
  return {
    data: {
      access_token: "access_token",
      refresh_token: "refresh_token",
      user: {
        id: "1",
        name: "Admin",
        email: "admin@mail.com",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        roles: [
          {
            id: "1",
            key: "admin",
            name: "Admin",
            permissions: [
              {
                id: "1",
                key: PERMISSIONS.USERS.READ_USERS,
                name: PERMISSIONS.USERS.READ_USERS,
              },
              {
                id: "2",
                key: PERMISSIONS.PERMISSIONS.READ_PERMISSIONS,
                name: PERMISSIONS.PERMISSIONS.READ_PERMISSIONS,
              },
              {
                id: "3",
                key: PERMISSIONS.ROLES.READ_ROLES,
                name: PERMISSIONS.ROLES.READ_ROLES,
              },
            ],
          },
        ],
      },
    },
  };
  const { data } = await api({
    url: "/auth/login",
    method: "POST",
    data: payload,
  });
  return data;
};
