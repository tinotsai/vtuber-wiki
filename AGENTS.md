# V-Wiki 專案 AI 開發指南 (AGENTS.md) - Redesign V2
## 1. 專案視覺與技術規範
- 已經全面採用 Pink Theme (VTuber Character Database × Japanese Minimalist UI)。
- 必須保留所有的 CSS variables 與 Flex/Grid 卡片結構。不允許新增 Bootstrap 等框架。
## 2. 圖片與官方資源規範
- JSON 已新增 `image_portrait`, `birthday`, `height`, `youtube_channel`, `x_twitter` 等欄位。
- 嚴格遵守圖片來源官方化。如無圖片，程式碼將自動 fallback 到 `./assets/images/fallback.svg`。
## 3. UI/UX 與 RWD
- `app.js` 加入了 `navigateTo(page, param)` 路由機制支援獨立 Profile 頁面。
- Hover 時卡片輕微上浮與陰影加深，需維持這些微互動的流暢性。
