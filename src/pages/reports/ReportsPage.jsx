/**
 * 统计报表页面
 */
import { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  DatePicker,
  Button,
  Table,
  Space,
  message,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import {
  getVehiclePrintHistory,
  getOrderModifyInfo,
  getCertificateCount,
  getOperatorPrintCount,
  getOperatorReprintCount,
  getCertificateInfo,
  exportReport,
} from '../../api/reports';
import { PRINT_TYPE_NAMES } from '../../constants';
import { exportExcel, formatDateTime } from '../../utils';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  // 报表1：车辆打印历史查询
  const handlePrintHistorySearch = async (values) => {
    try {
      setLoading(true);
      const response = await getVehiclePrintHistory(values.vin);
      setDataSource(response.data || []);
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
        startTime: values.dateRange[0].format('YYYY-MM-DD'),
        endTime: values.dateRange[1].format('YYYY-MM-DD'),
      };
      const response = await getOrderModifyInfo(params);
      setDataSource(response.data || []);
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
        startTime: values.dateRange[0].format('YYYY-MM-DD'),
        endTime: values.dateRange[1].format('YYYY-MM-DD'),
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
        startTime: values.dateRange[0].format('YYYY-MM-DD'),
        endTime: values.dateRange[1].format('YYYY-MM-DD'),
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
        startTime: values.dateRange[0].format('YYYY-MM-DD'),
        endTime: values.dateRange[1].format('YYYY-MM-DD'),
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

  // 导出报表
  const handleExport = async () => {
    try {
      const values = await form.validateFields();
      let params = {};
      
      if (activeTab === '2' || activeTab === '3' || activeTab === '4' || activeTab === '5') {
        params = {
          startTime: values.dateRange[0].format('YYYY-MM-DD'),
          endTime: values.dateRange[1].format('YYYY-MM-DD'),
        };
        if (activeTab === '4' || activeTab === '5') {
          params.operatorId = values.operatorId;
        }
      }
      
      const reportTypes = {
        '1': 'print-history',
        '2': 'order-modify',
        '3': 'certificate-count',
        '4': 'operator-print',
        '5': 'operator-reprint',
        '6': 'certificate-info',
      };
      
      const response = await exportReport(reportTypes[activeTab], params);
      exportExcel(response, `报表_${dayjs().format('YYYYMMDDHHmmss')}`);
      message.success('导出成功');
    } catch {
      // 错误已处理
    }
  };

  // 报表项
  const reportItems = [
    {
      key: '1',
      label: '车辆打印历史',
      form: (
        <Form form={form} layout="inline" onFinish={handlePrintHistorySearch}>
          <Form.Item
            name="vin"
            rules={[{ required: true, message: '请输入VIN码' }]}
          >
            <Input placeholder="VIN码" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        { title: 'VIN号', dataIndex: 'vin', key: 'vin' },
        { title: '发动机号', dataIndex: 'engineNo', key: 'engineNo' },
        {
          title: '打印状态',
          dataIndex: 'printType',
          key: 'printType',
          render: (value) => PRINT_TYPE_NAMES[value] || value,
        },
        {
          title: '打印时间',
          dataIndex: 'printTime',
          key: 'printTime',
          render: (value) => formatDateTime(value),
        },
        { title: '操作员', dataIndex: 'operatorName', key: 'operatorName' },
        { title: '合格证编号', dataIndex: 'certificateNo', key: 'certificateNo' },
      ],
    },
    {
      key: '2',
      label: '订单车修改信息',
      form: (
        <Form form={form} layout="inline" onFinish={handleOrderModifySearch}>
          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        {
          title: '修改时间',
          dataIndex: 'modifyTime',
          key: 'modifyTime',
          render: (value) => formatDateTime(value),
        },
        { title: '生产年份', dataIndex: 'productionYear', key: 'productionYear' },
        { title: 'VSN', dataIndex: 'vsn', key: 'vsn' },
        { title: '品种代码', dataIndex: 'modelCode', key: 'modelCode' },
        { title: '轮胎数', dataIndex: 'tireCount', key: 'tireCount' },
        { title: '轮胎规格', dataIndex: 'tireSpec', key: 'tireSpec' },
        { title: '钢板弹簧片数', dataIndex: 'springCount', key: 'springCount' },
        { title: '载客人数', dataIndex: 'passengerCount', key: 'passengerCount' },
        { title: '总质量', dataIndex: 'totalMass', key: 'totalMass' },
        { title: '整备质量', dataIndex: 'curbWeight', key: 'curbWeight' },
      ],
    },
    {
      key: '3',
      label: '合格证数量统计',
      form: (
        <Form form={form} layout="inline" onFinish={handleCertificateCountSearch}>
          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        {
          title: '打印时间',
          dataIndex: 'printTime',
          key: 'printTime',
          render: (value) => formatDateTime(value),
        },
        { title: '合格证号', dataIndex: 'certificateNo', key: 'certificateNo' },
        { title: '品种代码', dataIndex: 'modelCode', key: 'modelCode' },
        { title: 'VIN', dataIndex: 'vin', key: 'vin' },
      ],
    },
    {
      key: '4',
      label: '操作员打印数量',
      form: (
        <Form form={form} layout="inline" onFinish={handleOperatorPrintSearch}>
          <Form.Item
            name="operatorId"
            rules={[{ required: true, message: '请输入操作员ID' }]}
          >
            <Input placeholder="操作员ID" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        { title: '操作员姓名', dataIndex: 'operatorName', key: 'operatorName' },
        {
          title: '打印时间',
          dataIndex: 'printTime',
          key: 'printTime',
          render: (value) => formatDateTime(value),
        },
        { title: '合格证号', dataIndex: 'certificateNo', key: 'certificateNo' },
        { title: '品种代码', dataIndex: 'modelCode', key: 'modelCode' },
        { title: 'VIN', dataIndex: 'vin', key: 'vin' },
        {
          title: '打印状态',
          dataIndex: 'printType',
          key: 'printType',
          render: (value) => PRINT_TYPE_NAMES[value] || value,
        },
      ],
    },
    {
      key: '5',
      label: '操作员补打数量',
      form: (
        <Form form={form} layout="inline" onFinish={handleOperatorReprintSearch}>
          <Form.Item
            name="operatorId"
            rules={[{ required: true, message: '请输入操作员ID' }]}
          >
            <Input placeholder="操作员ID" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        { title: '操作员姓名', dataIndex: 'operatorName', key: 'operatorName' },
        {
          title: '打印时间',
          dataIndex: 'printTime',
          key: 'printTime',
          render: (value) => formatDateTime(value),
        },
        { title: '合格证号', dataIndex: 'certificateNo', key: 'certificateNo' },
        { title: '品种代码', dataIndex: 'modelCode', key: 'modelCode' },
        { title: 'VIN', dataIndex: 'vin', key: 'vin' },
        {
          title: '打印状态',
          dataIndex: 'printType',
          key: 'printType',
          render: () => '补打',
        },
      ],
    },
    {
      key: '6',
      label: '合格证编号查询',
      form: (
        <Form form={form} layout="inline" onFinish={handleCertificateInfoSearch}>
          <Form.Item
            name="certificateNo"
            rules={[{ required: true, message: '请输入合格证编号' }]}
          >
            <Input placeholder="合格证编号" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
      columns: [
        { title: '合格证编号', dataIndex: 'certificateNo', key: 'certificateNo' },
        { title: 'VIN', dataIndex: 'vin', key: 'vin' },
        { title: 'VSN', dataIndex: 'vsn', key: 'vsn' },
        { title: '车辆品牌', dataIndex: 'vehicleBrand', key: 'vehicleBrand' },
        { title: '车型代码', dataIndex: 'modelCode', key: 'modelCode' },
        {
          title: '打印时间',
          dataIndex: 'printTime',
          key: 'printTime',
          render: (value) => formatDateTime(value),
        },
        { title: '操作员', dataIndex: 'operatorName', key: 'operatorName' },
      ],
    },
  ];

  const currentReport = reportItems.find(item => item.key === activeTab);

  return (
    <Card title="统计报表">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          form.resetFields();
          setDataSource([]);
        }}
        items={reportItems.map(item => ({
          key: item.key,
          label: item.label,
        }))}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {currentReport?.form}

        <Table
          columns={currentReport?.columns || []}
          dataSource={dataSource}
          loading={loading}
          rowKey={(record, index) => index}
          scroll={{ x: 'max-content' }}
        />
      </Space>
    </Card>
  );
};

export function Component() {
  return <ReportsPage />;
}
