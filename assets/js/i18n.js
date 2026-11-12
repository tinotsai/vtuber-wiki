const translations = {
    zh: {
        site_title: "V-Wiki | VTuber 知識百科",
        nav_home: "首頁", nav_agencies: "事務所", nav_talents: "成員列表",
        nav_music: "探索音樂", nav_favorites: "我的收藏",
        loading: "載入中 / Loading...", btn_lang: "日本語",
        home_title: "探索 VTuber 的無限宇宙",
        home_desc: "完整收錄 VTuber 角色設定、音樂作品與官方資訊的知識百科平台。",
        home_search_placeholder: "搜尋成員、團體或音樂...",
        section_agencies: "主要事務所", section_featured: "精選成員", section_recent_music: "推薦音樂",
        search_placeholder: "輸入名稱搜尋...", filter_agency: "選擇事務所", filter_status: "狀態",
        filter_all: "全部", status_active: "現役", status_graduated: "畢業", status_unknown: "不明",
        btn_official: "官方頁面", btn_youtube: "YouTube", btn_twitter: "X / Twitter",
        tab_profile: "基本資料", tab_music: "音樂作品", tab_videos: "相關影片", tab_links: "官方連結",
        profile_desc: "簡介", profile_birthday: "生日", profile_height: "身高", profile_debut: "出道日期",
        music_type_original: "原創曲", music_type_cover: "翻唱曲",
        empty_favs: "還沒有收藏任何內容。點擊愛心圖示將喜歡的 VTuber 或歌曲加入收藏！",
        footer_text: "© 2026 V-Wiki Project. 本站為非官方整理，資料與版權皆歸屬於各官方事務所。",
        footer_disclaimer: "※ 圖像資源皆來自官方公開資料，僅供展示與檢索使用。"
    },
    jp: {
        site_title: "V-Wiki | VTuber 百科事典",
        nav_home: "ホーム", nav_agencies: "事務所", nav_talents: "タレント一覧",
        nav_music: "音楽を探す", nav_favorites: "お気に入り",
        loading: "読み込み中 / Loading...", btn_lang: "繁體中文",
        home_title: "VTuberの無限の宇宙を探索",
        home_desc: "VTuberのプロフィール、音楽作品、公式情報を網羅したオープン百科事典プラットフォーム。",
        home_search_placeholder: "タレント、グループ、音楽を検索...",
        section_agencies: "主要事務所", section_featured: "注目のタレント", section_recent_music: "おすすめ音楽",
        search_placeholder: "名前で検索...", filter_agency: "事務所を選択", filter_status: "ステータス",
        filter_all: "すべて", status_active: "活動中", status_graduated: "卒業", status_unknown: "不明",
        btn_official: "公式ページ", btn_youtube: "YouTube", btn_twitter: "X / Twitter",
        tab_profile: "プロフィール", tab_music: "音楽作品", tab_videos: "関連動画", tab_links: "公式リンク",
        profile_desc: "紹介", profile_birthday: "誕生日", profile_height: "身長", profile_debut: "デビュー日",
        music_type_original: "オリジナル", music_type_cover: "歌ってみた",
        empty_favs: "お気に入りはまだありません。ハートアイコンをクリックして追加してください！",
        footer_text: "© 2026 V-Wiki Project. 当サイトは非公式であり、データ及び著作権は各公式事務所に帰属します。",
        footer_disclaimer: "※ 画像データは公式の公開資料に基づいており、展示・検索目的のみに使用しています。"
    }
};

let currentLang = 'zh';

function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'jp' : 'zh';
    document.documentElement.lang = currentLang === 'zh' ? 'zh-TW' : 'ja';
    updateUITexts();
    document.dispatchEvent(new Event('languageChanged'));
}

function updateUITexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
                el.placeholder = translations[currentLang][key];
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });
    const langBtn = document.getElementById('lang-toggle-btn');
    if(langBtn) langBtn.textContent = translations[currentLang].btn_lang;
}

function t(key) {
    return translations[currentLang][key] || key;
}
