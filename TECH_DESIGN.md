# 技术设计

## 技术栈

- 前端：React + TypeScript + Vite
- 样式：Tailwind CSS
- React Router（如果需要多页面）
- Framer Motion（动画效果）
- 状态管理：Zustand
- 日期处理：date-fns
- 数据存储：LocalStorage

## 数据模型

字段：
- id（唯一标识）
- title（标题）
- description（描述）
- category（分类）
- priority（优先级：低、中、高）
- dueDate（截止日期）
- completed（是否完成）
- createdAt（创建时间）

## 数据管理

- 状态管理用 Zustand，数据存储用 LocalStorage
- 使用数组存储，方便后续添加和修改
