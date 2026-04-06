import { TFaqStatus } from "@/api/example/type";
import { TagProps } from "antd/lib";

const getFaqStatus = (
  status?: TFaqStatus,
): {
  label: string;
  color: TagProps["color"];
} => {
  switch (status) {
    case "active":
      return {
        label: "Active",
        color: "green",
      };
    case "hide":
      return {
        label: "Hidden",
        color: "orange",
      };
    default:
      return {
        label: status || "",
        color: "default",
      };
  }
};

export default getFaqStatus;
