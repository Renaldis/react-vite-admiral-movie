import { Button, Col, DatePicker, Form, FormProps, Input, Row, Select, Space, Switch } from "antd";
import { useNavigate } from "react-router";
import { Section } from "admiral";

import { useFormErrorHandling } from "@/app/_hooks/form/use-form-error-handling";
import { TResponseError } from "@/commons/types/response";
import { createZodSync } from "@/utils/zod-sync";

import { FAQSchema } from "./schema";

interface Props {
  formProps: FormProps;
  loading?: boolean;
  loadingData?: boolean;
  error: TResponseError | null;
  editForm?: boolean;
}

const rule = createZodSync(FAQSchema);

const FormFaq = ({ formProps, loading, loadingData, error, editForm }: Props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useFormErrorHandling(error, ({ key, message }) =>
    form.setFields([{ name: key, errors: [message] }]),
  );

  return (
    <Form {...formProps} form={form} layout="vertical">
      <Section loading={loadingData}>
        <Section title="General Information">
          <Row gutter={[16, 0]}>
            <Col span={24} sm={12}>
              <Form.Item label="Category" name="category" required rules={[rule]}>
                <Select
                  placeholder="Select category"
                  options={[
                    {
                      label: "General",
                      value: "general",
                    },
                    {
                      label: "Technical",
                      value: "technical",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label="Question" name="question" required rules={[rule]}>
                <Input placeholder="e.g. How to create file ?" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Answer" name="answer" required rules={[rule]}>
                <Input.TextArea placeholder="e.g. Go to MS Office" />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label="Valid Until" name="valid_date" rules={[rule]} required>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label="Status" name="status" rules={[rule]}>
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
              </Form.Item>
            </Col>
          </Row>
        </Section>
      </Section>

      <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
        <Space>
          <Button type="default" htmlType="button" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading || formProps.disabled}
            loading={loading}
          >
            {!editForm ? "Save" : "Save Changes"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default FormFaq;
