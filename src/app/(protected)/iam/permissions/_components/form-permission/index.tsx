import { FC } from "react";
import { Button, Form, Input } from "antd";
import { FormProps } from "antd/lib";
import { createZodSync } from "@/utils/zod-sync";

import { PermissionFormSchema } from "./schema";
import { TResponseError } from "@/commons/types/response";
import { useFormErrorHandling } from "@/app/_hooks/form/use-form-error-handling";

type Props = {
  formProps: FormProps;
  loading: boolean;
  error: TResponseError | null;
};

const rule = createZodSync(PermissionFormSchema);

export const FormPermission: FC<Props> = ({ formProps, error, loading }) => {
  const [form] = Form.useForm();

  useFormErrorHandling(error, ({ key, message }) =>
    form.setFields([{ name: key, errors: [message] }]),
  );

  return (
    <Form {...formProps} form={form} layout="vertical">
      <Form.Item label="Name" name="name" rules={[rule]}>
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item label="Key" name="permissionKey" rules={[rule]}>
        <Input placeholder="Key" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
