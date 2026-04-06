import { useState } from "react";
import { CheckCircleOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { Flex, Modal, ModalProps, Typography } from "antd";

export type TActionType = "delete" | "submit" | "approve";

interface Props extends Omit<ModalProps, "onOk"> {
  icon?: React.ReactNode;
  type?: TActionType;
  description?: string;
  onOk?: () => void | Promise<void>;
}

const ModalAction = (props: Props) => {
  const { type, width = 500, icon, description, title, onOk, onCancel, ...others } = props;
  const [loading, setLoading] = useState(false);

  const iconMap: Record<TActionType, React.ReactNode> = {
    approve: <CheckCircleOutlined style={{ fontSize: "1rem", color: "blue" }} />,
    delete: <DeleteOutlined style={{ fontSize: "1rem", color: "red" }} />,
    submit: <SendOutlined style={{ fontSize: "1rem" }} />,
  };

  const renderIcon = (iconType?: TActionType, iconRender?: React.ReactNode) => {
    if (iconType) {
      return iconMap[iconType];
    }

    return iconRender;
  };

  const handleOk = async () => {
    if (!onOk) return;
    setLoading(true);
    try {
      await onOk();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...others}
      width={width}
      maskClosable={false}
      closable={false}
      onOk={handleOk}
      onCancel={onCancel}
      okButtonProps={{ loading, disabled: loading, ...others.okButtonProps }}
      cancelButtonProps={{ disabled: loading, ...others.cancelButtonProps }}
    >
      <Flex gap={12} align="start">
        {renderIcon(type, icon)}
        <Flex vertical gap={8}>
          <Typography.Text style={{ fontSize: "16px", lineHeight: "100%" }} strong>
            {title}
          </Typography.Text>
          <Typography.Text>{description}</Typography.Text>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default ModalAction;
