document.addEventListener('DOMContentLoaded', () => {
    const searchTab = document.getElementById('search-tab');
    const dlTab = document.getElementById('dl-tab');
    const searchForm = document.getElementById('search-form');
    const dlForm = document.getElementById('dl-form');
    const resultsArea = document.getElementById('results-area'); // Define resultsArea globally for tabs to access if needed

    // Tab Switching
    searchTab.addEventListener('click', () => {
        searchTab.classList.add('active');
        dlTab.classList.remove('active');
        searchForm.style.display = 'flex';
        dlForm.style.display = 'none';
        resultsArea.innerHTML = ''; // Clear results
    });

    dlTab.addEventListener('click', () => {
        dlTab.classList.add('active');
        searchTab.classList.remove('active');
        dlForm.style.display = 'flex';
        searchForm.style.display = 'none';
        resultsArea.innerHTML = ''; // Clear results
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
                        <button class="download-btn" onclick="downloadSong('${track.spotify_url}', this)">
                            <span>Download MP3</span>
                            <div class="loader"></div>
                        </button>
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

async function downloadSong(url, btnElement) {
    if (btnElement.classList.contains('loading')) return;

    const originalText = btnElement.querySelector('span') ? btnElement.querySelector('span').innerText : 'Download';
    btnElement.classList.add('loading');
    
    try {
        const response = await fetch(`/download/?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
            const err = await response.json();
             throw new Error(err.detail || 'Download failed');
        }
        
        const data = await response.json();
        
        if (data.download_url) {
            // Create temporary link to trigger download
            const link = document.createElement('a');
            link.href = data.download_url;
            link.target = '_blank'; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Could not retrieve download link.');
        }
    } catch (error) {
        console.error('Download Error:', error);
        alert(`Failed: ${error.message}`);
    } finally {
        btnElement.classList.remove('loading');
    }
}
