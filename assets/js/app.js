const store = {
    agencies: [], talents: [], music: [],
    favorites: {
        talents: JSON.parse(localStorage.getItem('vwiki_fav_talents')) || [],
        music: JSON.parse(localStorage.getItem('vwiki_fav_music')) || []
    }
};

let currentRoute = { page: 'home', param: null };

document.addEventListener('DOMContentLoaded', async () => {
    updateUITexts();
    
    document.getElementById('lang-toggle-btn').addEventListener('click', toggleLanguage);
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('main-nav').classList.toggle('show');
    });
    
    // Bind nav buttons and logo
    document.querySelectorAll('.nav-btn, .logo').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            if(target) navigateTo(target);
            document.getElementById('main-nav').classList.remove('show');
        });
    });

    document.addEventListener('languageChanged', () => {
        navigateTo(currentRoute.page, currentRoute.param, false);
    });

    try {
        const [agRes, talRes, musRes] = await Promise.all([
            fetch('./data/agencies.json'), fetch('./data/talents.json'), fetch('./data/music.json')
        ]);
        store.agencies = await agRes.json();
        store.talents = await talRes.json();
        store.music = await musRes.json();
        navigateTo('home');
    } catch (error) {
        document.getElementById('content').innerHTML = 
            `<div class="container" style="padding-top: 50px; text-align:center; color:red;">
                <h2>Failed to load data / 資料載入失敗</h2>
                <p>請確保使用 HTTP Server 運行專案 (CORS restriction)。</p>
            </div>`;
    }
});

function navigateTo(page, param = null, updateActive = true) {
    currentRoute = { page, param };
    const content = document.getElementById('content');
    content.innerHTML = '';
    content.classList.remove('fade-in');
    void content.offsetWidth; // trigger reflow
    content.classList.add('fade-in');
    
    if (updateActive) {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.nav-btn[data-target="${page}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch(page) {
        case 'home': renderHome(content); break;
        case 'agencies': renderAgencies(content); break;
        case 'talents': renderTalents(content); break;
        case 'profile': renderProfile(content, param); break;
        case 'music': renderMusic(content); break;
        case 'favorites': renderFavorites(content); break;
        default: renderHome(content);
    }
}

// ---- Render: Home ----
function renderHome(container) {
    const featuredTalents = store.talents.slice(0, 4);
    const recentMusic = store.music.slice(0, 4);

    container.innerHTML = `
        <div class="hero-section">
            <div class="container">
                <h1 class="hero-title">${t('home_title')}</h1>
                <p class="hero-subtitle">${t('home_desc')}</p>
                <div class="main-search-container">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="homeSearch" class="search-input" placeholder="${t('home_search_placeholder')}">
                </div>
            </div>
        </div>
        <div class="container">
            <h2 class="section-title">${t('section_agencies')}</h2>
            <div class="grid grid-3" style="margin-bottom: 48px;">
                ${store.agencies.map(a => createAgencyCard(a)).join('')}
            </div>
            
            <h2 class="section-title">${t('section_featured')}</h2>
            <div class="grid grid-4" style="margin-bottom: 48px;">
                ${featuredTalents.map(t => createTalentCard(t)).join('')}
            </div>
            
            <h2 class="section-title">${t('section_recent_music')}</h2>
            <div class="grid grid-3" style="margin-bottom: 48px;">
                ${recentMusic.map(m => createMusicCard(m)).join('')}
            </div>
        </div>
    `;

    document.getElementById('homeSearch').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            // Simple redirect to talents search for now
            // In a real app, this could be a global search page
            navigateTo('talents');
            setTimeout(() => {
                const searchInp = document.getElementById('searchInput');
                if(searchInp) { searchInp.value = e.target.value; searchInp.dispatchEvent(new Event('input')); }
            }, 100);
        }
    });
    bindFavButtons();
    bindCardClicks();
}

// ---- Render: Talents List ----
function renderTalents(container, filterFavs = false) {
    let title = filterFavs ? t('nav_favorites') : t('nav_talents');
    
    let html = `<div class="container page-header">
        <h1 class="section-title">${title}</h1>
    `;
    
    if (!filterFavs) {
        html += `
        <div class="filter-bar">
            <div class="filter-control">
                <label>${t('search_placeholder')}</label>
                <input type="text" id="searchInput" placeholder="${t('search_placeholder')}">
            </div>
            <div class="filter-control">
                <label>${t('filter_agency')}</label>
                <select id="agencyFilter">
                    <option value="all">${t('filter_all')}</option>
                    ${store.agencies.map(a => `<option value="${a.id}">${currentLang==='zh'?a.name_zh:a.name_jp}</option>`).join('')}
                </select>
            </div>
            <div class="filter-control">
                <label>${t('filter_status')}</label>
                <select id="statusFilter">
                    <option value="all">${t('filter_all')}</option>
                    <option value="active">${t('status_active')}</option>
                    <option value="graduated">${t('status_graduated')}</option>
                </select>
            </div>
        </div>`;
    }
    
    html += `<div class="grid grid-4" id="talentsGrid"></div></div>`;
    container.innerHTML = html;

    const grid = document.getElementById('talentsGrid');
    
    const updateGrid = () => {
        let list = store.talents;
        if (filterFavs) {
            list = list.filter(t => store.favorites.talents.includes(t.id));
        } else {
            const search = document.getElementById('searchInput').value.toLowerCase();
            const agency = document.getElementById('agencyFilter').value;
            const status = document.getElementById('statusFilter').value;
            
            list = list.filter(t => {
                const matchSearch = t.name_zh.toLowerCase().includes(search) || t.name_jp.toLowerCase().includes(search);
                const matchAgency = agency === 'all' || t.agency_id === agency;
                const matchStatus = status === 'all' || t.status === status;
                return matchSearch && matchAgency && matchStatus;
            });
        }
        
        if (list.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">✧</div><p>${filterFavs ? t('empty_favs') : 'No results found.'}</p>
            </div>`;
        } else {
            grid.innerHTML = list.map(tal => createTalentCard(tal)).join('');
            bindFavButtons();
            bindCardClicks();
        }
    };

    updateGrid();

    if (!filterFavs) {
        document.getElementById('searchInput').addEventListener('input', updateGrid);
        document.getElementById('agencyFilter').addEventListener('change', updateGrid);
        document.getElementById('statusFilter').addEventListener('change', updateGrid);
    }
}

// ---- Render: Profile Page ----
function renderProfile(container, talentId) {
    const talent = store.talents.find(t => t.id === talentId);
    if (!talent) return navigateTo('talents');

    const name = currentLang === 'zh' ? talent.name_zh : talent.name_jp;
    const desc = currentLang === 'zh' ? talent.desc_zh : talent.desc_jp;
    const agencyName = getAgencyName(talent.agency_id);
    const isFav = store.favorites.talents.includes(talent.id);
    const talentMusic = store.music.filter(m => m.ref_talent_id === talent.id);

    container.innerHTML = `
        <div class="container">
            <div class="profile-layout">
                <!-- Left: Visual -->
                <div class="profile-visual">
                    <button class="fav-btn ${isFav ? 'active' : ''}" data-type="talents" data-id="${talent.id}" style="top: 20px; right: 20px;">
                        ${isFav ? '♥' : '♡'}
                    </button>
                    <img src="${talent.image_portrait || './assets/images/fallback.svg'}" alt="${name}" onerror="this.src='./assets/images/fallback.svg'">
                </div>
                
                <!-- Right: Details -->
                <div class="profile-details">
                    <div class="profile-header">
                        <div class="profile-title">
                            <h1>${name}</h1>
                            <h2>${currentLang === 'zh' ? talent.name_jp : talent.name_zh}</h2>
                            <div class="profile-badges">
                                <span class="tag tag-agency-${talent.agency_id}">${agencyName} ${talent.branch ? `• ${talent.branch}` : ''}</span>
                                <span class="tag tag-status-${talent.status}">${t('status_'+talent.status)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tabs">
                        <button class="tab-btn active" data-target="tab-profile">${t('tab_profile')}</button>
                        <button class="tab-btn" data-target="tab-music">${t('tab_music')} (${talentMusic.length})</button>
                        <button class="tab-btn" data-target="tab-links">${t('tab_links')}</button>
                    </div>
                    
                    <div id="tab-profile" class="tab-content active">
                        <p class="profile-desc">${desc}</p>
                        <div class="info-list">
                            ${talent.birthday ? `<div class="info-label">${t('profile_birthday')}</div><div class="info-value">${talent.birthday}</div>` : ''}
                            ${talent.height ? `<div class="info-label">${t('profile_height')}</div><div class="info-value">${talent.height}</div>` : ''}
                            ${talent.debut_date ? `<div class="info-label">${t('profile_debut')}</div><div class="info-value">${talent.debut_date}</div>` : ''}
                        </div>
                    </div>
                    
                    <div id="tab-music" class="tab-content">
                        <div class="grid grid-2">
                            ${talentMusic.length > 0 ? talentMusic.map(m => createMusicCard(m)).join('') : '<p style="color:var(--text-secondary);">No music found.</p>'}
                        </div>
                    </div>
                    
                    <div id="tab-links" class="tab-content">
                        <div class="social-links">
                            ${talent.url ? `<a href="${talent.url}" target="_blank" class="social-btn">${t('btn_official')} ↗</a>` : ''}
                            ${talent.youtube_channel ? `<a href="${talent.youtube_channel}" target="_blank" class="social-btn">${t('btn_youtube')} ↗</a>` : ''}
                            ${talent.x_twitter ? `<a href="${talent.x_twitter}" target="_blank" class="social-btn">${t('btn_twitter')} ↗</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Tab switching logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            document.getElementById(e.target.getAttribute('data-target')).classList.add('active');
        });
    });
    
    bindFavButtons();
}

// ---- Render: Music ----
function renderMusic(container, filterFavs = false) {
    let title = filterFavs ? t('nav_favorites') + ' - Music' : t('nav_music');
    let html = `<div class="container page-header"><h1 class="section-title">${title}</h1>`;
    html += `<div class="grid grid-3" id="musicGrid" style="margin-top: 24px;"></div></div>`;
    container.innerHTML = html;

    const grid = document.getElementById('musicGrid');
    let list = store.music;
    if(filterFavs) list = list.filter(m => store.favorites.music.includes(m.id));

    if (list.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">
            <div class="empty-icon">♪</div><p>${t('empty_favs')}</p>
        </div>`;
    } else {
        grid.innerHTML = list.map(m => createMusicCard(m)).join('');
        bindFavButtons();
    }
}

// ---- Render: Favorites ----
function renderFavorites(container) {
    // Just reusing the talent render for now, or building a combined view.
    renderTalents(container, true);
    // Can optionally append a section for Music favorites here
}

// ---- Render: Agencies ----
function renderAgencies(container) {
    container.innerHTML = `<div class="container page-header">
        <h1 class="section-title">${t('nav_agencies')}</h1>
        <div class="grid grid-2">${store.agencies.map(a => createAgencyCard(a)).join('')}</div>
    </div>`;
}

// ---- Components ----
function createTalentCard(talent) {
    const name = currentLang === 'zh' ? talent.name_zh : talent.name_jp;
    const isFav = store.favorites.talents.includes(talent.id);
    const imgUrl = talent.image_portrait || './assets/images/fallback.svg';
    
    return `
        <div class="talent-card" data-id="${talent.id}">
            <button class="fav-btn ${isFav ? 'active' : ''}" data-type="talents" data-id="${talent.id}" onclick="event.stopPropagation(); toggleFav('talents', '${talent.id}', this)">
                ${isFav ? '♥' : '♡'}
            </button>
            <div class="talent-image-wrapper">
                <img src="${imgUrl}" alt="${name}" class="talent-portrait" loading="lazy" onerror="this.src='./assets/images/fallback.svg'">
            </div>
            <div class="talent-info">
                <div class="talent-meta" style="margin-bottom:8px;">
                    <span class="tag tag-agency-${talent.agency_id}">${getAgencyName(talent.agency_id)}</span>
                    <span class="tag tag-status-${talent.status}" style="font-size:0.65rem;">${t('status_'+talent.status)}</span>
                </div>
                <div class="talent-name-jp">${talent.name_jp}</div>
                <div class="talent-name-zh">${talent.name_zh}</div>
            </div>
        </div>
    `;
}

function createMusicCard(music) {
    const isFav = store.favorites.music.includes(music.id);
    const thumbUrl = music.thumbnail_url || `https://img.youtube.com/vi/${extractYTId(music.youtube_url)}/maxresdefault.jpg`;
    
    return `
        <div class="music-card" onclick="window.open('${music.youtube_url}', '_blank')">
            <button class="fav-btn ${isFav ? 'active' : ''}" data-type="music" data-id="${music.id}" onclick="event.stopPropagation(); toggleFav('music', '${music.id}', this)">
                ${isFav ? '♥' : '♡'}
            </button>
            <img src="${thumbUrl}" alt="${music.title}" class="music-thumb" loading="lazy">
            <div class="music-info">
                <div class="music-title">${music.title}</div>
                <div class="music-artist">${music.artist}</div>
                <div class="music-type">${music.type === 'original' ? t('music_type_original') : t('music_type_cover')}</div>
            </div>
        </div>
    `;
}

function createAgencyCard(agency) {
    const name = currentLang === 'zh' ? agency.name_zh : agency.name_jp;
    const desc = currentLang === 'zh' ? agency.desc_zh : agency.desc_jp;
    const count = store.talents.filter(t => t.agency_id === agency.id).length;
    return `
        <div class="talent-card" style="aspect-ratio: auto; padding: 24px; cursor: default;">
            <h3 style="font-size: 1.5rem; margin-bottom: 8px;">${name}</h3>
            <p style="color:var(--text-secondary); margin-bottom: 16px;">${count} Talents</p>
            <p style="margin-bottom: 24px; font-size: 0.95rem;">${desc}</p>
            <a href="${agency.url}" target="_blank" class="social-btn" style="align-self: flex-start;">${t('btn_official')} ↗</a>
        </div>
    `;
}

// ---- Helpers ----
function getAgencyName(id) {
    const ag = store.agencies.find(a => a.id === id);
    return ag ? (currentLang === 'zh' ? ag.name_zh : ag.name_jp) : id;
}

function bindCardClicks() {
    document.querySelectorAll('.talent-card[data-id]').forEach(card => {
        card.addEventListener('click', () => {
            navigateTo('profile', card.getAttribute('data-id'));
        });
    });
}

function bindFavButtons() {
    // Buttons rendered outside the main list loop
    document.querySelectorAll('.fav-btn:not([onclick])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFav(e.currentTarget.getAttribute('data-type'), e.currentTarget.getAttribute('data-id'), e.currentTarget);
        });
    });
}

window.toggleFav = function(type, id, btn) {
    const list = store.favorites[type];
    const idx = list.indexOf(id);
    if (idx > -1) {
        list.splice(idx, 1);
        btn.classList.remove('active');
        btn.textContent = '♡';
    } else {
        list.push(id);
        btn.classList.add('active');
        btn.textContent = '♥';
    }
    localStorage.setItem(`vwiki_fav_${type}`, JSON.stringify(list));
    
    // Auto refresh if on favorites page
    if(currentRoute.page === 'favorites') {
        navigateTo('favorites', null, false);
    }
}

function extractYTId(url) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : '';
}
