// ===== STATE MANAGEMENT =====
let currentIndex = 0;
let isSpeaking = false;
let autoPlayInterval = null;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    initializePlanetSlider();
    updatePlanetDisplay(currentIndex, false);
    setupEventListeners();

    // Auto-play pertama kali
    setTimeout(() => {
        speakDescription();
    }, 1000);
});

// ===== PLANET SLIDER INITIALIZATION =====
function initializePlanetSlider() {
    const slider = document.getElementById('planet-slider');
    slider.innerHTML = '';

    tataSuryaData.forEach((planet, index) => {
        const button = createPlanetButton(planet, index);
        slider.appendChild(button);
    });
}

// ===== CREATE PLANET BUTTON =====
function createPlanetButton(planet, index) {
    const button = document.createElement('button');
    button.className = `planet-button group flex flex-col items-center gap-3 transition-transform focus:outline-none ${index === currentIndex ? 'active' : ''}`;
    button.setAttribute('data-index', index);
    button.setAttribute('aria-label', `Lihat ${planet.nama}`);

    // Determine size based on planet
    let sizeClass = 'w-12 h-12';
    if (planet.id === 'matahari') sizeClass = 'w-14 h-14';
    else if (planet.id === 'jupiter') sizeClass = 'w-16 h-16';
    else if (planet.id === 'saturnus') sizeClass = 'w-14 h-14';
    else if (planet.id === 'merkurius') sizeClass = 'w-9 h-9';

    // Create gradient string
    const gradient = `linear-gradient(135deg, ${planet.gradien[0]}, ${planet.gradien[1]}, ${planet.gradien[2]})`;

    button.innerHTML = `
        <div class="relative">
            ${index === currentIndex ? `
                <div class="absolute -inset-4 rounded-full blur-xl animate-pulse" style="background: ${planet.glowColor};"></div>
            ` : ''}
            <div class="planet-icon ${sizeClass} rounded-full opacity-60 group-hover:opacity-100 transition-all relative z-10 overflow-hidden" 
                 style="background: ${gradient}; box-shadow: 0 0 20px ${planet.glowColor}; --planet-color: ${planet.warna}; --planet-glow: ${planet.glowColor};">
            </div>
            ${index === currentIndex ? `
                <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
            ` : ''}
        </div>
        <span class="text-gray-400 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors ${index === currentIndex ? 'text-white' : ''}">${planet.nama}</span>
    `;

    button.addEventListener('click', () => {
        navigateToPlanet(index);
    });

    return button;
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('prev-btn').addEventListener('click', navigatePrevious);
    document.getElementById('next-btn').addEventListener('click', navigateNext);

    // Speak button
    document.getElementById('speak-btn').addEventListener('click', toggleSpeak);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Touch Swipe Navigation for Mobile
    setupTouchNavigation();
}

// ===== TOUCH NAVIGATION (SWIPE) =====
function setupTouchNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Jarak minimal geser agar dianggap swipe

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const distance = touchEndX - touchStartX;
        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                navigatePrevious(); // Geser kanan = Kembali
            } else {
                navigateNext(); // Geser kiri = Lanjut
            }
        }
    }
}

// ===== KEYBOARD NAVIGATION =====
function handleKeyboard(e) {
    if (e.key === 'ArrowLeft') {
        navigatePrevious();
    } else if (e.key === 'ArrowRight') {
        navigateNext();
    } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleSpeak();
    }
}

// ===== NAVIGATION FUNCTIONS =====
function navigatePrevious() {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : tataSuryaData.length - 1;
    navigateToPlanet(newIndex);
}

function navigateNext() {
    const newIndex = currentIndex < tataSuryaData.length - 1 ? currentIndex + 1 : 0;
    navigateToPlanet(newIndex);
}

function navigateToPlanet(index) {
    if (index === currentIndex) return;

    // Stop current speech
    stopSpeaking();

    // Update display
    const direction = index > currentIndex ? 'left' : 'right';
    updatePlanetDisplay(index, true, direction);

    currentIndex = index;

    // Update slider buttons
    updateSliderButtons();

    // Auto-speak after transition
    setTimeout(() => {
        speakDescription();
    }, 800);
}

// ===== UPDATE PLANET DISPLAY =====
function updatePlanetDisplay(index, animate = true, direction = 'left') {
    const planet = tataSuryaData[index];

    // Update UI elements
    const infoGlow = document.getElementById('info-glow');
    const mainWrapper = document.querySelector('main');

    // Apply animation class (Slide effect for UI)
    if (animate && mainWrapper) {
        mainWrapper.classList.add(direction === 'left' ? 'slide-left' : 'slide-right');
        setTimeout(() => {
            mainWrapper.classList.remove('slide-left', 'slide-right');
        }, 800);
    }

    // UPDATE 3D SCENE PLANET
    if (typeof window.update3DPlanet === 'function') {
        window.update3DPlanet(planet.id);
    }

    // Update glow colors (UI panel only)
    if (infoGlow) infoGlow.style.background = planet.glowColor;

    // Update atmosphere color (CSS) - Removed
    // const atmosphereColor = planet.warna;
    // planetAtmosphere.style.borderColor = `${atmosphereColor}30`;

    // Update info panel
    document.getElementById('planet-category').textContent = planet.kategori;
    document.getElementById('planet-category').style.background = `${planet.warna}20`;
    document.getElementById('planet-category').style.color = planet.warna;
    document.getElementById('planet-category').style.borderColor = `${planet.warna}20`;

    document.getElementById('planet-name').textContent = planet.nama;
    document.getElementById('planet-subtitle').textContent = planet.subtitle;
    document.getElementById('planet-subtitle').style.color = `${planet.warna}cc`;
    document.getElementById('planet-description').textContent = planet.deskripsi;
    document.getElementById('planet-rotation').textContent = planet.rotasi;
    document.getElementById('planet-temp').textContent = planet.suhu;

    // Update interesting facts
    const factsList = document.getElementById('planet-facts');
    if (factsList && planet.fakta) {
        factsList.innerHTML = '';
        planet.fakta.forEach(fakta => {
            const li = document.createElement('li');
            li.className = 'flex gap-2';
            li.innerHTML = `
                <span style="color: ${planet.warna}">•</span>
                <span>${fakta}</span>
            `;
            factsList.appendChild(li);
        });
    }

    // Update page title
    document.title = `Penjelajah Tata Surya - ${planet.nama}`;
}

// ===== UPDATE SLIDER BUTTONS =====
function updateSliderButtons() {
    const buttons = document.querySelectorAll('.planet-button');
    buttons.forEach((button, index) => {
        const planet = tataSuryaData[index];
        const isActive = index === currentIndex;

        if (isActive) {
            button.classList.add('active');
            button.innerHTML = `
                <div class="relative">
                    <div class="absolute -inset-4 rounded-full blur-xl animate-pulse" style="background: ${planet.glowColor};"></div>
                    <div class="planet-icon ${getPlanetSize(planet)} rounded-full transition-all relative z-10 overflow-hidden border-4" 
                         style="background: linear-gradient(135deg, ${planet.gradien[0]}, ${planet.gradien[1]}, ${planet.gradien[2]}); 
                                box-shadow: 0 0 30px ${planet.glowColor}; 
                                border-color: ${planet.warna};">
                    </div>
                    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                </div>
                <span class="text-white text-sm font-bold uppercase tracking-widest">${planet.nama}</span>
            `;
        } else {
            button.classList.remove('active');
            button.innerHTML = `
                <div class="relative">
                    <div class="planet-icon ${getPlanetSize(planet)} rounded-full opacity-60 group-hover:opacity-100 transition-all relative z-10 overflow-hidden" 
                         style="background: linear-gradient(135deg, ${planet.gradien[0]}, ${planet.gradien[1]}, ${planet.gradien[2]}); 
                                box-shadow: 0 0 20px ${planet.glowColor};">
                    </div>
                </div>
                <span class="text-gray-400 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors">${planet.nama}</span>
            `;
        }
    });

    // Scroll active button into view
    const activeButton = buttons[currentIndex];
    if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// ===== GET PLANET SIZE CLASS =====
function getPlanetSize(planet) {
    if (planet.id === 'matahari') return 'w-14 h-14';
    if (planet.id === 'jupiter') return 'w-16 h-16';
    if (planet.id === 'saturnus') return 'w-14 h-14';
    if (planet.id === 'merkurius') return 'w-9 h-9';
    return 'w-12 h-12';
}

// ===== TEXT TO SPEECH FUNCTIONS =====
function speakDescription() {
    if (isSpeaking) {
        stopSpeaking();
        return;
    }

    const planet = tataSuryaData[currentIndex];
    const text = `${planet.nama}. ${planet.subtitle}. ${planet.deskripsi}`;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    // Create utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'id-ID'; // Indonesian language
    currentUtterance.rate = 0.9; // Slightly slower for kids
    currentUtterance.pitch = 1.1; // Slightly higher pitch for friendliness

    // Event handlers
    currentUtterance.onstart = () => {
        isSpeaking = true;
        updateSpeakButton(true);
    };

    currentUtterance.onend = () => {
        isSpeaking = false;
        updateSpeakButton(false);
    };

    currentUtterance.onerror = () => {
        isSpeaking = false;
        updateSpeakButton(false);
        console.error('Speech synthesis error');
    };

    // Speak
    speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
    speechSynthesis.cancel();
    isSpeaking = false;
    updateSpeakButton(false);
}

function toggleSpeak() {
    if (isSpeaking) {
        stopSpeaking();
    } else {
        speakDescription();
    }
}

function updateSpeakButton(speaking) {
    const speakIcon = document.getElementById('speak-icon');
    const speakText = document.getElementById('speak-text');
    const speakBtn = document.getElementById('speak-btn');

    if (speaking) {
        speakIcon.textContent = 'stop';
        speakText.textContent = 'Berhenti';
        speakIcon.parentElement.classList.add('speaking');
    } else {
        speakIcon.textContent = 'volume_up';
        speakText.textContent = 'Dengarkan';
        speakIcon.parentElement.classList.remove('speaking');
    }
}

// ===== AUTO PLAY FUNCTIONS =====
function toggleAutoPlay() {
    if (autoPlayInterval) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    document.getElementById('autoplay-text').textContent = 'Hentikan Auto';

    autoPlayInterval = setInterval(() => {
        navigateNext();
    }, 15000); // Change planet every 15 seconds
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        document.getElementById('autoplay-text').textContent = 'Putar Otomatis';
    }
}

// ===== UTILITY FUNCTIONS =====
function resetToStart() {
    stopSpeaking();
    stopAutoPlay();
    navigateToPlanet(0);
}

function showMoreInfo() {
    const planet = tataSuryaData[currentIndex];
    alert(`Informasi Tambahan tentang ${planet.nama}:\n\nKategori: ${planet.kategori}\nRotasi: ${planet.rotasi}\nSuhu: ${planet.suhu}\n\n${planet.deskripsi}`);
}

// ===== FULLSCREEN FUNCTIONS =====
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Handle fullscreen change (e.g. from ESC key)
document.addEventListener('fullscreenchange', () => {
    const icon = document.getElementById('fullscreen-icon');
    const text = document.getElementById('fullscreen-text');

    if (document.fullscreenElement) {
        icon.textContent = 'fullscreen_exit';
        text.textContent = 'Keluar Penuh';
    } else {
        icon.textContent = 'fullscreen';
        text.textContent = 'Layar Penuh';
    }
});

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
    stopSpeaking();
    stopAutoPlay();
});
