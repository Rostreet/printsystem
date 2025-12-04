/**
 * 订单车维护页面
 */
import { useState, useEffect, useCallback } from "react";
import { Card, Table, Space, Typography } from "antd";
import { getOrderList } from "../../api/order";

const OrderList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  // 表格列定义
  const columns = [
    {
      title: "车辆品牌",
      dataIndex: "vehicleBrand",
      key: "vehicleBrand",
      width: 100,
      fixed: "left",
    },
    {
      title: "车型代码",
      dataIndex: "modelCode",
      key: "modelCode",
      width: 100,
    },
    {
      title: "车辆型号",
      dataIndex: "vehicleModel",
      key: "vehicleModel",
      width: 150,
    },
    {
      title: "VIN",
      dataIndex: "vin",
      key: "vin",
      width: 150,
    },
    {
      title: "VSN码",
      dataIndex: "vsnCode",
      key: "vsnCode",
      width: 110,
    },
    {
      title: "颜色",
      dataIndex: "vehicleColor",
      key: "vehicleColor",
      width: 80,
    },
    {
      title: "底盘型号",
      dataIndex: "chassisModel",
      key: "chassisModel",
      width: 100,
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
      title: "排量(L)",
      dataIndex: "displacement",
      key: "displacement",
      width: 80,
      render: (value) => value || "-",
    },
    {
      title: "功率(kW)",
      dataIndex: "power",
      key: "power",
      width: 80,
      render: (value) => value || "-",
    },
    {
      title: "排放",
      dataIndex: "emissionStandard",
      key: "emissionStandard",
      width: 80,
    },
    {
      title: "外廓尺寸",
      dataIndex: "outlineSize",
      key: "outlineSize",
      width: 130,
    },
    {
      title: "货箱尺寸",
      dataIndex: "cargoBoxInnerSize",
      key: "cargoBoxInnerSize",
      width: 120,
      render: (value) => value || "-",
    },
    {
      title: "弹簧片数",
      dataIndex: "steelSpringLeafCount",
      key: "steelSpringLeafCount",
      width: 90,
      render: (value) => value || "-",
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
      title: "类型",
      dataIndex: "vehicleType",
      key: "vehicleType",
      width: 80,
    },
    {
      title: "轮距",
      dataIndex: "track",
      key: "track",
      width: 100,
    },
    {
      title: "轮荷",
      dataIndex: "wheelLoad",
      key: "wheelLoad",
      width: 100,
    },
    {
      title: "轴数",
      dataIndex: "axleCount",
      key: "axleCount",
      width: 60,
    },
    {
      title: "转向",
      dataIndex: "steeringType",
      key: "steeringType",
      width: 80,
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
      title: "载质量系数",
      dataIndex: "loadMassUtilizationCoefficient",
      key: "loadMassUtilizationCoefficient",
      width: 100,
      render: (value) => value || "-",
    },
    {
      title: "准牵引总质量",
      dataIndex: "quasiTractionTotalMass",
      key: "quasiTractionTotalMass",
      width: 120,
      render: (value) => value || "-",
    },
    {
      title: "鞍座最大质量",
      dataIndex: "semiTrailerSaddleMaxMass",
      key: "semiTrailerSaddleMaxMass",
      width: 120,
      render: (value) => value || "-",
    },
    {
      title: "驾驶室人数",
      dataIndex: "cabSeatingCapacity",
      key: "cabSeatingCapacity",
      width: 100,
      render: (value) => value || "-",
    },
    {
      title: "额定载客",
      dataIndex: "ratedPassengerCapacity",
      key: "ratedPassengerCapacity",
      width: 90,
      render: (value) => value || "-",
    },
    {
      title: "最高速度",
      dataIndex: "maxSpeed",
      key: "maxSpeed",
      width: 90,
      render: (value) => value || "-",
    },
    {
      title: "制造日期",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "type",
      key: "type",
      width: 100,
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
      title: "企业标准",
      dataIndex: "enterpriseStandard",
      key: "enterpriseStandard",
      width: 200,
    },
    {
      title: "生产地址",
      dataIndex: "productionAddress",
      key: "productionAddress",
      width: 200,
    },
  ];
  // 加载数据
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrderList();
      setDataSource(response.data || []);
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="order-list">
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* 表格 */}
          <Typography.Title level={4}>订单车列表</Typography.Title>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey="vin"
            pagination={false}
            scroll={{ x: "max-content", y: 600 }}
            sticky={{ offsetHeader: 0 }}
            style={{ width: "100%" }}
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
