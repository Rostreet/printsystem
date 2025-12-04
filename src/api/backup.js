/**
 * 数据备份相关API
 */
import { get } from "../utils/fetch";

/**
 * 导出数据库备份
 * @returns {Promise}
 */
export const exportDatabase = async () => {
  try {
    const response = await get("/api/db/export", {}, { responseType: "blob" });

    // 创建下载链接
    const url = window.URL.createObjectURL(response);
    const link = document.createElement("a");
    link.href = url;

    // 设置文件名，使用当前日期时间
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace(/[:-]/g, "");
    link.setAttribute("download", `database_backup_${dateStr}.db`);

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("导出数据库备份失败:", error);
    throw error;
  }
};
