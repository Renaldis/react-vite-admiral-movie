import { FC, PropsWithChildren, ReactNode } from "react";

type TProps = PropsWithChildren<{
  permissions?: Array<string>; // optional
  fallback?: ReactNode;
}>;

export const Guard: FC<TProps> = ({ children }) => {
  return <>{children}</>;
};
