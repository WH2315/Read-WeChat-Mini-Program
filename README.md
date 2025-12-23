# 悦读 · 微信小程序示例

这是一个基于微信小程序的阅读系统示例，包含小说与新闻模块、搜索、书架与阅读进度等基础功能。示例数据均为原创占位内容，不含版权文本。

## 使用步骤

1. 安装并打开微信开发者工具。
2. 在工具中选择“导入项目”，目录选择 `d:\code\2\222`。
3. AppID 可暂用 `touristappid`（游客测试），或替换为你的真实 AppID。
4. 运行与预览：工具左侧选择“编译”，查看模拟器页面效果。

## 功能概览
- 小说列表、详情与章节阅读器（支持上一章/下一章与进度保存）。
- 新闻列表与详情页。
- 搜索（小说/新闻标题与简介）。
- 书架（加入/移除，持久化到本地存储）。

## 数据与版权
- 当前项目使用 `mock/novels.js` 与 `mock/news.js` 的原创示例数据，仅用于演示；不含受版权保护的文本。
- 如需接入真实新闻/小说数据，请确保来源合法合规，并在小程序后台配置“request 合法域名”。

## 后续拓展建议
- 接入合规新闻源（官方 RSS/开放 API）与自有版权小说库。
- 使用云开发（CloudBase）或你的服务端提供搜索、书籍更新等。
- 增加主题与阅读设置（字号、夜间模式）。
- 编写单元测试与集成测试，保障核心逻辑稳定。

## 后端/云开发接入指引

### 接口形状（示例）
- 小说列表：`GET /api/novels?page=1&pageSize=20` → `{ list: [...], total }`
- 小说详情：`GET /api/novels/{id}` → `{ id, title, author, desc, cover, chapters: [{ id, title }] }`
- 小说章节：`GET /api/novels/{id}/chapters/{chapterId}` → `{ id, title, content }`
- 新闻列表：`GET /api/news?page=1&pageSize=20` → `{ list: [...], total }`
- 新闻详情：`GET /api/news/{id}` → `{ id, title, summary, content, date }`
- 搜索：`GET /api/search?q=keyword` → `{ novels: [...], news: [...] }`

### 前端替换点
- 统一在 `utils/api.js` 内替换为 `wx.request`（或云函数调用），保持返回 Promise 形状，页面无需改动：
	```js
	const BASE = 'https://your-domain.com';
	function getNovels(params) {
		return new Promise((resolve, reject) => {
			wx.request({ url: `${BASE}/api/novels`, method: 'GET', data: params, success: res => resolve(res.data.list), fail: reject });
		});
	}
	```

### 微信云开发（CloudBase）思路
- 数据：在云数据库创建 `novels`、`chapters`、`news` 集合；`chapters` 以小说 id + 序号索引。
- 接口：用云函数暴露列表/详情/搜索；前端通过 `wx.cloud.callFunction` 获取数据，仍在 `utils/api.js` 内封装。
- 合法域名：使用云开发可免配外部 request 域名；若用自建服务，则在小程序后台配置合法域名。

### 自建后端建议
- 技术栈：Express/Koa + MongoDB 或 NestJS + PostgreSQL 都可；加 Redis 缓存热点章节。
- 分页：推荐基于游标或 `page+pageSize`，返回 `total` 便于前端计算 `hasMore`。
- 内容合规：确保小说版权与新闻源授权；对外链/图片做白名单与过滤。

### 本地示例后端（Express）
- 安装依赖并启动
	```powershell
	cd d:\code\2\222
	npm install
	npm start
	```
- 服务端口：默认 `http://localhost:3000`
- 接口：与上述形状一致（列表/详情/章节/搜索）
- 前端接入：在 `utils/api.js` 设置 `BASE_URL = 'http://localhost:3000'` 即可从小程序直连本地 API。

### 云开发云函数示例
- 位置：`cloudfunctions/content/index.js`（复用 mock 数据实现 list/详情/章节/搜索）。
- 配置：在 `app.js` 的 `wx.cloud.init` 中填入你的云环境 ID；在 `utils/api.js` 将 `USE_CLOUD` 设为 `true`。
- 调用：前端保持原页面代码不变，API 层会走 `wx.cloud.callFunction`。
- 部署：在微信开发者工具“云开发”面板上传并部署 `content` 函数。

#### 使用云数据库
- 集合建议：
	- `novels`: { _id, title, author, desc, cover, tags?, status?, createdAt }
	- `chapters`: { _id, id, novelId, title, content, order }
	- `news`: { _id, title, summary, content, date }
- 索引：
	- `chapters`：novelId + order 复合索引（便于按顺序读取）；novelId + id 唯一。
	- `news`：date 索引，便于按时间排序（可在接口中加 orderBy）。
- 导入数据：可在云开发控制台导入 `mock/novels.js`、`mock/news.js` 转为 JSON；章节单独导入到 `chapters` 集合（每个章节一条）。

### 待办与测试
- 将 `utils/api.js` 换成真实接口后，联调列表/详情/搜索、分页与错误态。
- 根据后端接口返回字段调整页面展示（封面、标签等）。
