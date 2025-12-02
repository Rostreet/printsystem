/**
 * 合格证打印页面
 */
import { useState } from 'react';
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
  Spin,
} from 'antd';
import {
  ScanOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  validateVehicle,
  getPrintPreview,
  normalPrint,
  reprintCertificate,
} from '../../api/print';
import { VIN_LENGTH, VSN_LENGTH, VEHICLE_TYPE_NAMES } from '../../constants';
import { validateVIN, validateVSN } from '../../utils';

const PrintPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [vinForm] = Form.useForm();
  const [validateResult, setValidateResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [printResult, setPrintResult] = useState(null);

  // 步骤配置
  const steps = [
    {
      title: 'VIN扫描',
      icon: <ScanOutlined />,
    },
    {
      title: '校验确认',
      icon: <CheckCircleOutlined />,
    },
    {
      title: '打印预览',
      icon: <PrinterOutlined />,
    },
    {
      title: '执行打印',
      icon: <PrinterOutlined />,
    },
  ];

  // 步骤1：VIN扫描提交
  const handleVinSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await validateVehicle(values);
      setValidateResult(response.data);
      setCurrentStep(1);
      message.success('校验成功');
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  };

  // 步骤2：确认校验结果
  const handleConfirmValidation = async () => {
    try {
      setLoading(true);
      const values = vinForm.getFieldsValue();
      const response = await getPrintPreview(values);
      setPreviewData(response.data);
      setCurrentStep(2);
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  };

  // 步骤3：执行打印
  const handlePrint = async () => {
    try {
      setLoading(true);
      const values = vinForm.getFieldsValue();
      const printData = {
        ...values,
        parameters: previewData,
      };
      const response = await normalPrint(printData);
      setPrintResult(response.data);
      setCurrentStep(3);
      message.success('打印成功');
    } catch {
      // 错误已在拦截a器处理
    } finally {
      setLoading(false);
    }
  };

  // 重打
  const handleReprint = async () => {
    try {
      setLoading(true);
      const values = vinForm.getFieldsValue();
      const response = await reprintCertificate({ vin: values.vin });
      message.success('重打成功');
      setPrintResult(response.data);
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
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
      <Card title="合格证打印">
        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        <Spin spinning={loading}>
          {/* 步骤1：VIN扫描 */}
          {currentStep === 0 && (
            <Card type="inner" title="VIN/VSN扫描输入">
              <Form
                form={vinForm}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                onFinish={handleVinSubmit}
              >
                <Form.Item
                  label="VIN码"
                  name="vin"
                  rules={[
                    { required: true, message: '请输入VIN码' },
                    { len: VIN_LENGTH, message: `VIN码必须为${VIN_LENGTH}位` },
                    {
                      validator: (_, value) => {
                        if (value && !validateVIN(value)) {
                          return Promise.reject('VIN码格式不正确');
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder={`请扫描或输入${VIN_LENGTH}位VIN码`}
                    maxLength={VIN_LENGTH}
                    style={{ textTransform: 'uppercase' }}
                  />
                </Form.Item>

                <Form.Item
                  label="VSN码"
                  name="vsn"
                  rules={[
                    { required: true, message: '请输入VSN码' },
                    { len: VSN_LENGTH, message: `VSN码必须为${VSN_LENGTH}位` },
                    {
                      validator: (_, value) => {
                        if (value && !validateVSN(value)) {
                          return Promise.reject('VSN码格式不正确');
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder={`请扫描或输入${VSN_LENGTH}位VSN码`}
                    maxLength={VSN_LENGTH}
                    style={{ textTransform: 'uppercase' }}
                  />
                </Form.Item>

                <Form.Item
                  label="发动机号"
                  name="engineNo"
                  rules={[{ required: true, message: '请输入发动机号' }]}
                >
                  <Input placeholder="请输入发动机号" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4 }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<ScanOutlined />}>
                      校验
                    </Button>
                    <Button onClick={handleReset}>
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
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

              <Descriptions bordered column={2}>
                <Descriptions.Item label="VIN码">
                  {validateResult.vin}
                </Descriptions.Item>
                <Descriptions.Item label="VSN码">
                  {validateResult.vsn}
                </Descriptions.Item>
                <Descriptions.Item label="车辆类型">
                  {VEHICLE_TYPE_NAMES[validateResult.vehicleType] || validateResult.vehicleType}
                </Descriptions.Item>
                <Descriptions.Item label="车型代码">
                  {validateResult.modelCode}
                </Descriptions.Item>
                {validateResult.isChassis && (
                  <Descriptions.Item label="二类底盘" span={2}>
                    <Alert
                      message="该车辆为二类底盘"
                      type="warning"
                      showIcon
                    />
                  </Descriptions.Item>
                )}
                {validateResult.isOrderVehicle && (
                  <Descriptions.Item label="订单车" span={2}>
                    <Alert
                      message="该车辆为订单车"
                      type="info"
                      showIcon
                    />
                  </Descriptions.Item>
                )}
              </Descriptions>

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Space>
                  <Button onClick={() => setCurrentStep(0)}>
                    上一步
                  </Button>
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
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="车辆品牌">
                  {previewData.vehicleBrand}
                </Descriptions.Item>
                <Descriptions.Item label="底盘型号">
                  {previewData.chassisModel}
                </Descriptions.Item>
                <Descriptions.Item label="车辆类别">
                  {VEHICLE_TYPE_NAMES[previewData.vehicleCategory]}
                </Descriptions.Item>
                <Descriptions.Item label="燁料种类">
                  {previewData.fuelType}
                </Descriptions.Item>
                <Descriptions.Item label="排放标准">
                  {previewData.emissionStandard}
                </Descriptions.Item>
                <Descriptions.Item label="转向形式">
                  {previewData.steeringType}
                </Descriptions.Item>
                <Descriptions.Item label="轮距">
                  {previewData.wheelbase}
                </Descriptions.Item>
                <Descriptions.Item label="企业标准">
                  {previewData.enterpriseStandard}
                </Descriptions.Item>
                <Descriptions.Item label="外廓尺寸">
                  {previewData.overallDimension}
                </Descriptions.Item>
                <Descriptions.Item label="轴荷">
                  {previewData.axleLoad}
                </Descriptions.Item>
                {previewData.cargoBoxDimension && (
                  <Descriptions.Item label="货箱尺寸" span={2}>
                    {previewData.cargoBoxDimension}
                  </Descriptions.Item>
                )}
              </Descriptions>

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Space>
                  <Button onClick={() => setCurrentStep(1)}>
                    上一步
                  </Button>
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

              <Descriptions bordered column={2}>
                <Descriptions.Item label="合格证编号">
                  {printResult.certificateNo}
                </Descriptions.Item>
                <Descriptions.Item label="VIN码">
                  {printResult.vin}
                </Descriptions.Item>
                <Descriptions.Item label="打印时间">
                  {printResult.printTime}
                </Descriptions.Item>
                <Descriptions.Item label="操作员">
                  {printResult.operatorName}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Space>
                  <Button
                    type="primary"
                    onClick={handleReset}
                  >
                    打印下一辆
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReprint}
                  >
                    重打当前车辆
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
