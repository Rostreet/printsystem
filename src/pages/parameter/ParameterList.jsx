/**
 * 参数表维护页面
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
  PlusOutlined,
  DeleteOutlined,
  ExportOutlined,
  CopyOutlined,
  SearchOutlined,
  UndoOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  getParameterList,
  createParameter,
  updateParameter,
  deleteParameter,
} from "../../api/parameter";
import ModelView from "./components/ModelView";

const ParameterList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add, edit, view
  const [currentRecord, setCurrentRecord] = useState(null);

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
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="删除后将无法恢复，确定要删除吗？"
            onConfirm={() => handleDelete(record.modelCode)}
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
        const response = await getParameterList({
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

  const handleView = (record) => {
    setModalMode("view");
    setCurrentRecord(record);
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = (record) => {
    setModalMode("edit");
    setCurrentRecord(record);
    setModalVisible(true);
  };

  // 新增
  const handleAdd = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setModalVisible(true);
  };

  // 删除
  const handleDelete = async (modelCode) => {
    try {
      await deleteParameter(modelCode);
      message.success("删除成功");
      fetchData();
    } catch {
      // 错误已在拦截器处理
    }
  };

  // 导出全部参数
  const handleExport = async () => {
    try {
      setLoading(true);
      // 获取所有参数数据（不分页）
      const response = await getParameterList();

      const allData = response.data.records || [];

      if (allData.length === 0) {
        message.warning("没有数据可导出");
        return;
      }

      // 创建CSV内容
      const headers = [
        "车型代码",
        "车辆品牌",
        "底盘型号",
        "车辆类别",
        "燃料种类",
        "排放标准",
        "转向形式",
        "轮距",
        "企业标准",
        "外廓尺寸",
        "轴荷",
        "货箱内尺寸",
        "底盘ID",
      ];

      const rows = allData.map((data) => {
        return [
          data.modelCode,
          data.vehicleBrand,
          data.chassisModel,
          data.vehicleCategory,
          data.fuelType,
          data.emissionStandard,
          data.steeringType,
          data.wheelbase,
          data.enterpriseStandard,
          data.overallDimension,
          data.axleLoad,
          data.cargoBoxDimension || "",
          data.chassisId || "",
        ].join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob(["\ufeff" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      // 生成默认文件名
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const filename = `车型参数表_${timestamp}.csv`;

      // 使用浏览器原生下载，让用户选择保存位置
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success(`成功导出 ${allData.length} 条数据`);
    } catch {
      message.error("导出失败");
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      if (modalMode === "add") {
        await createParameter(values);
        message.success("新增成功");
      } else if (modalMode === "edit") {
        await updateParameter(currentRecord.modelCode, values);
        message.success("更新成功");
      }

      setModalVisible(false);
      fetchData();
    } catch {
      // 错误已在拦截器处理
    }
  };

  return (
    <div className="parameter-list">
      <Card>
        <Space direction="vertical" size="large" style={{ width: "80%" }}>
          {/* 搜索区域 */}
          <Form layout="inline" onFinish={handleSearch}>
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  新增车型
                </Button>
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                >
                  导出 excel
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {/* 表格 */}
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey="modelCode"
            pagination={false}
            scroll={{ x: 1000, y: 600 }}
            sticky={{ offsetHeader: 0 }}
            style={{ maxWidth: "100%" }}
          />
        </Space>
      </Card>

      {/* 车型管理模态框 */}
      <ModelView
        open={modalVisible}
        mode={modalMode}
        record={currentRecord}
        allModels={dataSource}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export function Component() {
  return <ParameterList />;
}

export default ParameterList;
