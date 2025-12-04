/**
 * 合格证补打页面
 */
import { useState, useEffect } from "react";
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
  Spin,
  Row,
  Col,
  Modal,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PrinterOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getCertificateByVin,
  supplementPrint,
  getCertificatePrintReport,
} from "../../api/print";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";

import CertificatePreview from "./components/CertificatePreview";
import "./ReprintPage.css";

const ReprintPage = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [certificateData, setCertificateData] = useState(null);
  const [modifiedData, setModifiedData] = useState({});
  const [printResult, setPrintResult] = useState(null);
  const navigate = useNavigate();

  // 自动填充从URL参数中获取的VIN和VSN
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vin = queryParams.get("vin");

    if (vin) {
      searchForm.setFieldsValue({
        vin: vin,
      });
    }
  }, [location.search, searchForm]);

  // 步骤配置
  const steps = [
    {
      title: "查询车辆",
      icon: <SearchOutlined />,
    },
    {
      title: "修改参数",
      icon: <EditOutlined />,
    },
    {
      title: "打印预览",
      icon: <EyeOutlined />,
    },
    {
      title: "执行补打",
      icon: <PrinterOutlined />,
    },
  ];

  // 第一步：根据VIN查询合格证信息
  const handleSearch = async (values) => {
    // 权限检查：只有质量部可以查询
    const operatorType = user?.operator_type;
    const isQualityUser = operatorType === "质量部";
    if (!isQualityUser) {
      message.error("权限不足：只有质量部的操作员才可以执行查询");
      return;
    }
    try {
      setLoading(true);
      const response = await getCertificateByVin(values);
      setCertificateData(response.data);
      setCurrentStep(1);
      message.success("查询成功");
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  };

  // 第二步：修改参数
  const handleSupplementPrint = async () => {
    await editForm.getFieldsValue();
    const values = editForm.getFieldsValue();
    try {
      setLoading(true);
      const response = await supplementPrint(values);
      if (response) {
        const params = {
          vin: values.vin,
        };
        const cparams = {
          vin: values.vin,
          engineNo: values.engineInfo,
          printType: "supplement",
        };
        console.log(cparams);
        const getCertificateRes = await getCertificatePrintReport(cparams);
        const curData = await getCertificateByVin(params);
        const mergedData = {
          ...curData.data,
          certificateNo: getCertificateRes.data,
        };
        setCertificateData(mergedData);
      }
      setCurrentStep(2);
      message.success("修改成功");
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  };

  //第三步：预览打印
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
            ...certificateData,
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
    searchForm.resetFields();
    editForm.resetFields();
    setCertificateData(null);
    setModifiedData({});
    setPrintResult(null);
  };

  return (
    <div className="reprint-page">
      <Card title="合格证补打">
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
          {/* 步骤1：查询车辆 */}
          {currentStep === 0 && (
            <Card type="inner" title="输入VIN码">
              <Form
                form={searchForm}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 12 }}
                onFinish={handleSearch}
              >
                <Form.Item
                  label="VIN码"
                  name="vin"
                  rules={[{ required: true, message: "请输入VIN码" }]}
                >
                  <Input
                    placeholder="请输入17位VIN码"
                    maxLength={17}
                    style={{ textTransform: "uppercase" }}
                  />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 4 }}>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SearchOutlined />}
                      disabled={!(user?.operator_type === "质量部")}
                    >
                      查询
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                  </Space>
                </Form.Item>
              </Form>
              {!(user?.operator_type === "质量部") && (
                <div style={{ marginTop: 12 }}>
                  <Alert
                    description="只有质量部的操作员才可以执行查询"
                    type="warning"
                    showIcon
                  />
                </div>
              )}
            </Card>
          )}

          {/* 步骤2：显示合格证信息并支持修改 */}
          {currentStep === 1 && certificateData && (
            <Card type="inner" title="合格证信息">
              <Alert
                message="查询成功"
                description="已找到该车辆的合格证信息，可以进行修改后补打"
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              {Object.keys(modifiedData).length > 0 && (
                <Alert
                  message={`已修改 ${Object.keys(modifiedData).length} 个字段`}
                  type="warning"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              )}
              <Form
                form={editForm}
                layout="vertical"
                initialValues={certificateData}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="车型代码"
                      name="modelCode"
                      rules={[{ required: true, message: "请输入车型代码" }]}
                    >
                      <Input placeholder="请输入车型代码" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="车辆品牌"
                      name="vehicleBrand"
                      rules={[{ required: true, message: "请输入车辆品牌" }]}
                    >
                      <Input placeholder="如：解放牌/FAW" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="车辆型号" name="vehicleModel">
                      <Input placeholder="请输入车辆型号" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="VIN" name="vin">
                      <Input placeholder="请输入VIN码" disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="VSN码" name="vsnCode">
                      <Input placeholder="请输入VSN码" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="车辆颜色" name="vehicleColor">
                      <Input placeholder="请输入车辆颜色" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="底盘型号"
                      name="chassisModel"
                      rules={[
                        { required: true, message: "请输入底盘型号" },
                        {
                          pattern: /^[A-Z0-9]+$/,
                          message: "底盘型号不允许填写汉字",
                        },
                      ]}
                    >
                      <Input placeholder="如：CA1234PK2L5" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="发动机型号" name="engineInfo">
                      <Input placeholder="请输入发动机型号" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="燃料种类"
                      name="fuelType"
                      rules={[{ required: true, message: "请输入燃料种类" }]}
                    >
                      <Input placeholder="如：柴油" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="排量(L)" name="displacement">
                      <Input type="number" placeholder="请输入排量" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="功率(kW)" name="power">
                      <Input type="number" placeholder="请输入功率" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="排放标准"
                      name="emissionStandard"
                      rules={[{ required: true, message: "请输入排放标准" }]}
                    >
                      <Input placeholder="如：国六" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="外廓尺寸"
                      name="outlineSize"
                      rules={[{ required: true, message: "请输入外廓尺寸" }]}
                    >
                      <Input placeholder="如：8500×2500×3200" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="货箱内部尺寸" name="cargoBoxInnerSize">
                      <Input placeholder="如：4200×2300×2000" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="钢板弹簧片数" name="steelSpringLeafCount">
                      <Input type="number" placeholder="请输入钢板弹簧片数" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="轮胎数" name="tireCount">
                      <Input type="number" placeholder="请输入轮胎数" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="轮胎规格" name="tireSpec">
                      <Input placeholder="如：245/45 R19" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="车辆类型" name="vehicleType">
                      <Input placeholder="如：乘用车" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="轮距"
                      name="track"
                      rules={[{ required: true, message: "请输入轮距" }]}
                    >
                      <Input placeholder="如：1620/1620" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="轮荷" name="wheelLoad">
                      <Input placeholder="如：1250/1250" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="轴数" name="axleCount">
                      <Input type="number" placeholder="请输入轴数" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="转向形式"
                      name="steeringType"
                      rules={[{ required: true, message: "请输入转向形式" }]}
                    >
                      <Input placeholder="如：方向盘" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="总质量(kg)" name="totalMass">
                      <Input type="number" placeholder="请输入总质量" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="整备质量(kg)" name="curbWeight">
                      <Input type="number" placeholder="请输入整备质量" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="额定载质量(kg)" name="ratedLoadMass">
                      <Input type="number" placeholder="请输入额定载质量" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="载质量利用系数"
                      name="loadMassUtilizationCoefficient"
                    >
                      <Input type="number" placeholder="请输入载质量利用系数" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="准牵引总质量(kg)"
                      name="quasiTractionTotalMass"
                    >
                      <Input type="number" placeholder="请输入准牵引总质量" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="鞍座最大允许总质量(kg)"
                      name="semiTrailerSaddleMaxMass"
                    >
                      <Input
                        type="number"
                        placeholder="请输入鞍座最大允许总质量"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="驾驶室准乘人数" name="cabSeatingCapacity">
                      <Input type="number" placeholder="请输入驾驶室准乘人数" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="额定载客" name="ratedPassengerCapacity">
                      <Input type="number" placeholder="请输入额定载客" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="最高车速(km/h)" name="maxSpeed">
                      <Input type="number" placeholder="请输入最高车速" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="车辆制造日期" name="manufactureDate">
                      <Input type="date" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="备注"
                      name="remark"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Input.TextArea rows={2} placeholder="请输入备注" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="企业标准"
                      name="enterpriseStandard"
                      rules={[{ required: true, message: "请输入企业标准" }]}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Input placeholder="如：Q/CR9999-2023《载货汽车技术条件》" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="产品生产地址"
                      name="productionAddress"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Input placeholder="请输入产品生产地址" />
                    </Form.Item>
                  </Col>
                </Row>

                <div style={{ marginTop: 24, textAlign: "center" }}>
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <Form.Item wrapperCol={{ offset: 6 }}>
                      <Space>
                        <Button onClick={() => setCurrentStep(0)}>
                          上一步
                        </Button>
                        <Button type="primary" onClick={handleSupplementPrint}>
                          确认修改
                        </Button>
                      </Space>
                    </Form.Item>
                  </Space>
                </div>
              </Form>
            </Card>
          )}

          {/* 步骤2:预览补打 */}
          {currentStep === 2 && certificateData && (
            <Card type="inner" title="打印预览">
              <Alert
                message="请确认信息无误后打印"
                description="点击“执行打印”将调用浏览器打印功能，打印时请确保纸张设置正确。"
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <CertificatePreview data={certificateData} />

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <Space>
                  <Button onClick={() => setCurrentStep(1)}>返回修改</Button>
                  <Button
                    type="primary"
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                  >
                    执行打印
                  </Button>
                </Space>
              </div>
            </Card>
          )}

          {/* 步骤3：补打结果 */}
          {currentStep === 3 && printResult && (
            <Card type="inner" title="补打结果">
              <Alert
                message="补打成功"
                description="合格证已成功补打，修改记录已保存"
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
                <Descriptions.Item label="补打时间">
                  {printResult.reprintTime}
                </Descriptions.Item>
                <Descriptions.Item label="操作员">
                  {printResult.operatorName}
                </Descriptions.Item>
                {Object.keys(modifiedData).length > 0 && (
                  <Descriptions.Item label="修改字段数" span={2}>
                    {Object.keys(modifiedData).length} 个字段
                  </Descriptions.Item>
                )}
              </Descriptions>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    navigate("/parameter");
                  }}
                >
                  返回
                </Button>
              </div>
            </Card>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export function Component() {
  return <ReprintPage />;
}

export default ReprintPage;
