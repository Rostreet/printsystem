import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Radio,
  Button,
  Space,
  message,
  Descriptions,
  Steps,
} from "antd";

const StatusChangeModal = ({ open, onCancel, record, onStatusChange }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({
    operation: "",
    isChassis: "",
    isOrder: "",
  });

  // 初始化表单数据
  useEffect(() => {
    if (open && record) {
      // 重置步骤和数据
      setCurrentStep(0);
      setStepData({
        operation: "",
        isChassis: "",
        isOrder: "",
      });
      form.resetFields();
    }
  }, [open, record, form]);

  // 处理下一步
  const handleNext = async () => {
    try {
      const values = await form.validateFields();

      if (currentStep === 0) {
        // 步骤0: 选择操作类型
        setStepData({ ...stepData, operation: values.operation });

        if (
          values.operation === "reprint" ||
          values.operation === "supplement"
        ) {
          // 重打或补打，直接完成
          await handleSubmit({ vin: record.vin, type: values.operation });
        } else {
          // 非重打补打，进入下一步
          setCurrentStep(1);
          form.resetFields();
        }
      } else if (currentStep === 1) {
        // 步骤1: 判断是否为二类底盘
        setStepData({ ...stepData, isChassis: values.isChassis });

        if (values.isChassis === "yes") {
          // 是二类底盘，直接完成
          await handleSubmit({ vin: record.vin, type: "chassis" });
        } else {
          // 不是二类底盘，进入下一步
          setCurrentStep(2);
          form.resetFields();
        }
      } else if (currentStep === 2) {
        // 步骤2: 判断是否为订单车
        setStepData({ ...stepData, isOrder: values.isOrder });

        if (values.isOrder === "yes") {
          // 是订单车，直接完成
          await handleSubmit({ vin: record.vin, type: "order" });
        } else {
          // 不是订单车，进入整车打印阶段
          setCurrentStep(3);
        }
      } else if (currentStep === 3) {
        // 步骤3: 整车打印阶段
        await handleSubmit({ vin: record.vin, type: "whole" });
      }
    } catch (error) {
      console.error("验证失败:", error);
    }
  };

  // 处理上一步
  const handlePrev = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
    form.resetFields();
  };

  // 处理提交
  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await onStatusChange(record, data);
      message.success("状态更新成功");
      onCancel();
    } catch (error) {
      console.error("提交失败:", error);
      message.error("状态更新失败");
    } finally {
      setLoading(false);
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form.Item
            name="operation"
            label="请选择操作类型"
            rules={[{ required: true, message: "请选择操作类型" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="reprint">重打</Radio>
                <Radio value="supplement">补打</Radio>
                <Radio value="normal">非重打补打</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        );
      case 1:
        return (
          <Form.Item
            name="isChassis"
            label="是否为二类底盘"
            rules={[{ required: true, message: "请选择是否为二类底盘" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="yes">是</Radio>
                <Radio value="no">不是</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        );
      case 2:
        return (
          <Form.Item
            name="isOrder"
            label="是否为订单车"
            rules={[{ required: true, message: "请选择是否为订单车" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="yes">是</Radio>
                <Radio value="no">不是</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        );
      case 3:
        return (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <h3>整车打印阶段</h3>
            <p>根据前面的判断，现在进入整车打印阶段</p>
          </div>
        );
      default:
        return null;
    }
  };

  // 获取按钮文本
  const getButtonText = () => {
    if (currentStep === 3) {
      return "完成打印";
    }
    return "下一步";
  };

  return (
    <Modal
      title="装套类型选择"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      {/* 步骤条 */}
      <Steps
        current={currentStep}
        style={{ marginBottom: 24 }}
        items={[
          { title: "重打/补打判断" },
          { title: "二类底盘判断" },
          { title: "订单车判断" },
          { title: "整车打印" },
        ]}
      />

      {/* 基本信息展示 */}
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
        }}
      >
        <h3 style={{ marginBottom: 16 }}>基本信息</h3>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="车型代码">
            {record?.modelCode || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="车辆品牌">
            {record?.vehicleBrand || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="车辆型号">
            {record?.vehicleModel || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="底盘型号">
            {record?.chassisModel || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="发动机型号">
            {record?.engineInfo || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="车辆类型">
            {record?.vehicleType || "-"}
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* 装套类型选择表单 */}
      <Form form={form} layout="vertical">
        {renderStepContent()}

        {/* 底部按钮区域 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <Button onClick={handlePrev} disabled={currentStep === 0}>
            上一步
          </Button>
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={handleNext} loading={loading}>
              {getButtonText()}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default StatusChangeModal;
