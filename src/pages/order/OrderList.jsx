/**
 * 订单车维护页面
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
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { getOrderList, deleteOrder } from "../../api/order";

const OrderList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchParams, setSearchParams] = useState({});

  // 表格列定义
  const columns = [
    {
      title: "VIN码",
      dataIndex: "vin",
      key: "vin",
      width: 180,
      fixed: "left",
    },
    {
      title: "VSN码",
      dataIndex: "vsn",
      key: "vsn",
      width: 140,
    },
    {
      title: "车型代码",
      dataIndex: "modelCode",
      key: "modelCode",
      width: 100,
    },
    {
      title: "车辆品牌",
      dataIndex: "vehicleBrand",
      key: "vehicleBrand",
      width: 100,
    },
    {
      title: "车辆型号",
      dataIndex: "vehicleModel",
      key: "vehicleModel",
      width: 150,
    },
    {
      title: "颜色",
      dataIndex: "vehicleColor",
      key: "vehicleColor",
      width: 80,
    },
    {
      title: "发动机型号",
      dataIndex: "engineInfo",
      key: "engineInfo",
      width: 120,
    },
    {
      title: "燃料",
      dataIndex: "fuelType",
      key: "fuelType",
      width: 80,
    },
    {
      title: "排放",
      dataIndex: "emissionStandard",
      key: "emissionStandard",
      width: 80,
    },
    {
      title: "轮胎数",
      dataIndex: "tireCount",
      key: "tireCount",
      width: 70,
    },
    {
      title: "轮胎规格",
      dataIndex: "tireSpec",
      key: "tireSpec",
      width: 100,
    },
    {
      title: "总质量",
      dataIndex: "totalMass",
      key: "totalMass",
      width: 90,
      render: (value) => value || "-",
    },
    {
      title: "整备质量",
      dataIndex: "curbWeight",
      key: "curbWeight",
      width: 90,
      render: (value) => value || "-",
    },
    {
      title: "额定载质量",
      dataIndex: "ratedLoadMass",
      key: "ratedLoadMass",
      width: 100,
      render: (value) => value || "-",
    },
    {
      title: "特殊描述",
      dataIndex: "specialDescription",
      key: "specialDescription",
      width: 200,
      render: (value) => value || "-",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      width: 150,
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
            onConfirm={() => handleDelete(record.vin)}
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
        const response = await getOrderList({
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
  const handleDelete = async (vin) => {
    try {
      await deleteOrder(vin);
      message.success("删除成功");
      fetchData();
    } catch {
      // 错误已在拦截器处理
    }
  };

  return (
    <div className="order-list">
      <Card>
        <Space direction="vertical" size="large" style={{ width: "80%" }}>
          {/* 搜索区域 */}
          <Form layout="inline" onFinish={handleSearch}>
            <Form.Item name="vin">
              <Input
                placeholder="VIN码"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="vsn">
              <Input
                placeholder="VSN码"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="modelCode">
              <Input
                placeholder="车型代码"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
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
            rowKey="vin"
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
  return <OrderList />;
}

export default OrderList;
