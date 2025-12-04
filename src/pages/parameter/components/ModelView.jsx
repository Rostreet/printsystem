import { Modal, Form, Input, Select, Row, Col, message } from "antd";
import { useEffect } from "react";

const ModelView = ({
  open,
  mode,
  record,
  onCancel,
  onSubmit,
  allModels = [],
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (mode === "edit" || mode === "view") {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
  }, [open, mode, record, form]);

  // 模板导入 - 根据选择的车型代码填充表单
  const handleTemplateImport = async (modelCode) => {
    if (!modelCode) {
      form.resetFields();
      return;
    }

    try {
      const template = allModels.find((m) => m.modelCode === modelCode);
      if (template) {
        // 复制模板数据，但清空车型代码让用户重新输入
        const templateData = { ...template };
        delete templateData.id;
        form.setFieldsValue(templateData);
        message.success("模板导入成功");
      }
    } catch {
      message.error("模板导入失败");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // 表单验证失败
    }
  };

  const isReadOnly = mode === "view";
  const title =
    mode === "add"
      ? "新增车型参数"
      : mode === "edit"
      ? "编辑车型参数"
      : "查看车型参数";

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={1000}
      destroyOnClose
      okText={isReadOnly ? "关闭" : "确定"}
      cancelButtonProps={{
        style: { display: isReadOnly ? "none" : "inline-block" },
      }}
    >
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        {/* 模板导入 - 仅在新增时显示 */}
        {mode === "add" && allModels.length > 0 && (
          <Form.Item
            label="模板导入"
            tooltip="选择已有车型作为模板，快速填充表单"
          >
            <Select
              placeholder="选择车型模板（可选）"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={allModels.map((m) => ({
                label: `${m.modelCode} - ${m.vehicleBrand}`,
                value: m.modelCode,
              }))}
              onChange={handleTemplateImport}
            />
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="车型代码"
              name="modelCode"
              rules={[{ required: true, message: "请输入车型代码" }]}
            >
              <Input placeholder="请输入车型代码" disabled={mode === "view"} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="车辆品牌"
              name="vehicleBrand"
              rules={[{ required: true, message: "请输入车辆品牌" }]}
            >
              <Input placeholder="如：解放牌/FAW" disabled={isReadOnly} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="车辆型号" name="vehicleModel">
              <Input placeholder="请输入车辆型号" disabled={isReadOnly} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="VIN" name="vin">
              <Input placeholder="请输入VIN码" disabled={isReadOnly} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="VSN码" name="vsnCode">
              <Input placeholder="请输入VSN码" disabled={isReadOnly} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="车辆颜色" name="vehicleColor">
              <Input placeholder="请输入车辆颜色" disabled={isReadOnly} />
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
                { pattern: /^[A-Z0-9]+$/, message: "底盘型号不允许填写汉字" },
              ]}
            >
              <Input placeholder="如：CA1234PK2L5" disabled={isReadOnly} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="发动机型号" name="engineInfo">
              <Input placeholder="请输入发动机型号" disabled={isReadOnly} />
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
              <Input placeholder="如：柴油" disabled={isReadOnly} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="排量(L)" name="displacement">
              <Input
                type="number"
                placeholder="请输入排量"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="功率(kW)" name="power">
              <Input
                type="number"
                placeholder="请输入功率"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="排放标准"
              name="emissionStandard"
              rules={[{ required: true, message: "请输入排放标准" }]}
            >
              <Input placeholder="如：国六" disabled={isReadOnly} />
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
              <Input placeholder="如：8500×2500×3200" disabled={isReadOnly} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="货箱内部尺寸" name="cargoBoxInnerSize">
              <Input placeholder="如：4200×2300×2000" disabled={isReadOnly} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="钢板弹簧片数" name="steelSpringLeafCount">
              <Input
                type="number"
                placeholder="请输入钢板弹簧片数"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="轮胎数" name="tireCount">
              <Input
                type="number"
                placeholder="请输入轮胎数"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="轮胎规格" name="tireSpec">
              <Input placeholder="如：245/45 R19" disabled={isReadOnly} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="车辆类型" name="vehicleType">
              <Input placeholder="如：乘用车" disabled={isReadOnly} />
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
              <Input placeholder="如：1620/1620" disabled={isReadOnly} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="轮荷" name="wheelLoad">
              <Input placeholder="如：1250/1250" disabled={isReadOnly} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="轴数" name="axleCount">
              <Input
                type="number"
                placeholder="请输入轴数"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="转向形式"
              name="steeringType"
              rules={[{ required: true, message: "请输入转向形式" }]}
            >
              <Input placeholder="如：方向盘" disabled={isReadOnly} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="总质量(kg)" name="totalMass">
              <Input
                type="number"
                placeholder="请输入总质量"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="整备质量(kg)" name="curbWeight">
              <Input
                type="number"
                placeholder="请输入整备质量"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="额定载质量(kg)" name="ratedLoadMass">
              <Input
                type="number"
                placeholder="请输入额定载质量"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="载质量利用系数"
              name="loadMassUtilizationCoefficient"
            >
              <Input
                type="number"
                placeholder="请输入载质量利用系数"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="准牵引总质量(kg)" name="quasiTractionTotalMass">
              <Input
                type="number"
                placeholder="请输入准牵引总质量"
                disabled={isReadOnly}
              />
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
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="驾驶室准乘人数" name="cabSeatingCapacity">
              <Input
                type="number"
                placeholder="请输入驾驶室准乘人数"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="额定载客" name="ratedPassengerCapacity">
              <Input
                type="number"
                placeholder="请输入额定载客"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="最高车速(km/h)" name="maxSpeed">
              <Input
                type="number"
                placeholder="请输入最高车速"
                disabled={isReadOnly}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="车辆制造日期" name="manufactureDate">
              <Input type="date" disabled={isReadOnly} />
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
              <Input.TextArea
                rows={2}
                placeholder="请输入备注"
                disabled={isReadOnly}
              />
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
              <Input
                placeholder="如：Q/CR9999-2023《载货汽车技术条件》"
                disabled={isReadOnly}
              />
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
              <Input placeholder="请输入产品生产地址" disabled={isReadOnly} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModelView;
