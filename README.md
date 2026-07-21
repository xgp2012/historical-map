# 历史地图 - 穿越时空的世界

交互式历史地理探索工具，通过拖动时间线查看全球不同时期的历史版图变迁。

## 功能

- **时间线滑块**：拖动滑块在公元前3000年至公元2000年间自由穿梭
- **Canvas 地图渲染**：等距圆柱投影，展示帝国疆域和大陆轮廓
- **信息面板**：显示当前时期的历史事件和主要帝国
- **帝国图例**：随时期动态更新
- **年份搜索**：支持"公元前X年"、"公元X年"等格式快速跳转
- **平滑动画**：时期切换时帝国疆域淡入淡出过渡
- **深色羊皮纸风格**：沉浸式历史主题视觉

## 技术栈

- **框架**: Astro 5.x
- **样式**: TailwindCSS 3.x
- **地图**: Canvas API（无第三方地图库依赖）
- **投影**: 等距圆柱投影（Equirectangular Projection）
- **字体**: Playfair Display + EB Garamond

## 快速开始

```bash
npm install
npm run dev       # 开发服务器
npm run build     # 构建静态站点（输出到 dist/）
npm run preview   # 预览构建结果
```

## 项目结构

```
src/
├── components/     # UI 组件（WorldMap, Timeline, InfoPanel 等）
├── data/           # 数据层（地理轮廓、帝国定义、历史时期）
├── layouts/        # 页面布局
├── pages/          # 页面（首页 + 关于页）
├── styles/         # 全局样式
└── utils/          # 工具函数（投影、渲染器）
```

## 部署

支持 Cloudflare Pages、Vercel、Netlify、GitHub Pages 等平台，框架预设选择 Astro 即可。

## 数据说明

- 11 个历史时期覆盖公元前3000年至公元2000年
- 46 个帝国/文明的定义
- 疆域边界为示意性质，不具精确地理参考意义