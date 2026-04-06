import { postLogin } from "@/api/auth/api";
import { TLoginParam, TLoginResponse } from "@/api/auth/type";
import { SessionUser } from "@/libs/localstorage";
import { SessionToken } from "@/libs/cookies";
import { TokenStore } from "@/libs/auth/token-store";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { notification } from "antd";
import { useNavigate } from "react-router";

export const usePostLogin = (): UseMutationResult<
  TLoginResponse,
  unknown,
  TLoginParam,
  unknown
> => {
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["post-login"],
    mutationFn: async (payload) => await postLogin(payload),
    onSuccess: (res) => {
      SessionUser.set({ user: res.data.user });

      // Store access_token in memory
      TokenStore.setAccessToken(res.data.access_token);

      // Store only refresh_token in cookie (securely)
      SessionToken.set({
        refresh_token: res.data.refresh_token
      });

      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");

      if (redirect) {
        navigate(redirect);
      } else {
        navigate(0);
      }
    },
    onError: (error) => {
      notification.error({
        message: "Login Failed",
        description: (error as Error).message,
      });
    },
  });
};
