import { Page } from "admiral";
import { useNavigate } from "react-router";
import { message } from "antd";

import { ROUTES } from "@/commons/constants/routes";

import FormFaq from "../_components/form";
import useCreateFaq from "./_hooks/use-create-faq";
import { TFAQFormData } from "../_components/form/schema";
import { formatDate } from "@/utils/date-format";

export const Component = () => {
  const navigate = useNavigate();
  const createMutation = useCreateFaq();

  const breadcrumbs = [
    {
      label: "FAQs",
      path: ROUTES.faq.list,
    },
    {
      label: "Create FAQ",
      path: "",
    },
  ];

  return (
    <Page
      title="Create FAQ"
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.faq.list)}
    >
      <FormFaq
        error={createMutation.error}
        loading={createMutation.isPending}
        editForm={false}
        formProps={{
          onFinish: (data: TFAQFormData) => {
            const validDate = formatDate(data.valid_date) ?? "";
            createMutation.mutate(
              {
                ...data,
                valid_date: validDate,
                status: data.status ? "active" : "hide",
              },
              {
                onSuccess: () => {
                  message.success("FAQ created successfully");
                  navigate(ROUTES.faq.list);
                },
              },
            );
          },
        }}
      />
    </Page>
  );
};

export default Component;
