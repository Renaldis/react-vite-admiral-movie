import { AxiosRequestConfig } from "axios";
import { env } from "../env";

export const axiosConfig: AxiosRequestConfig = {
  baseURL: env.VITE_API_BASE_URL,
};

export const axiosConfigMock: AxiosRequestConfig = {
  baseURL: env.VITE_API_BASE_URL_MOCK,
};
