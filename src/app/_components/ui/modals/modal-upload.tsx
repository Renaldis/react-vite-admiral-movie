import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Flex, Form, FormProps, Modal, Space, Typography, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { UploadFile } from "antd/lib";
import { RcFile } from "antd/lib/upload";
import { useState } from "react";
import "./style.css";

/**
 * UploadPopup Component
 *
 * A modal component that provides a user interface for uploading files with drag-and-drop functionality.
 * Supports file validation for size and type, optional download template functionality, and form submission.
 *
 * @example
 * ```tsx
 * <UploadPopup
 *   title="Upload Risk Data"
 *   open={modalUploadOpen}
 *   withDownloadTemplate={true}
 *   onTemplateDownload={handleTemplateDownload}
 *   onUpload={handleFileUpload}
 *   onCancel={() => setModalUploadOpen(false)}
 *   maxFileSize={10} // Optional, in MB
 * />
 * ```
 */
type TFormData = {
  upload_data: UploadChangeParam;
};

/**
 * Props for the UploadPopup component
 */
interface Props {
  /** Modal title */
  title?: string;
  /** Whether the modal is open */
  open: boolean;
  /** Whether to show the download template button */
  withDownloadTemplate?: boolean;
  /** Callback function for download template action */
  onTemplateDownload?: () => Promise<void>;
  /** Callback function for upload action - receives FormData object with the selected file */
  onUpload: ({ file }: { file: FormData }, reset?: () => void) => Promise<void>;
  /** Callback function when cancel button is clicked */
  onCancel: (reset?: () => void) => void;
  /** Maximum file size allowed for upload in MB. Default is 2MB */
  maxFileSize?: number;
}

/** Default maximum file size allowed for upload in MB */
const DEFAULT_MAX_FILE_SIZE = 2;

/** List of accepted MIME types for file uploads */
const ACCEPTED_FILE_TYPES = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

/**
 * Main UploadPopup component that renders a modal with file upload functionality
 * @param props Component properties as defined in Props interface
 * @returns JSX Element for the upload modal
 */
const UploadPopup = ({
  open,
  title,
  onUpload,
  onCancel,
  onTemplateDownload,
  withDownloadTemplate,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
}: Props) => {
  const [file, setFile] = useState<UploadFile[] | undefined>([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [validationError, setValidationError] = useState<string[]>([]);
  const [form] = Form.useForm();

  const error = form.getFieldError("upload_data").length || validationError.length;
  const errMessage = [...validationError, ...form.getFieldError("upload_data")];

  const resetStates = () => {
    setValidationError([]);
    setFile([]);
    setValidationError([]);
    form.resetFields(["upload_data"]);
    setLoadingDownload(false);
    setLoadingUpload(false);
  };

  const handleChangeUpload = async (info: UploadChangeParam) => {
    setLoadingUpload(info.file.status === "uploading");
    const { fileList } = info;
    setFile(fileList);
    form.validateFields(["upload_data"]);
    setValidationError([]);
  };

  const handleClose = () => {
    onCancel();
    resetStates();
  };

  const handleRemove = () => {
    form.resetFields(["upload_data"]);
  };

  const handleDownload = async () => {
    try {
      setLoadingDownload(true);
      await onTemplateDownload?.();
    } catch (errorDownload) {
      console.warn({ error: errorDownload });
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleUpload: FormProps<TFormData>["onFinish"] = async (data) => {
    const info = data.upload_data;
    const isFileExist = info?.fileList.length > 0;

    const fileObj = info?.file.originFileObj;

    if (!isFileExist) {
      form.setFields([
        {
          name: "upload_data",
          errors: ["File is required"],
        },
      ]);
      return;
    }

    if (!fileObj) {
      form.setFields([
        {
          name: "upload_data",
          errors: ["File not found"],
        },
      ]);
      return;
    }

    try {
      setLoadingUpload(true);
      const formData = new FormData();
      formData.append("file", fileObj);
      await onUpload(
        {
          file: formData,
        },
        resetStates,
      );
    } catch {
      // TODO: set error upload
      // setValidationError(() =>
      //   (resError?.errors || []).map((err) => ` ${err?.value || err?.message}`),
      // );
    } finally {
      setLoadingUpload(false);
    }
  };

  const checkAcceptedFile = (fileToCheck: RcFile) => {
    // Check file size
    if (fileToCheck.size > maxFileSize * 1024 * 1024) {
      form.setFields([
        {
          name: "upload_data",
          errors: [`File too large, max. ${maxFileSize} MB`],
        },
      ]);
      return false;
    }

    // Check file type
    const isAccepted = ACCEPTED_FILE_TYPES?.some((type) => type === fileToCheck.type);

    if (!isAccepted) {
      form.setFields([
        {
          name: "upload_data",
          errors: ["Invalid file type"],
        },
      ]);
      return false;
    }

    form.setFields([
      {
        name: "upload_data",
        errors: [],
      },
    ]);

    // File is valid, continue with upload
    return true;
  };

  return (
    <Modal open={open} title={title} onCancel={handleClose} footer={null}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {withDownloadTemplate ? (
          <Flex justify="flex-end">
            <Button loading={loadingDownload} onClick={handleDownload} icon={<DownloadOutlined />}>
              Download Template
            </Button>
          </Flex>
        ) : null}
        <Form layout="vertical" onFinish={handleUpload} form={form}>
          <Flex vertical>
            <Form.Item
              name="upload_data"
              validateStatus={error ? "error" : undefined}
              help={
                errMessage.length ? (
                  <ul className="validation-error-container">
                    {errMessage.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : null
              }
            >
              <Upload.Dragger
                beforeUpload={checkAcceptedFile}
                multiple={false}
                maxCount={1}
                accept=".xls,.xlsx"
                defaultFileList={[]}
                fileList={file}
                onChange={handleChangeUpload}
                customRequest={({ onSuccess, file: fileReq }) => {
                  setTimeout(() => {
                    onSuccess?.(fileReq);
                  }, 500);
                }}
                onRemove={handleRemove}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined color="primary" />
                </p>
                <Typography.Text>Click or drag file to this area to upload</Typography.Text>
                <Flex vertical style={{ marginTop: "12px" }} gap="4px">
                  <Typography.Text type="secondary">
                    * Excel with maximal size {maxFileSize} MB.
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    ** Must be original excel based on template
                  </Typography.Text>
                </Flex>
              </Upload.Dragger>
            </Form.Item>

            <Flex justify="flex-end" gap="8px">
              <Button type="default" disabled={loadingUpload} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                loading={loadingUpload}
                disabled={loadingUpload || Boolean(error)}
              >
                Upload
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Space>
    </Modal>
  );
};

export default UploadPopup;
