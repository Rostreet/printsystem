import React from "react";

const CertificatePreview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="certificate-preview-container print-area">
      <div className="certificate-header">车辆合格证</div>
      <table className="certificate-table">
        <tbody>
          <tr>
            <td className="label-cell">1.合格证编号</td>
            <td className="value-cell">{data.certificateNo || ""}</td>
            <td className="label-cell">2.发证日期</td>
            <td className="value-cell">{data.issueDate || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">3.车辆制造企业名称</td>
            <td className="value-cell" colSpan="3">
              {data.manufacturerName || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">4.车辆品牌/车辆名称</td>
            <td className="value-cell" colSpan="3">
              {data.vehicleBrand ? `${data.vehicleBrand}牌` : ""}{" "}
              {data.vehicleName || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">5.车辆型号</td>
            <td className="value-cell">{data.vehicleModel || ""}</td>
            <td className="label-cell">6.车辆识别代号/车架号</td>
            <td className="value-cell">{data.vin || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">7.车辆颜色</td>
            <td className="value-cell" colSpan="3">
              {data.vehicleColor || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">8.底盘型号/底盘ID</td>
            <td className="value-cell" colSpan="3">
              {data.chassisModel || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">9.底盘合格证编号</td>
            <td className="value-cell">{data.chassisCertificateNo || ""}</td>
            <td className="label-cell">10.发动机型号</td>
            <td className="value-cell">{data.engineInfo || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">11.发动机号</td>
            <td className="value-cell" colSpan="3">
              {data.engineNo || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">12.燃料种类</td>
            <td className="value-cell">{data.fuelType || ""}</td>
            <td className="label-cell">13.排量和功率(ml/kw)</td>
            <td className="value-cell">
              {data.displacement ? `${data.displacement}/` : ""}
              {data.power || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">14.排放标准</td>
            <td className="value-cell" colSpan="3">
              {data.emissionStandard || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">15.外廓尺寸(mm)</td>
            <td className="value-cell">{data.outlineSize || ""}</td>
            <td className="label-cell">16.货箱内部尺寸(mm)</td>
            <td className="value-cell">{data.cargoBoxInnerSize || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">17.钢板弹簧片数(片)</td>
            <td className="value-cell">{data.steelSpringLeafCount || ""}</td>
            <td className="label-cell">18.轮胎数</td>
            <td className="value-cell">{data.tireCount || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">19.轮胎规格</td>
            <td className="value-cell">{data.tireSpec || ""}</td>
            <td className="label-cell">38.车辆类型</td>
            <td className="value-cell">{data.vehicleType || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">20.轮距(前/后)(mm)</td>
            <td className="value-cell" colSpan="3">
              {data.track || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">21.轮距(mm)</td>
            <td className="value-cell" colSpan="3">
              {data.wheelbase || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">22.轮荷(kg)</td>
            <td className="value-cell" colSpan="3">
              {data.wheelLoad || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">23.轴数</td>
            <td className="value-cell">{data.axleCount || ""}</td>
            <td className="label-cell">24.转向形式</td>
            <td className="value-cell">{data.steeringType || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">25.总质量(kg)</td>
            <td className="value-cell">{data.totalMass || ""}</td>
            <td className="label-cell">26.整备质量(kg)</td>
            <td className="value-cell">{data.curbWeight || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">27.额定载质量(kg)</td>
            <td className="value-cell">{data.ratedLoadMass || ""}</td>
            <td className="label-cell">28.载质量利用系数</td>
            <td className="value-cell">
              {data.loadMassUtilizationCoefficient || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">29.准牵引总质量(kg)</td>
            <td className="value-cell">{data.quasiTractionTotalMass || ""}</td>
            <td className="label-cell">30.半挂车鞍座最大允许总质量(kg)</td>
            <td className="value-cell">
              {data.semiTrailerSaddleMaxMass || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">31.驾驶室准乘人数</td>
            <td className="value-cell">{data.cabSeatingCapacity || ""}</td>
            <td className="label-cell">32.额定载客</td>
            <td className="value-cell">{data.ratedPassengerCapacity || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">33.最高车速(km/h)</td>
            <td className="value-cell">{data.maxSpeed || ""}</td>
            <td className="label-cell">34.车辆制造日期</td>
            <td className="value-cell">{data.manufactureDate || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">35.备注</td>
            <td className="value-cell" colSpan="3">
              {data.remark || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">36.企业标准</td>
            <td className="value-cell" colSpan="3">
              {data.enterpriseStandard || ""}
            </td>
          </tr>
          <tr>
            <td className="label-cell">37.产品生产地址</td>
            <td className="value-cell" colSpan="3">
              {data.productionAddress || ""}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CertificatePreview;
