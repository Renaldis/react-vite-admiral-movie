import axios from "axios";
import { axiosConfig, axiosConfigMock } from "./config";

import { TokenStore } from "../auth/token-store";

export const api = axios.create(axiosConfig);
export const apiMock = axios.create(axiosConfigMock);

api.interceptors.request.use((config) => {
  const token = TokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
