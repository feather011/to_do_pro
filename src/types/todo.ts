/**
 * 待办事项优先级类型
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * 待办事项分类类型
 */
export type Category = 'work' | 'study' | 'life';

/**
 * 待办事项数据模型
 */
export interface Todo {
  /** 唯一标识 */
  id: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 分类 */
  category: Category;
  /** 优先级 */
  priority: Priority;
  /** 截止日期 (ISO 日期字符串) */
  dueDate: string;
  /** 是否完成 */
  completed: boolean;
  /** 创建时间 (ISO 日期字符串) */
  createdAt: string;
}
