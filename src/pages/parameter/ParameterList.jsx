**
 * 参数表维护页面
 */
import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  CopyOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  getParameterList,
  getParameterByModelCode,
  createParameter,
  updateParameter,
  deleteParameter,
  copyParameter,
  exportParameterToExcel,
} from '../../api/parameter';
import { VEHICLE_CATEGORY_OPTIONS } from '../../constants';
import { exportExcel } from '../../utils';
import './ParameterList.css';

const ParameterList = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // add, edit, copy
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  // 表格列定义
  const columns = [
    {
      title: '车型代码',
      dataIndex: 'modelCode',
      key: 'modelCode',
      width: 120,
      fixed: 'left',
    },
    {
      title: '车辆品牌',
      dataIndex: 'vehicleBrand',
      key: 'vehicleBrand',
      width: 150,
    },
    {
      title: '底盘型号',
      dataIndex: 'chassisModel',
      key: 'chassisModel',
      width: 150,
    },
    {
      title: '车辆类别',
      dataIndex: 'vehicleCategory',
      key: 'vehicleCategory',
      width: 120,
      render: (value) => {
        const option = VEHICLE_CATEGORY_OPTIONS.find(item => item.value === value);
        return option?.label || value;
      },
    },
    {
      title: '燃料种类',
      dataIndex: 'fuelType',
      key: 'fuelType',
      width: 100,
    },
    {
      title: '排放标准',
      dataIndex: 'emissionStandard',
      key: 'emissionStandard',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
          >
            复制
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ExportOutlined />}
            onClick={() => handleExport(record.modelCode)}
          >
            导出
          </Button>
          <Popconfirm
            title="确认删除"
            description="删除后将无法恢复，确定要删除吗？"
            onConfirm={() => handleDelete(record.modelCode)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 加载数据
  const fetchData = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getParameterList({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
        ...params,
      });
      setDataSource(response.data.records || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || 0,
      }));
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchData();
  }, []);

  // 搜索
  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData({ ...values, page: 1 });
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({});
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData({ page: 1 });
  };

  // 分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    fetchData({ page: pagination.current, pageSize: pagination.pageSize });
  };

  // 新增
  const handleAdd = () => {
    setModalType('add');
    setCurrentRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = async (record) => {
    try {
      const response = await getParameterByModelCode(record.modelCode);
      setModalType('edit');
      setCurrentRecord(record);
      form.setFieldsValue(response.data);
      setModalVisible(true);
    } catch (error) {
      // 错误已在拦截器处理
    }
  };

  // 复制
  const handleCopy = async (record) => {
    try {
      const response = await getParameterByModelCode(record.modelCode);
      setModalType('copy');
      setCurrentRecord(record);
      const data = { ...response.data };
      delete data.modelCode; // 清空车型代码，需要用户重新输入
      form.setFieldsValue(data);
      setModalVisible(true);
    } catch (error) {
      // 错误已在拦截器处理
    }
  };

  // 删除
  const handleDelete = async (modelCode) => {
    try {
      await deleteParameter(modelCode);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      // 错误已在拦截器处理
    }
  };

  // 导出
  const handleExport = async (modelCode) => {
    try {
      const response = await exportParameterToExcel(modelCode);
      exportExcel(response, `车型参数_${modelCode}`);
      message.success('导出成功');
    } catch (error) {
      // 错误已在拦截器处理
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (modalType === 'add' || modalType === 'copy') {
        await createParameter(values);
        message.success('新增成功');
      } else {
        await updateParameter(currentRecord.modelCode, values);
        message.success('更新成功');
      }
      
      setModalVisible(false);
      fetchData();
    } catch (error) {
      if (error.errorFields) {
        // 表单验证失败
        return;
      }
      // 其他错误已在拦截器处理
    }
  };

  return (
    <div className="parameter-list">
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 搜索区域 */}
          <Form layout="inline" onFinish={handleSearch}>
            <Form.Item name="modelCode">
              <Input
                placeholder="车型代码"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="vehicleCategory">
              <Select
                placeholder="车辆类别"
                options={VEHICLE_CATEGORY_OPTIONS}
                style={{ width: 150 }}
                allowClear
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  新增车型
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
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </Space>
      </Card>

      {/* 新增/编辑/复制模态框 */}
      <Modal
        title={
          modalType === 'add'
            ? '新增车型参数'
            : modalType === 'edit'
            ? '编辑车型参数'
            : '复制车型参数'
        }
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="车型代码"
            name="modelCode"
            rules={[
              { required: true, message: '请输入车型代码' },
              { len: 4, message: '车型代码必须为4位' },
            ]}
          >
            <Input
              placeholder="请输入4位车型代码"
              disabled={modalType === 'edit'}
              maxLength={4}
            />
          </Form.Item>

          <Form.Item
            label="车辆品牌"
            name="vehicleBrand"
            rules={[
              { required: true, message: '请输入车辆品牌' },
            ]}
            extra="中文需加"牌"字，中英文用"/"分隔"
          >
            <Input placeholder="如：解放牌/FAW" />
          </Form.Item>

          <Form.Item
            label="底盘型号"
            name="chassisModel"
            rules={[
              { required: true, message: '请输入底盘型号' },
              { pattern: /^[A-Z0-9]+$/, message: '底盘型号不允许填写汉字' },
            ]}
          >
            <Input placeholder="如：CA1234PK2L5" />
          </Form.Item>

          <Form.Item
            label="车辆类别"
            name="vehicleCategory"
            rules={[{ required: true, message: '请选择车辆类别' }]}
          >
            <Select
              options={VEHICLE_CATEGORY_OPTIONS}
              placeholder="请选择车辆类别"
            />
          </Form.Item>

          <Form.Item
            label="燃料种类"
            name="fuelType"
            rules={[{ required: true, message: '请输入燃料种类' }]}
          >
            <Input placeholder="如：柴油" />
          </Form.Item>

          <Form.Item
            label="排放标准"
            name="emissionStandard"
            rules={[{ required: true, message: '请输入排放标准' }]}
          >
            <Input placeholder="如：国六" />
          </Form.Item>

          <Form.Item
            label="转向形式"
            name="steeringType"
            rules={[{ required: true, message: '请输入转向形式' }]}
          >
            <Input placeholder="如：方向盘" />
          </Form.Item>

          <Form.Item
            label="轮距（前/后）"
            name="wheelbase"
            rules={[{ required: true, message: '请输入轮距' }]}
            extra="格式：前轮距/后轮距，如：1850/1800"
          >
            <Input placeholder="如：1850/1800" />
          </Form.Item>

          <Form.Item
            label="企业标准"
            name="enterpriseStandard"
            rules={[{ required: true, message: '请输入企业标准' }]}
            extra="格式：XXXX-XXXX《XXXXX》"
          >
            <Input placeholder="如：Q/CR9999-2023《载货汽车技术条件》" />
          </Form.Item>

          <Form.Item
            label="外廓尺寸"
            name="overallDimension"
            rules={[{ required: true, message: '请输入外廓尺寸' }]}
            extra="使用全角乘号"×"，格式：长×宽×高"
          >
            <Input placeholder="如：8500×2500×3200" />
          </Form.Item>

          <Form.Item
            label="轴荷"
            name="axleLoad"
            rules={[{ required: true, message: '请输入轴荷' }]}
            extra="满载轴荷，用"/"分隔，并装轴需注明"
          >
            <Input placeholder="如：6500/17500并装双轴" />
          </Form.Item>

          <Form.Item
            label="货箱内尺寸"
            name="cargoBoxDimension"
            extra="不填为空，填写不能有汉字"
          >
            <Input placeholder="如：4200×2300×2000" />
          </Form.Item>

          <Form.Item
            label="底盘ID"
            name="chassisId"
            rules={[
              {
                validator: (_, value) => {
                  const category = form.getFieldValue('vehicleCategory');
                  if (category === 'CHASSIS' && !value) {
                    return Promise.reject('二类底盘必须填写底盘ID');
                  }
                  if (value && !/^\d{7}$/.test(value)) {
                    return Promise.reject('底盘ID必须为7位数字');
                  }
                  return Promise.resolve();
                },
              },
            ]}
            extra="二类底盘必填，7位数字"
          >
            <Input placeholder="如：1234567" maxLength={7} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export function Component() {
  return <ParameterList />;
}

export default ParameterList;
