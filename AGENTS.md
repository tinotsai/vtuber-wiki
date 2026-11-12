# V-Wiki 專案開發與 AI 協作指南 (AGENTS.md)

本文件定義了 **V-Wiki** 專案的架構規範、程式碼風格與 AI 協作原則，旨在確保所有開發與維護過程符合高品質的 UI/UX 與可維護性標準。

---

## 1. 專案概述 (Project Overview)
- **專案名稱**：V-Wiki (VTuber 知識百科與音樂資料庫)
- **專案目標**：建立一個專為虛擬偶像（VTuber）粉絲打造的現代化日系粉色風格知識百科單頁應用程式（SPA）。
- **收錄對象**：精選 **hololive production** 與 **VSPO!** 兩大知名事務所核心成員，每位成員皆配備完整個人資料、官方 PNG 立繪與 3 首專屬原創/翻唱音樂作品。

---

## 2. 專案目錄結構 (Project Structure)
```text
V-Wiki-Redesign/
├── index.html              # 單頁應用程式主入口 (SPA)
├── assets/
│   ├── css/
│   │   └── style.css       # 日系輕奢粉色主題樣式、響應式 RWD 佈局
│   └── js/
│       ├── app.js          # 核心路由、資料渲染、搜尋與收藏邏輯
│       └── i18n.js         # 中日雙語切換邏輯 (Traditional Chinese / Japanese)
├── data/
│   ├── agencies.json       # 事務所資料庫
│   ├── talents.json        # 成員詳細設定（含本地 PNG 立繪路徑）
│   └── music.json          # 每位成員 3 首專屬音樂與 YouTube 連結
├── AGENTS.md               # 專案 AI 協作與開發規範
├── CLAUDE.md               # Claude Code 專屬執行與指令集規範
└── README.md               # 專案詳細介紹與快速上手指南
