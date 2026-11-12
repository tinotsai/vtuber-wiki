# ✧ V-Wiki | VTuber 知識百科與音樂資料庫

<p align="center">
  <b>結合 VTuber 角色百科、事務所檢視與精選音樂播放的現代日系網頁專案。</b>
</p>

---

## 📌 專案簡介 (About)
**V-Wiki** 是一項為 VTuber 粉絲與前端開發展示所設計的現代化知識百科平台。本專案採用日系簡約粉色系視覺風格（Pink Theme），支援響應式網頁設計（RWD）、即時搜尋過濾、多國語言切換（繁體中文 / 日語），以及完整的個人資料與音樂作品檢索功能。

---

## ✨ 核心功能特色 (Features)
1. **事務所與成員檢索**：
   * 收錄 Hololive production 與 VSPO! 兩大知名事務所。
   * 提供成員的詳細基本資料（生日、身高、出道日期、官方社群連結）。
2. **專屬音樂資料庫**：
   * 每位成員皆配有 3 首精選原創或翻唱歌曲，完美對應 YouTube 官方音源與縮圖。
3. **我的收藏 (Favorites)**：
   * 支援將喜歡的成員與音樂加入收藏，並透過 `localStorage` 進行持久化儲存。
4. **雙語介面支援 (i18n)**：
   * 支援繁體中文與日語（日本語）介面即時切換。
5. **高效且安全的素材呈現**：
   * 採用本地向量與去背圖示管理，確保在任何環境下皆能穩定顯示，不受外部防盜鏈（CORS）限制。

---

## 🛠️ 技術堆疊 (Tech Stack)
* **Markup & Style**: HTML5, CSS3 (Custom Properties, Flexbox / CSS Grid)
* **Scripting**: Vanilla JavaScript (ES6+, Async/Await, SPA Routing)
* **Data Storage**: JSON-based mock database (`agencies.json`, `talents.json`, `music.json`)

---

## 🚀 快速開始與本地執行 (Quick Start)
確保你的電腦已安裝 Python，然後在終端機執行以下指令：

```bash
# 1. 複製或下載本專案至本機
# 2. 進入專案資料夾
cd V-Wiki-Redesign

# 3. 啟動本地 HTTP 伺服器
python -m http.server 8000
