import { format, parseISO, isValid, isBefore, startOfDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期为本地字符串
 * @param date - 日期字符串或 Date 对象
 * @param formatStr - 格式化模板，默认为 'yyyy-MM-dd'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | Date, formatStr: string = 'yyyy-MM-dd'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return '无效日期';
    }
    return format(dateObj, formatStr, { locale: zhCN });
  } catch {
    return '无效日期';
  }
};

/**
 * 格式化日期时间
 * @param date - 日期字符串或 Date 对象
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
};

/**
 * 获取相对时间描述
 * @param date - 日期字符串或 Date 对象
 * @returns 相对时间描述
 */
export const getRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return '无效日期';
    }
    
    const now = new Date();
    const diffTime = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return '已过期';
    } else if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '明天';
    } else if (diffDays <= 7) {
      return `${diffDays}天后`;
    } else {
      return formatDate(date);
    }
  } catch {
    return '无效日期';
  }
};

/**
 * 检查日期是否已过期
 * @param date - 日期字符串或 Date 对象
 * @returns 是否已过期
 */
export const isOverdue = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return false;
    }
    return isBefore(dateObj, startOfDay(new Date()));
  } catch {
    return false;
  }
};

/**
 * 获取今天的日期字符串（用于日期输入框）
 * @returns 今天的日期字符串，格式为 yyyy-MM-dd
 */
export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * 检查日期是否在指定天数内到期
 * @param date - 日期字符串或 Date 对象
 * @param days - 天数
 * @returns 是否在指定天数内到期
 */
export const isDueWithinDays = (date: string | Date, days: number): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return false;
    }
    
    const now = new Date();
    const diffTime = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= days;
  } catch {
    return false;
  }
};
