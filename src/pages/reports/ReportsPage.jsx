/**
 * 统计报表页面
 */
import { useState } from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  Space,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  getVehiclePrintHistory,
  getOrderModifyInfo,
  getCertificateCount,
  getOperatorPrintCount,
  getOperatorReprintCount,
  getCertificateInfo,
} from "../../api/reports";
import { PRINT_TYPE_NAMES } from "../../constants";
import { formatDateTime } from "../../utils";

const { RangePicker } = DatePicker;

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  // 报表1：车辆打印历史查询
  const handlePrintHistorySearch = async (values) => {
    try {
      setLoading(true);
      const response = await getVehiclePrintHistory(values);
      setDataSource(response || []);
    } catch {
      // 错误已处理
    } finally {
      setLoading(false);
    }
  };

  // 报表2：订单车修改信息查询
  const handleOrderModifySearch = async (values) => {
    try {
      setLoading(true);
      const params = {
        start: values.dateRange[0].format("YYYY-MM-DD HH:mm:ss"),
        end: values.dateRange[1].format("YYYY-MM-DD HH:mm:ss"),
      };
      const response = await getOrderModifyInfo(params);
      setDataSource(response || []);
    } catch {
      // 错误已处理
    } finally {
      setLoading(false);
    }
  };

  // 报表3：合格证数量统计
  const handleCertificateCountSearch = async (values) => {
    try {
      setLoading(true);
      const params = {
        startTime: values.dateRange[0].format("YYYY-MM-DD"),
        endTime: values.dateRange[1].format("YYYY-MM-DD"),
      };
      const response = await getCertificateCount(params);
      setDataSource(response.data || []);
    } catch {
      // 错误已处理
    } finally {
      setLoading(false);
    }
  };

  // 报表4：操作员打印数量
  const handleOperatorPrintSearch = async (values) => {
    try {
      setLoading(true);
      const params = {
        operatorId: values.operatorId,
        startTime: values.dateRange[0].format("YYYY-MM-DD"),
        endTime: values.dateRange[1].format("YYYY-MM-DD"),
      };
      const response = await getOperatorPrintCount(params);
      setDataSource(response.data || []);
    } catch {
      // 错误已处理
    } finally {
      setLoading(false);
    }
  };

  // 报表5：操作员补打数量
  const handleOperatorReprintSearch = async (values) => {
    try {
      setLoading(true);
      const params = {
        operatorId: values.operatorId,
        startTime: values.dateRange[0].format("YYYY-MM-DD"),
        endTime: values.dateRange[1].format("YYYY-MM-DD"),
      };
      const response = await getOperatorReprintCount(params);
      setDataSource(response.data || []);
    } catch {
      // 错误已处理
    } finally {
      setLoading(false);
    }
  };

  // 报表6：合格证编号查询
  const handleCertificateInfoSearch = async (values) => {
    try {
      setLoading(true);
      const response = await getCertificateInfo(values.certificateNo);
      setDataSource(response.data ? [response.data] : []);
    } catch {
      // 错误已处理
    } finally {
      setLoading(false);
    }
  };

  // 报表项
  const reportItems = [
    {
      key: "1",
      label: "车辆打印历史",
      form: (
        <Form form={form} layout="inline" onFinish={handlePrintHistorySearch}>
          <Form.Item
            name="vin"
            rules={[{ required: true, message: "请输入VIN码" }]}
          >
            <Input placeholder="VIN码" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        { title: "VIN号", dataIndex: "vin", key: "vin" },
        { title: "发动机号", dataIndex: "engineNo", key: "engineNo" },
        {
          title: "打印状态",
          dataIndex: "operateType",
          key: "operateType",
          render: (value, record) => {
            if (record.operateDesc && record.operateDesc.includes("类型：")) {
              return record.operateDesc.split("类型：")[1];
            }
            return PRINT_TYPE_NAMES[value] || value;
          },
        },
        {
          title: "打印时间",
          dataIndex: "operateTime",
          key: "operateTime",
          render: (value) => formatDateTime(value),
        },
        { title: "操作员", dataIndex: "operateUser", key: "operateUser" },
        {
          title: "合格证编号",
          key: "certificateNo",
          render: (_, record) => {
            const match = record.operateDesc?.match(/证号：([A-Za-z0-9]+)/);
            return match ? match[1] : "-";
          },
        },
      ],
    },
    {
      key: "2",
      label: "订单车修改信息",
      form: (
        <Form form={form} layout="inline" onFinish={handleOrderModifySearch}>
          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: "请选择时间范围" }]}
          >
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        {
          title: "修改时间",
          dataIndex: "modifyTime",
          key: "modifyTime",
          render: (value) => formatDateTime(value),
        },
        { title: "VIN", dataIndex: "vin", key: "vin" },
        {
          title: "生产日期",
          dataIndex: "manufactureDate",
          key: "manufactureDate",
        },
        { title: "VSN", dataIndex: "vsnCode", key: "vsnCode" },
        { title: "轮胎数", dataIndex: "tireCount", key: "tireCount" },
        { title: "轮胎规格", dataIndex: "tireSpec", key: "tireSpec" },
        {
          title: "钢板弹簧片数",
          dataIndex: "steelSpringLeafCount",
          key: "steelSpringLeafCount",
        },
        {
          title: "载客人数",
          dataIndex: "ratedPassengerCapacity",
          key: "ratedPassengerCapacity",
        },
        { title: "总质量", dataIndex: "totalMass", key: "totalMass" },
        { title: "整备质量", dataIndex: "curbWeight", key: "curbWeight" },
      ],
    },
    {
      key: "3",
      label: "合格证数量统计",
      form: (
        <Form
          form={form}
          layout="inline"
          onFinish={handleCertificateCountSearch}
        >
          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: "请选择时间范围" }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        {
          title: "打印时间",
          dataIndex: "printTime",
          key: "printTime",
          render: (value) => formatDateTime(value),
        },
        { title: "合格证号", dataIndex: "certificateNo", key: "certificateNo" },
        { title: "品种代码", dataIndex: "modelCode", key: "modelCode" },
        { title: "VIN", dataIndex: "vin", key: "vin" },
      ],
    },
    {
      key: "4",
      label: "操作员正常打印数量",
      form: (
        <Form form={form} layout="inline" onFinish={handleOperatorPrintSearch}>
          <Form.Item
            name="operatorId"
            rules={[{ required: true, message: "请输入操作员ID" }]}
          >
            <Input placeholder="操作员ID" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: "请选择时间范围" }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        { title: "操作员姓名", dataIndex: "operatorName", key: "operatorName" },
        {
          title: "打印时间",
          dataIndex: "printTime",
          key: "printTime",
          render: (value) => formatDateTime(value),
        },
        { title: "合格证号", dataIndex: "certificateNo", key: "certificateNo" },
        { title: "品种代码", dataIndex: "modelCode", key: "modelCode" },
        { title: "VIN", dataIndex: "vin", key: "vin" },
        {
          title: "打印状态",
          dataIndex: "printType",
          key: "printType",
          render: (value) => PRINT_TYPE_NAMES[value] || value,
        },
      ],
    },
    {
      key: "5",
      label: "操作员非正常打印数量",
      form: (
        <Form
          form={form}
          layout="inline"
          onFinish={handleOperatorReprintSearch}
        >
          <Form.Item
            name="operatorId"
            rules={[{ required: true, message: "请输入操作员ID" }]}
          >
            <Input placeholder="操作员ID" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: "请选择时间范围" }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        { title: "操作员姓名", dataIndex: "operatorName", key: "operatorName" },
        {
          title: "打印时间",
          dataIndex: "printTime",
          key: "printTime",
          render: (value) => formatDateTime(value),
        },
        { title: "合格证号", dataIndex: "certificateNo", key: "certificateNo" },
        { title: "品种代码", dataIndex: "modelCode", key: "modelCode" },
        { title: "VIN", dataIndex: "vin", key: "vin" },
        {
          title: "打印状态",
          dataIndex: "printType",
          key: "printType",
          render: () => "补打",
        },
      ],
    },
    {
      key: "6",
      label: "合格证编号查询",
      form: (
        <Form
          form={form}
          layout="inline"
          onFinish={handleCertificateInfoSearch}
        >
          <Form.Item
            name="certificateNo"
            rules={[{ required: true, message: "请输入合格证编号" }]}
          >
            <Input placeholder="合格证编号" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        {
          title: "合格证编号",
          dataIndex: "certificateNo",
          key: "certificateNo",
        },
        { title: "VIN", dataIndex: "vin", key: "vin" },
        { title: "VSN", dataIndex: "vsn", key: "vsn" },
        { title: "车辆品牌", dataIndex: "vehicleBrand", key: "vehicleBrand" },
        { title: "车型代码", dataIndex: "modelCode", key: "modelCode" },
        {
          title: "打印时间",
          dataIndex: "printTime",
          key: "printTime",
          render: (value) => formatDateTime(value),
        },
        { title: "操作员", dataIndex: "operatorName", key: "operatorName" },
      ],
    },
  ];

  const currentReport = reportItems.find((item) => item.key === activeTab);

  return (
    <Card title="统计报表">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          form.resetFields();
          setDataSource([]);
        }}
        items={reportItems.map((item) => ({
          key: item.key,
          label: item.label,
        }))}
      />

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {currentReport?.form}

        <Table
          columns={currentReport?.columns || []}
          dataSource={dataSource}
          loading={loading}
          rowKey={(record, index) => index}
          scroll={{ x: "max-content" }}
        />
      </Space>
    </Card>
  );
};

export function Component() {
  return <ReportsPage />;
}
