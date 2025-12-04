import React from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";

const GoPrintModal = ({ open, onCancel, record }) => {
  const navigate = useNavigate();

  const handleOk = () => {
    if (!record) return;
    const { type, vin, vsnCode } = record;

    const safeVin = encodeURIComponent(vin || "");
    const safeVsn = encodeURIComponent(vsnCode || "");
    const safeType = encodeURIComponent(type || "");

    if (["supplement"].includes(type)) {
      navigate(`/reprint?vin=${safeVin}&vsn=${safeVsn}`);
    } else {
      navigate(`/print?vin=${safeVin}&vsn=${safeVsn}&type=${safeType}`);
    }
    onCancel();
  };

  const renderPrint = () => {
    if (!record) return null;
    const type = record.type;
    switch (type) {
      case "reprint":
        return <p>当前状态为：重打，是否进入重打流程？</p>;
      case "supplement":
        return <p>当前状态为：补打，是否进入补打流程？</p>;
      case "chassis":
        return <p>当前状态为：二类底盘，是否进入二类底盘打印流程？</p>;
      case "order":
        return <p>当前状态为：订单车，是否进入订单车打印流程？</p>;
      case "whole":
        return <p>当前状态为：整车，是否进入整车打印流程？</p>;
      default:
        return <p>当前状态未知，是否进入打印页面？</p>;
    }
  };

  return (
    <Modal
      title="提示"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          确定
        </Button>,
      ]}
    >
      {renderPrint()}
    </Modal>
  );
};

export default GoPrintModal;
