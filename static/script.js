document.addEventListener('DOMContentLoaded', () => {
    const searchTab = document.getElementById('search-tab');
    const dlTab = document.getElementById('dl-tab');
    const searchForm = document.getElementById('search-form');
    const dlForm = document.getElementById('dl-form');
    const resultsArea = document.getElementById('results-area'); // Define resultsArea globally for tabs to access if needed

    // Tab Switching
    const liveTab = document.getElementById('live-tab');
    const liveControls = document.getElementById('live-controls');
    const liveSection = document.getElementById('live-section');
    const liveVideo = document.getElementById('live-video');

    // Tab Switching Helper
    function switchTab(activeTab) {
        [searchTab, dlTab, liveTab].forEach(t => t.classList.remove('active'));
        activeTab.classList.add('active');

        // Hide all sections
        searchForm.style.display = 'none';
        dlForm.style.display = 'none';
        liveControls.style.display = 'none';
        resultsArea.style.display = 'none';
        liveSection.style.display = 'none';

        // Pause Live Video if leaving tab
        if (activeTab !== liveTab && !liveVideo.paused) {
            liveVideo.pause();
        }
    }

    searchTab.addEventListener('click', () => {
        switchTab(searchTab);
        searchForm.style.display = 'flex';
        resultsArea.style.display = 'grid';
    });

    dlTab.addEventListener('click', () => {
        switchTab(dlTab);
        dlForm.style.display = 'flex';
        resultsArea.style.display = 'grid';
    });

    liveTab.addEventListener('click', () => {
        switchTab(liveTab);
        liveControls.style.display = 'flex';
        liveSection.style.display = 'flex';
        if (!tamilChannelsLoaded) {
            loadTamilChannels();
        }
    });

    // Search Functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        searchBtn.disabled = true;
        searchBtn.innerHTML = '<div class="loader-btn"></div>';

        try {
            const response = await fetch(`/search/?q=${encodeURIComponent(query)}&limit=10`);
            const data = await response.json();

            resultsArea.innerHTML = '';

            if (data.tracks && data.tracks.length > 0) {
                data.tracks.forEach((track, index) => {
                    const card = document.createElement('div');
                    card.className = 'song-card';
                    card.style.animationDelay = `${index * 0.1}s`;

                    card.innerHTML = `
                        <img src="${track.image}" alt="${track.name}">
                        <h3>${track.name}</h3>
                        <p>${track.artists}</p>
                        <div class="btn-group">
                            <button class="play-btn" onclick="playSong('${track.spotify_url}', this)">
                                <i class="fas fa-play"></i>
                                <div class="loader"></div>
                            </button>
                            <button class="download-btn" onclick="downloadSong('${track.spotify_url}', this)">
                                <i class="fas fa-download"></i>
                                <div class="loader"></div>
                            </button>
                        </div>
                    `;
                    resultsArea.appendChild(card);
                });
            } else {
                resultsArea.innerHTML = '<p style="text-align: center; color: var(--text-secondary); width: 100%;">No results found.</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            resultsArea.innerHTML = '<p style="text-align: center; color: #ff5555; width: 100%;">An error occurred while searching.</p>';
        } finally {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        }
    });

    // Allow Enter key for search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });

    // Direct Download Functionality
    const dlInput = document.getElementById('dl-input');
    const dlBtn = document.getElementById('dl-btn');

    dlBtn.addEventListener('click', () => {
        const url = dlInput.value.trim();
        if (!url) return;
        downloadSong(url, dlBtn);
    });
});


// State
let currentUrl = null;
const audioCache = new Map(); // Store fetched download URLs: spotifyUrl -> { mp3Url, expiry }
let currentBtn = null;

// Player DOM
const player = document.getElementById('audio-player');
const globalAudio = document.getElementById('global-audio');
const playBtn = document.getElementById('player-play');
const prevBtn = document.getElementById('player-prev');
const nextBtn = document.getElementById('player-next');
const progressBar = document.getElementById('progress-bar');
const currTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerImg = document.getElementById('player-img');

// Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';

    toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    // Remove after 3s
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s forwards';
        toast.addEventListener('animationend', () => {
            if (toast.parentElement) container.removeChild(toast);
        });
    }, 3000);
}

// Global Audio Events
if (globalAudio) {
    globalAudio.addEventListener('timeupdate', updateProgress);
    globalAudio.addEventListener('loadedmetadata', () => {
        if (globalAudio.duration) {
            durationEl.innerText = formatTime(globalAudio.duration);
            progressBar.max = globalAudio.duration;
        }
    });
    globalAudio.addEventListener('ended', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (currentBtn) {
            const icon = currentBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-play';
            currentBtn.classList.remove('playing');
        }
    });
    globalAudio.addEventListener('error', (e) => {
        console.error("Audio Error", e);
        showToast("Error playing audio stream", 'error');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
}

// Player Controls
if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (!globalAudio.src) return;

        if (globalAudio.paused) {
            globalAudio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            if (currentBtn) {
                currentBtn.querySelector('i').className = 'fas fa-pause';
                currentBtn.classList.add('playing');
            }
        } else {
            globalAudio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            if (currentBtn) {
                currentBtn.querySelector('i').className = 'fas fa-play';
                currentBtn.classList.remove('playing');
            }
        }
    });
}

if (progressBar) {
    progressBar.addEventListener('input', () => {
        globalAudio.currentTime = progressBar.value;
    });
}

async function downloadSong(url, btnElement) {
    if (btnElement.classList.contains('loading')) return;
    const icon = btnElement.querySelector('i');
    if (icon) icon.style.display = 'none';

    btnElement.classList.add('loading');

    try {
        const mp3Url = await getDownloadUrl(url);

        // Create temporary link to trigger download
        const link = document.createElement('a');
        link.href = mp3Url;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Download started!", 'success');
    } catch (error) {
        console.error('Download Error:', error);
        showToast(error.message || "Download failed", 'error');
    } finally {
        btnElement.classList.remove('loading');
        if (icon) icon.style.display = 'block';
    }
}

async function playSong(url, btnElement) {
    // 1. Check if same song
    if (currentUrl === url) {
        // Toggle play/pause
        if (globalAudio.paused) {
            globalAudio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            btnElement.classList.add('playing');
            btnElement.querySelector('i').className = 'fas fa-pause';
        } else {
            globalAudio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            btnElement.classList.remove('playing');
            btnElement.querySelector('i').className = 'fas fa-play';
        }
        return;
    }

    // 2. New Song
    // Reset previous button if exists
    if (currentBtn && currentBtn !== btnElement) {
        currentBtn.classList.remove('playing');
        currentBtn.classList.remove('loading');
        const prevIcon = currentBtn.querySelector('i');
        if (prevIcon) prevIcon.className = 'fas fa-play';
    }

    if (btnElement.classList.contains('loading')) return;

    const icon = btnElement.querySelector('i');
    // Temporary loading state on the card button
    if (icon) icon.className = 'fas fa-spinner fa-spin';
    btnElement.classList.add('loading');

    // Set global current button ref
    currentBtn = btnElement;

    try {
        const mp3Url = await getDownloadUrl(url);

        // Update Metadata
        const checkCard = btnElement.closest('.song-card');
        if (checkCard) {
            playerTitle.innerText = checkCard.querySelector('h3').innerText;
            playerArtist.innerText = checkCard.querySelector('p').innerText;
            playerImg.src = checkCard.querySelector('img').src;
        }

        // Setup Audio
        currentUrl = url;
        globalAudio.src = mp3Url;
        player.classList.remove('hidden');

        // Reset player UI
        playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        // Play
        await globalAudio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';

        // Update Card Button
        if (icon) icon.className = 'fas fa-pause';
        btnElement.classList.add('playing');

    } catch (error) {
        console.error('Play Error:', error);
        showToast("Failed to play song. Try again.", 'error');
        // Reset state
        currentUrl = null;
        if (icon) icon.className = 'fas fa-play';
    } finally {
        btnElement.classList.remove('loading');
    }
}

// Helper to cache and fetch URL
async function getDownloadUrl(spotifyUrl) {
    // Check Cache
    if (audioCache.has(spotifyUrl)) {
        console.log("Serving from cache");
        return audioCache.get(spotifyUrl);
    }

    // Fetch
    const response = await fetch(`/download/?url=${encodeURIComponent(spotifyUrl)}`);
    if (!response.ok) {
        // Try to get JSON error
        try {
            const err = await response.json();
            throw new Error(err.detail || 'Request failed');
        } catch (e) {
            throw new Error('Network error or server failed');
        }
    }
    const data = await response.json();
    if (!data.download_url) throw new Error('No audio music link found');

    // Store in cache
    audioCache.set(spotifyUrl, data.download_url);
    return data.download_url;
}

function updateProgress() {
    if (globalAudio.duration) {
        progressBar.value = globalAudio.currentTime;
        currTimeEl.innerText = formatTime(globalAudio.currentTime);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// --- Live TV Stream Logic ---
let tamilChannelsLoaded = false;
let allChannels = [];
const TAMIL_PLAYLIST_URL = "https://iptv-org.github.io/iptv/languages/tam.m3u";
let hls = null;

async function loadTamilChannels() {
    const listContainer = document.getElementById('channel-list');
    listContainer.innerHTML = '<p style="text-align:center; color: var(--text-secondary);">Loading channels...</p>';

    try {
        const response = await fetch(TAMIL_PLAYLIST_URL);
        if (!response.ok) throw new Error("Failed to fetch playlist");
        const text = await response.text();
        allChannels = parseM3U(text);

        renderChannels(allChannels);
        tamilChannelsLoaded = true;
    } catch (error) {
        console.error("Live TV Error:", error);
        listContainer.innerHTML = '<p style="text-align:center; color: #ff5555;">Failed to load channels.</p>';
        showToast("Failed to load Live TV channels", 'error');
    }
}

function parseM3U(content) {
    const lines = content.split('\n');
    const channels = [];
    let currentChannel = {};

    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            // #EXTINF:-1 tvg-logo="http://..." group-title="...",Channel Name
            const info = line.substring(8);
            const commaIndex = info.lastIndexOf(',');

            // Extract Name
            if (commaIndex !== -1) {
                currentChannel.name = info.substring(commaIndex + 1).trim();
            } else {
                currentChannel.name = "Unknown Channel";
            }

            // Extract Logo
            const logoMatch = info.match(/tvg-logo="([^"]*)"/);
            currentChannel.logo = logoMatch ? logoMatch[1] : '';

        } else if (line.startsWith('http')) {
            currentChannel.url = line;
            if (currentChannel.name) {
                channels.push({ ...currentChannel });
            }
            currentChannel = {}; // Reset
        }
    }
    return channels;
}

function renderChannels(channels) {
    const listContainer = document.getElementById('channel-list');
    listContainer.innerHTML = '';

    if (channels.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center;">No channels found.</p>';
        return;
    }

    channels.forEach(channel => {
        const card = document.createElement('div');
        card.className = 'channel-card';
        // Fallback logo if empty or invalid
        const logoSrc = channel.logo || 'https://via.placeholder.com/60?text=TV';

        card.innerHTML = `
            <img src="${logoSrc}" alt="${channel.name}" onerror="this.src='https://via.placeholder.com/60?text=TV'">
            <h4>${channel.name}</h4>
        `;

        card.addEventListener('click', () => {
            // Highlight active
            document.querySelectorAll('.channel-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            playChannel(channel);
        });

        listContainer.appendChild(card);
    });
}

function playChannel(channel) {
    const video = document.getElementById('live-video');
    const info = document.getElementById('current-channel-info');

    info.innerText = `Playing: ${channel.name}`;

    if (Hls.isSupported()) {
        if (hls) {
            hls.destroy();
        }
        hls = new Hls();
        hls.loadSource(channel.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(e => console.log("Auto-play prevented", e));
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log("fatal network error encountered, try to recover");
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log("fatal media error encountered, try to recover");
                        hls.recoverMediaError();
                        break;
                    default:
                        hls.destroy();
                        break;
                }
            }
        });
    }
    // Safari / Native HLS support
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = channel.url;
        video.addEventListener('loadedmetadata', function () {
            video.play();
        });
    } else {
        showToast("Your browser does not support HLS playback", 'error');
    }
}

// Channel Search Filter
const channelSearch = document.getElementById('channel-search');
if (channelSearch) {
    channelSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allChannels.filter(ch => ch.name.toLowerCase().includes(term));
        renderChannels(filtered);
    });
}
