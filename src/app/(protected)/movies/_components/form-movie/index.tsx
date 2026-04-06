import { Button, Col, Form, FormProps, Input, Row, Space, InputNumber } from "antd";
import { useNavigate } from "react-router";
import { Section } from "admiral";

import { useFormErrorHandling } from "@/app/_hooks/form/use-form-error-handling";
import { TResponseError } from "@/commons/types/response";
import { createZodSync } from "@/utils/zod-sync";

import { movieSchema } from "./schema";

interface Props {
  formProps: FormProps;
  loading?: boolean;
  loadingData?: boolean;
  error: TResponseError | null;
  editForm?: boolean;
}

const rule = createZodSync(movieSchema);

const MovieForm = ({ formProps, loading, loadingData, error, editForm }: Props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useFormErrorHandling(error, ({ key, message }) =>
    form.setFields([{ name: key, errors: [message] }]),
  );

  return (
    <Form {...formProps} form={form} layout="vertical">
      <Section loading={loadingData}>
        <Section title="Movie Information">
          <Row gutter={[16, 0]}>
            <Col span={24} sm={12}>
              <Form.Item label="Title" name="title" required rules={[rule]}>
                <Input placeholder="Movie title" />
              </Form.Item>
            </Col>

            <Col span={24} sm={12}>
              <Form.Item label="Release Date" name="release_date" rules={[rule]}>
                <Input type="date" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Overview" name="overview" rules={[rule]}>
                <Input.TextArea placeholder="Movie description" />
              </Form.Item>
            </Col>

            <Col span={24} sm={12}>
              <Form.Item label="Poster URL" name="poster_path" rules={[rule]}>
                <Input placeholder="https://picsum.photos/300/400" />
              </Form.Item>
            </Col>

            <Col span={24} sm={12}>
              <Form.Item label="Rating" name="vote_average" rules={[rule]}>
                <InputNumber min={0} max={10} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            {/* 🔥 Dynamic Genres */}
            <Col span={24}>
              <Form.List name="genres">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Row key={key} gutter={8}>
                        <Col span={20}>
                          <Form.Item name={name} rules={[rule]}>
                            <Input placeholder="Genre (e.g. Action)" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Button danger onClick={() => remove(name)}>
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()}>
                      + Add Genre
                    </Button>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
        </Section>
      </Section>

      <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
        <Space>
          <Button onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {!editForm ? "Save" : "Save Changes"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MovieForm;
