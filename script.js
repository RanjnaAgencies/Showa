// SHOWA Portal - Attendance System
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKGRBlMdgA5WAW0wO98aQsLEucjGkbllI1wtLg-nw-TMA7jwW1gn88DpcdEPe9nzBCHw/exec';

const FORMS = {
    attendance: APPS_SCRIPT_URL + '?form=attendance',
    visit: APPS_SCRIPT_URL + '?form=visit',
    payment: APPS_SCRIPT_URL + '?form=payment',
    ecommerce: APPS_SCRIPT_URL + '?form=ecommerce',
    petrol: APPS_SCRIPT_URL + '?form=petrol'
};

const PERMISSIONS = {
    attendance: 'camera *; geolocation *; microphone *',
    visit: 'camera *; geolocation *; microphone *',
    payment: 'camera *; geolocation *; microphone *',
    ecommerce: 'camera *; geolocation *; microphone *',
    petrol: 'camera *; geolocation *; microphone *'
};

// SPLASH SCREEN - BULLETPROOF
var splashHidden = false;

function hideSplash() {
    if (splashHidden) return;
    splashHidden = true;
    try {
        var splash = document.getElementById('splash');
        var app = document.getElementById('app');
        if (splash) {
            splash.classList.add('hide');
            splash.style.opacity = '0';
            splash.style.pointerEvents = 'none';
        }
        if (app) {
            app.classList.add('show');
            app.style.opacity = '1';
            app.style.transform = 'scale(1)';
        }
        console.log('✅ App loaded');
    } catch (e) {
        console.error('Splash error:', e);
    }
}

// Multiple fallbacks
window.addEventListener('load', function() { setTimeout(hideSplash, 2000); });
document.addEventListener('DOMContentLoaded', function() { setTimeout(hideSplash, 2500); });
setTimeout(hideSplash, 4000); // Force hide after 4 seconds

// CLOCK
function updateClock() {
    try {
        var now = new Date();
        var options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        var timeStr = now.toLocaleString('en-US', options);
        var mainClock = document.getElementById('mainClock');
        var mClock = document.getElementById('mClock');
        if (mainClock) mainClock.textContent = timeStr;
        if (mClock) mClock.textContent = timeStr;
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 1000);
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.onclick = function(e) {
            e.preventDefault();
            var page = this.getAttribute('data-page');
            if (page) navigateTo(page);
        };
    });
});

// NAVIGATION
function navigateTo(page) {
    document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    var al = document.querySelector('[data-page="' + page + '"]');
    if (al) al.classList.add('active');
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var ap = document.getElementById(page);
    if (ap) ap.classList.add('active');
    window.scrollTo(0, 0);
}

function switchPage(page) {
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    var ab = document.querySelector('[data-page="' + page + '"]');
    if (ab) ab.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    var al = document.querySelector('.nav-link[data-page="' + page + '"]');
    if (al) al.classList.add('active');
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var ap = document.getElementById(page);
    if (ap) ap.classList.add('active');
    window.scrollTo(0, 0);
}

// TABS
function switchTab(tabId, btn) {
    btn.parentElement.querySelectorAll('.tab-pill').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    btn.closest('.page').querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById(tabId).classList.add('active');
}

// MODAL
function deriveEmployeeName(type, rawTitle) {
    var name = (rawTitle || '').toString().trim();
    if (!name) return '';

    name = name
        .replace(/\s*-\s*(Shipped|Return)\s*$/i, '')
        .replace(/\s+(Online|Cash)\s*$/i, '')
        .trim();

    return name;
}

function openForm(type, title) {
    var modal = document.getElementById('modal');
    var modalTitle = document.getElementById('modalTitle');
    var loader = document.getElementById('formLoader');
    var frame = document.getElementById('formFrame');
    if (!modal || !loader || !frame) return;

    modalTitle.textContent = title;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    frame.src = '';
    frame.classList.remove('loaded');
    loader.classList.remove('hide');
    loader.innerHTML = '<div class="loader-anim"><div class="loader-circle"></div><div class="loader-circle"></div><div class="loader-circle"></div></div><p>Loading form...</p>';

    var link = FORMS[type];
    if (!link) {
        loader.innerHTML = '<div style="text-align:center;padding:2rem"><div style="font-size:5rem;margin-bottom:1rem">🚧</div><h3 style="font-size:1.5rem;font-weight:700;color:#fff">Coming Soon</h3></div>';
        return;
    }

    frame.setAttribute('allow', PERMISSIONS[type] || 'camera *; geolocation *; microphone *');
    frame.setAttribute('allowfullscreen', '');
    frame.onload = function() {
        setTimeout(function() {
            loader.classList.add('hide');
            frame.classList.add('loaded');
        }, 400);
    };

    // For attendance, visit, payment, ecommerce, and petrol forms (no employee parameter needed - they have internal dropdowns)
    if (type === 'attendance' || type === 'visit' || type === 'payment' || type === 'ecommerce' || type === 'petrol') {
        frame.src = link;
        var u = link;
    } else {
        // For other forms that need employee parameter
        var employeeName = deriveEmployeeName(type, title);
        var encodedEmployee = encodeURIComponent(employeeName || title || '');
        frame.src = link + encodedEmployee;
        var u = link + encodedEmployee;
    }

    setTimeout(function() {
        if (!frame.classList.contains('loaded')) {
            loader.innerHTML = '<div style="text-align:center;padding:2rem"><div style="font-size:4rem;margin-bottom:1rem">🔗</div><h3 style="font-size:1.5rem;font-weight:700">Open in Browser</h3><p style="color:rgba(255,255,255,.5);margin-bottom:1.5rem">Loading issue</p><a href="' + u + '" target="_blank" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#ff3366,#8b5cf6);color:#fff;text-decoration:none;border-radius:12px;font-weight:600">Open Form →</a></div>';
        }
    }, 12000);
}

function closeModal() {
    var modal = document.getElementById('modal');
    var frame = document.getElementById('formFrame');
    if (modal) modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(function() {
        if (frame) { frame.src = ''; frame.classList.remove('loaded'); }
    }, 400);
}

document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
window.addEventListener('message', function(event) {
    if (event.data === 'formSubmitted' || (event.data && event.data.type === 'formSuccess')) {
        setTimeout(closeModal, 1000);
    }
});

console.log('%c SHOWA ', 'background:linear-gradient(135deg,#ff3366,#8b5cf6);color:#fff;font-size:24px;font-weight:bold;padding:15px 30px;border-radius:10px');
