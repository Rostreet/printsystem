/**
 * 二类底盘维护页面
 */
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Form,
  message,
  Popconfirm,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { getChassisList, deleteChassis } from "../../api/chassis";

const ChassisList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchParams, setSearchParams] = useState({});

  // 表格列定义
  const columns = [
    {
      title: "VIN前缀",
      dataIndex: "vinPrefix",
      key: "vinPrefix",
      width: 150,
      fixed: "left",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "VSN前缀",
      dataIndex: "vsnPrefix",
      key: "vsnPrefix",
      width: 120,
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: "底盘型号",
      dataIndex: "chassisModel",
      key: "chassisModel",
      width: 150,
    },
    {
      title: "车辆品牌",
      dataIndex: "vehicleBrand",
      key: "vehicleBrand",
      width: 100,
    },
    {
      title: "底盘类别",
      dataIndex: "chassisCategory",
      key: "chassisCategory",
      width: 100,
    },
    {
      title: "识别规则",
      dataIndex: "identificationRule",
      key: "identificationRule",
      width: 200,
      render: (value) => value || "-",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => (
        <Tag color={status === "active" ? "success" : "default"}>
          {status === "active" ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      width: 200,
      render: (value) => value || "-",
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="确认删除"
            description="删除后将无法恢复，确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 加载数据
  const fetchData = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const response = await getChassisList({
          ...searchParams,
          ...params,
        });
        setDataSource(response.data.records || []);
      } catch {
        // 错误已在拦截器处理
      } finally {
        setLoading(false);
      }
    },
    [searchParams]
  );

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 搜索
  const handleSearch = (values) => {
    setSearchParams(values);
    fetchData(values);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({});
    fetchData({});
  };

  // 删除
  const handleDelete = async (id) => {
    try {
      await deleteChassis(id);
      message.success("删除成功");
      fetchData();
    } catch {
      // 错误已在拦截器处理
    }
  };

  return (
    <div className="chassis-list">
      <Card>
        <Space direction="vertical" size="large" style={{ width: "80%" }}>
          {/* 搜索区域 */}
          <Form layout="inline" onFinish={handleSearch}>
            <Form.Item name="vinPrefix">
              <Input
                placeholder="VIN前缀（前8位）"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                maxLength={8}
              />
            </Form.Item>
            <Form.Item name="vsnPrefix">
              <Input
                placeholder="VSN前缀（前2位）"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                maxLength={2}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={handleReset}>
                  <UndoOutlined />
                </Button>
                <Button type="primary" htmlType="submit">
                  <SearchOutlined />
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {/* 表格 */}
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1000, y: 600 }}
            sticky={{ offsetHeader: 0 }}
            style={{ maxWidth: "100%" }}
          />
        </Space>
      </Card>
    </div>
  );
};

export function Component() {
  return <ChassisList />;
}

export default ChassisList;
