/**
 * 参数表维护页面
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  RetweetOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  getParameterList,
  createParameter,
  updateParameter,
  deleteParameter,
  getParameterByModelCode,
} from "../../api/parameter";
import ModelView from "./components/ModelView";
import StatusChangeModal from "./components/StatusChangeModal";
import GoPrintModal from "./components/goPrintModal";
import { VEHICLE_STATUS_NAMES } from "../../constants";
const ParameterList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add, edit, view
  const [currentRecord, setCurrentRecord] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [goPrintModalVisible, setGoPrintModalVisible] = useState(false);
  const [currentStatusRecord, setCurrentStatusRecord] = useState(null);

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
      title: "状态",
      dataIndex: "type",
      key: "type",
      width: 120,
      fixed: "left",
      render: (value) => VEHICLE_STATUS_NAMES[value] || "-",
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
      width: 200,
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
          <Button
            type="link"
            size="small"
            info
            onClick={() => {
              if (record.type === "notqualified") {
                message.warning("不合格车辆无法从此系统变更状态,请手动处理");
                return;
              }

              setCurrentStatusRecord(record);

              if (
                ["chassis", "order", "reprint", "supplement", "whole"].includes(
                  record.type
                )
              ) {
                setGoPrintModalVisible(true);
              } else {
                setStatusModalVisible(true);
              }
            }}
            icon={<RetweetOutlined />}
          >
            状态变化
          </Button>
        </Space>
      ),
    },
  ];

  // 加载数据
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getParameterList();
      // 确保response.data是数组格式，如果是对象则用数组包裹
      let data = Array.isArray(response.data)
        ? response.data
        : [response.data].filter(Boolean);

      // 确保每个数据项都包含status字段，默认值为"合格"
      data = data.map((item) => ({
        ...item,
        type: item.type || "-",
      }));

      setDataSource(data);
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 搜索
  const handleSearch = async (values) => {
    try {
      setLoading(true);
      const response = await getParameterByModelCode(values);
      // 确保response.data是数组格式，如果是对象则用数组包裹
      let data = Array.isArray(response.data)
        ? response.data
        : [response.data].filter(Boolean);

      // 确保每个数据项都包含status字段，默认值为"合格"
      data = data.map((item) => ({
        ...item,
        status: item.type || "-",
      }));

      setDataSource(data);
    } catch {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({});
    fetchData({});
  };

  // 新增
  const handleAdd = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setModalVisible(true);
  };

  // 删除
  const handleDelete = async (vin) => {
    try {
      await deleteParameter(vin);
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

      // 处理不同的响应数据格式
      let allData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          allData = response.data;
        } else if (
          response.data.records &&
          Array.isArray(response.data.records)
        ) {
          allData = response.data.records;
        } else {
          // 如果是单个对象，用数组包裹
          allData = [response.data].filter(Boolean);
        }
      }

      if (allData.length === 0) {
        message.warning("没有数据可导出");
        return;
      }

      // 创建CSV内容 - 根据columns配置导出所有字段
      const headers = [
        "车辆品牌",
        "状态",
        "车型代码",
        "车辆型号",
        "VIN",
        "VSN码",
        "颜色",
        "底盘型号",
        "发动机型号",
        "燃料",
        "排量(L)",
        "功率(kW)",
        "排放",
        "外廓尺寸",
        "货箱尺寸",
        "弹簧片数",
        "轮胎数",
        "轮胎规格",
        "类型",
        "轮距",
        "轮荷",
        "轴数",
        "转向",
        "总质量",
        "整备质量",
        "额定载质量",
        "载质量系数",
        "准牵引总质量",
        "鞍座最大质量",
        "驾驶室人数",
        "额定载客",
        "最高速度",
        "制造日期",
        "备注",
        "企业标准",
        "生产地址",
      ];

      const rows = allData.map((data) => {
        return [
          data.vehicleBrand,
          VEHICLE_STATUS_NAMES[data.type] || data.type || "-",
          data.modelCode,
          data.vehicleModel || "-",
          data.vin || "-",
          data.vsnCode || "-",
          data.vehicleColor || "-",
          data.chassisModel || "-",
          data.engineInfo || "-",
          data.fuelType || "-",
          data.displacement || "-",
          data.power || "-",
          data.emissionStandard || "-",
          data.outlineSize || "-",
          data.cargoBoxInnerSize || "-",
          data.steelSpringLeafCount || "-",
          data.tireCount || "-",
          data.tireSpec || "-",
          data.vehicleType || "-",
          data.track || "-",
          data.wheelLoad || "-",
          data.axleCount || "-",
          data.steeringType || "-",
          data.totalMass || "-",
          data.curbWeight || "-",
          data.ratedLoadMass || "-",
          data.loadMassUtilizationCoefficient || "-",
          data.quasiTractionTotalMass || "-",
          data.semiTrailerSaddleMaxMass || "-",
          data.cabSeatingCapacity || "-",
          data.ratedPassengerCapacity || "-",
          data.maxSpeed || "-",
          data.manufactureDate || "-",
          data.remark || "-",
          data.enterpriseStandard || "-",
          data.productionAddress || "-",
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
      }

      setModalVisible(false);
      fetchData();
    } catch {
      // 错误已在拦截器处理
    }
  };

  // 状态变更处理
  const handleStatusChange = async (record, values) => {
    try {
      const type = values.type;
      const vin = values.vin;
      // 更新记录状态
      const updatedRecord = {
        vin: vin,
        type: type,
      };

      // 保存更新后的状态到后端
      await updateParameter(updatedRecord);

      // 关闭弹窗
      setStatusModalVisible(false);

      // 重新加载数据
      fetchData();

      // 根据装套类型进行不同的处理和跳转
      switch (type) {
        case "reprint":
          // 重打：跳转到补打页面
          message.success("跳转到合格证补打页面（重打）");
          navigate(`/reprint?vin=${values.vin}&vsn=${values.vsnCode}`);
          break;

        case "supplement":
        case "chassis":
        case "order":
        case "qualified": {
          // 其他情况：跳转到打印页面
          const typeMap = {
            chassis: "二类底盘",
            order: "订单车",
            qualified: "合格",
          };
          message.success(`跳转到合格证打印页面（${typeMap[type]}）`);
          navigate(
            `/print?vin=${values.vin}&vsn=${record.vsnCode}&type=${type}`
          );
          break;
        }

        case "notqualified":
          message.info("车辆状态已更新为不合格");
          break;

        default:
          message.warning("未知的装套类型");
          break;
      }
    } catch {
      message.error("状态更新失败");
    }
  };

  return (
    <div className="parameter-list">
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
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

      {/* 状态变更模态框 */}
      <StatusChangeModal
        open={statusModalVisible}
        record={currentStatusRecord}
        onCancel={() => setStatusModalVisible(false)}
        onStatusChange={handleStatusChange}
      />

      {/* 跳转到打印页面 */}
      <GoPrintModal
        open={goPrintModalVisible}
        record={currentStatusRecord}
        onCancel={() => setGoPrintModalVisible(false)}
      />
    </div>
  );
};

export function Component() {
  return <ParameterList />;
}

export default ParameterList;
