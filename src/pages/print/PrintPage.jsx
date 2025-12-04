/**
 * 合格证打印页面
 */
import { useState, useEffect } from "react";
import useUserStore from "../../store/userStore";
import { useLocation } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Steps,
  Descriptions,
  Alert,
  Space,
  message,
  Divider,
  Spin,
  Typography,
  Modal,
} from "antd";
import {
  ScanOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  getCertificateByVin,
  getCertificatePrintReport,
} from "../../api/print";
import { VEHICLE_TYPE_NAMES, VEHICLE_STATUS_NAMES } from "../../constants";
import { useNavigate } from "react-router-dom";
import CertificatePreview from "./components/CertificatePreview";
import "./PrintPage.css";

const PrintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [vdata, setVdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vinForm] = Form.useForm();
  const [validateResult, setValidateResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [printResult, setPrintResult] = useState(null);

  // 自动填充从URL参数中获取的数据
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vin = queryParams.get("vin");
    const vsn = queryParams.get("vsn");

    if (vin || vsn) {
      vinForm.setFieldsValue({
        vin: vin || "",
        vsn: vsn || "",
      });
    }
  }, [location.search, vinForm]);

  // 步骤配置
  const steps = [
    {
      title: "获取车辆",
      icon: <ScanOutlined />,
    },
    {
      title: "状态校验",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "打印预览",
      icon: <PrinterOutlined />,
    },
    {
      title: "执行打印",
      icon: <PrinterOutlined />,
    },
  ];

  //第一步： 获取车辆
  const operatorType = user?.operator_type;
  const isQualityUser = operatorType === "质量部";

  const handleVinSubmit = async (values) => {
    // 权限检查：只有质量部可以进行校验
    const operatorType = user?.operator_type;
    const isQualityUser = operatorType === "质量部";
    if (!isQualityUser) {
      message.error("权限不足：只有质量部的操作员才可以执行校验");
      return;
    }
    try {
      setLoading(true);
      const params = {
        vin: values.vin,
      };
      const response = await getCertificateByVin(params);
      setValidateResult(response.data);
      setCurrentStep(1);
      setVdata({
        vin: response.data.vin,
        vsn: response.data.vsnCode,
      });
      message.success("校验成功");
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  };

  // 第二步：确认校验结果
  const handleConfirmValidation = async () => {
    try {
      setLoading(true);
      const values = vinForm.getFieldsValue();
      console.log(values);
      if (vdata?.vin) {
        const vsnVal = (vdata?.vsn || values.vsn || "").toUpperCase().trim();
        if (!vsnVal.startsWith("VS")) {
          message.error("VIN是底盘，VSN是整车，不可打印");
          setLoading(false);
          return;
        }
      }
      const params = {
        vin: validateResult.vin,
        engineNo: validateResult.engineInfo,
        printType: validateResult.type,
      };
      const getCertificateRes = await getCertificatePrintReport(params);
      const response = await getCertificateByVin({ vin: validateResult.vin });
      const prevData = {
        ...response.data,
        certificateNo: getCertificateRes.data,
      };
      setPreviewData(prevData);
      setCurrentStep(2);
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  };

  // 第三步：执行打印
  const handlePrint = () => {
    const handleAfterPrint = () => {
      window.removeEventListener("afterprint", handleAfterPrint);

      Modal.confirm({
        title: "打印确认",
        content: "请确认合格证是否已成功打印？",
        okText: "打印成功",
        cancelText: "未成功/取消",
        onOk: () => {
          setPrintResult({
            ...previewData,
            reprintTime: new Date().toLocaleString(),
            operatorName: user?.username,
          });
          setCurrentStep(3);
        },
      });
    };

    window.addEventListener("afterprint", handleAfterPrint);
    window.print();
  };

  // 重置
  const handleReset = () => {
    setCurrentStep(0);
    vinForm.resetFields();
    setValidateResult(null);
    setPreviewData(null);
    setPrintResult(null);
  };

  return (
    <div className="print-page">
      <Card
        title="合格证打印"
        extra={`当前车辆状态为：${
          VEHICLE_STATUS_NAMES[validateResult?.type] || ""
        }`}
      >
        <div
          style={{
            padding: "20px",
            marginBottom: 32,
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
          <Steps current={currentStep} items={steps} />
        </div>

        <Spin spinning={loading}>
          {/* 步骤1：获取车辆 */}
          {currentStep === 0 && (
            <Card type="inner" title="输入VIN/VSN代码">
              <Form
                form={vinForm}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                onFinish={handleVinSubmit}
              >
                <Form.Item
                  label="VIN码"
                  name="vin"
                  rules={[{ required: true, message: "请输入VIN码" }]}
                >
                  <Input placeholder="请输入VIN码" />
                </Form.Item>

                <Form.Item
                  label="VSN码"
                  name="vsn"
                  rules={[{ required: true, message: "请输入VSN码" }]}
                >
                  <Input placeholder="请输入VSN码" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4 }}>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<ScanOutlined />}
                      disabled={!isQualityUser}
                    >
                      校验
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                  </Space>
                </Form.Item>
              </Form>
              {!isQualityUser && (
                <div style={{ marginTop: 12 }}>
                  <Alert
                    description="只有质量部的操作员才可以执行校验"
                    type="warning"
                    showIcon
                  />
                </div>
              )}
            </Card>
          )}

          {/* 步骤2：校验结果 */}
          {currentStep === 1 && validateResult && (
            <Card type="inner" title="校验结果">
              <Alert
                message="校验成功"
                description="VIN和VSN校验通过，请确认车辆信息"
                type="success"
                showIcon
                style={{ marginBottom: 24 }}
              />
              {
                // 订单车显示特殊信息
                validateResult.type === "order" && (
                  <>
                    <Typography.Title level={5}>
                      订单车特殊信息
                    </Typography.Title>
                    <Descriptions bordered column={2} size="small">
                      <Descriptions.Item label="订单车颜色" span={2}>
                        {validateResult.vehicleColor}
                      </Descriptions.Item>
                      <Descriptions.Item label="订单车座位增减数量" span={2}>
                        {validateResult.cabSeatingCapacity}
                      </Descriptions.Item>
                    </Descriptions>
                    <Divider />
                  </>
                )
              }
              {
                //二类底盘要进行特殊判断
                validateResult.type === "chassis" ? (
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="VIN码">
                      {validateResult.vin}
                    </Descriptions.Item>
                    <Descriptions.Item label="VSN码">
                      {validateResult.vsnCode ? validateResult.vsnCode : "-"}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="VIN码">
                      {validateResult.vin}
                    </Descriptions.Item>
                    <Descriptions.Item label="VSN码">
                      {validateResult.vsnCode}
                    </Descriptions.Item>
                  </Descriptions>
                )
              }
              <Descriptions bordered column={2}>
                <Descriptions.Item label="车辆类型">
                  {validateResult.vehicleType}
                </Descriptions.Item>
                <Descriptions.Item label="车型代码">
                  {validateResult.modelCode}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <Space>
                  <Button onClick={() => setCurrentStep(0)}>上一步</Button>
                  <Button
                    type="primary"
                    onClick={handleConfirmValidation}
                    icon={<CheckCircleOutlined />}
                  >
                    确认并继续
                  </Button>
                </Space>
              </div>
            </Card>
          )}

          {/* 步骤3：打印预览 */}
          {currentStep === 2 && previewData && (
            <Card type="inner" title="打印预览">
              <Alert
                message="打印提示"
                description="请确认打印机纸张设置为A4纸，以确保打印质量。"
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
              />
              <CertificatePreview data={previewData} />

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <Space>
                  <Button onClick={() => setCurrentStep(1)}>上一步</Button>
                  <Button
                    type="primary"
                    onClick={handlePrint}
                    icon={<PrinterOutlined />}
                  >
                    执行打印
                  </Button>
                </Space>
              </div>
            </Card>
          )}

          {/* 步骤4：打印结果 */}
          {currentStep === 3 && printResult && (
            <Card type="inner" title="打印结果">
              <Alert
                message="打印成功"
                description="合格证已成功打印"
                type="success"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <div style={{ marginBottom: 24 }}>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="合格证编号" span={2}>
                    {printResult.certificateNo}
                  </Descriptions.Item>
                  <Descriptions.Item label="VIN码" span={2}>
                    {printResult.vin}
                  </Descriptions.Item>
                  <Descriptions.Item label="打印时间" span={2}>
                    {printResult.reprintTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="操作员" span={2}>
                    {printResult.operatorName}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <Space>
                  <Button
                    onClick={() => {
                      navigate("/parameter");
                    }}
                  >
                    返回
                  </Button>
                </Space>
              </div>
            </Card>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export function Component() {
  return <PrintPage />;
}
