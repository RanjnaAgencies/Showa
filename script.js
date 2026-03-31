// ========================================
// SHOWA - Premium Portal with Google Apps Script
// ========================================

// ⚠️ IMPORTANT: Replace YOUR_APPS_SCRIPT_URL with your actual deployed URL
// Get URL from: script.google.com → Deploy → Web app URL
// Example: https://script.google.com/macros/s/AKfycbxXXXXXXXXX/exec

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKGRBlMdgA5WAW0wO98aQsLEucjGkbllI1wtLg-nw-TMA7jwW1gn88DpcdEPe9nzBCHw/exec'; // 👈 UPDATE THIS AFTER DEPLOYING!

// Form URLs Configuration
const FORMS = {
    checkin: APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL' ? `${APPS_SCRIPT_URL}?form=checkin&emp=` : null,
    visit: APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL' ? `${APPS_SCRIPT_URL}?form=visit&emp=` : null,
    packageshipped: APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL' ? `${APPS_SCRIPT_URL}?form=packageshipped&emp=` : null,
    returnreceived: APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL' ? `${APPS_SCRIPT_URL}?form=returnreceived&emp=` : null,
    cashPayment: APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL' ? `${APPS_SCRIPT_URL}?form=cashPayment&emp=` : null,
    onlinePayment: APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL' ? `${APPS_SCRIPT_URL}?form=onlinePayment&emp=` : null,
    ascEtawah: APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL' ? `${APPS_SCRIPT_URL}?form=ascEtawah` : null,
    ascMainpuri: null,
    ascFirozabad: null,
    ascAgra: null
};

const PERMISSIONS = {
    checkin: 'geolocation; camera;',
    visit: 'geolocation; camera;',
    packageshipped: 'geolocation; camera;',
    returnreceived: 'geolocation; camera;',
    cashPayment: 'geolocation;',
    onlinePayment: 'geolocation; camera;',
    ascEtawah: 'geolocation;',
    ascMainpuri: '',
    ascFirozabad: '',
    ascAgra: ''
};

// Splash Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hide');
        document.getElementById('app').classList.add('show');
    }, 2500);
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    // Desktop nav links (sidebar)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                navigateTo(page);
            }
        };
    });
});

function updateClock() {
    const now = new Date();
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const timeStr = now.toLocaleString('en-US', options);

    const mainClock = document.getElementById('mainClock');
    const mClock = document.getElementById('mClock');

    if (mainClock) mainClock.textContent = timeStr;
    if (mClock) mClock.textContent = timeStr;
}

// Navigation (Desktop)
function navigateTo(page) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    const activePage = document.getElementById(page);
    if (activePage) {
        activePage.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Mobile Bottom Navigation
function switchPage(page) {
    // Update bottom nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-page="${page}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Update sidebar nav links (for desktop)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    const activePage = document.getElementById(page);
    if (activePage) {
        activePage.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Mobile Menu (Removed - using bottom nav now)

// Tabs
function switchTab(tabId, btn) {
    // Update tab buttons
    btn.parentElement.querySelectorAll('.tab-pill').forEach(t => {
        t.classList.remove('active');
    });
    btn.classList.add('active');

    // Update tab panes
    btn.closest('.page').querySelectorAll('.tab-pane').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Modal
function openForm(type, title) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const loader = document.getElementById('formLoader');
    const frame = document.getElementById('formFrame');

    modalTitle.textContent = title;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Reset
    frame.src = '';
    frame.classList.remove('loaded');
    loader.classList.remove('hide');
    loader.innerHTML = `
        <div class="loader-anim">
            <div class="loader-circle"></div>
            <div class="loader-circle"></div>
            <div class="loader-circle"></div>
        </div>
        <p>Loading form...</p>
    `;

    const link = FORMS[type];

    if (!link) {
        // Check if it's because Apps Script is not configured
        if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL') {
            loader.innerHTML = `
                <div style="text-align:center;padding:2.5rem 1.5rem;max-width:500px;margin:0 auto">
                    <div style="font-size:4rem;margin-bottom:1.5rem">⚙️</div>
                    <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;color:#ff3366">
                        Setup Required
                    </h3>
                    <p style="color:rgba(255,255,255,.8);margin-bottom:1.5rem;line-height:1.6">
                        Google Apps Script deployment pending
                    </p>
                    <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
                                border-radius:12px;padding:1.5rem;text-align:left;margin-bottom:1.5rem">
                        <p style="color:rgba(255,255,255,.6);font-size:0.9rem;margin-bottom:1rem;font-weight:600">
                            📋 Quick Setup Steps:
                        </p>
                        <ol style="color:rgba(255,255,255,.7);font-size:0.85rem;line-height:2;margin:0;padding-left:1.5rem">
                            <li>Go to <strong style="color:#10b981">script.google.com</strong></li>
                            <li>Create new project: "Showa Forms"</li>
                            <li>Copy Code.gs & FormTemplate.html</li>
                            <li>Update CONFIG with Sheet IDs</li>
                            <li>Deploy as Web App (Anyone access)</li>
                            <li>Copy Web App URL</li>
                            <li>Update script.js line 10</li>
                        </ol>
                    </div>
                    <a href="apps-script/SETUP_GUIDE.md" target="_blank"
                       style="display:inline-flex;align-items:center;gap:10px;padding:14px 28px;
                              background:linear-gradient(135deg,#10b981,#059669);color:#fff;
                              text-decoration:none;border-radius:12px;font-weight:600;font-size:0.95rem;
                              box-shadow:0 8px 20px rgba(16,185,129,.3);transition:all .3s ease">
                        📖 View Setup Guide
                    </a>
                </div>
            `;
        } else {
            // Coming soon message for future forms
            loader.innerHTML = `
                <div style="text-align:center;padding:2rem">
                    <div style="font-size:5rem;margin-bottom:1.5rem;animation:float 3s ease-in-out infinite">🚧</div>
                    <h3 style="font-size:1.75rem;font-weight:700;margin-bottom:.75rem;background:linear-gradient(135deg,#fff,#ff3366);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Coming Soon</h3>
                    <p style="color:rgba(255,255,255,.5);font-size:1rem">This form will be available shortly.</p>
                </div>
                <style>@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}</style>
            `;
        }
        return;
    }

    frame.setAttribute('allow', PERMISSIONS[type] || '');

    frame.onload = () => {
        setTimeout(() => {
            loader.classList.add('hide');
            frame.classList.add('loaded');
        }, 400);
    };

    // Build URL with employee name
    frame.src = link + encodeURIComponent(title);

    // Fallback
    setTimeout(() => {
        if (!frame.classList.contains('loaded')) {
            loader.innerHTML = `
                <div style="text-align:center;padding:2rem">
                    <div style="font-size:4rem;margin-bottom:1.5rem">🔗</div>
                    <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:.5rem">Open in Browser</h3>
                    <p style="color:rgba(255,255,255,.5);margin-bottom:2rem">Form couldn't load here</p>
                    <a href="${link + encodeURIComponent(title)}" target="_blank" rel="noopener"
                       style="display:inline-flex;align-items:center;gap:12px;padding:16px 32px;
                              background:linear-gradient(135deg,#ff3366,#8b5cf6);color:#fff;
                              text-decoration:none;border-radius:14px;font-weight:600;font-size:1rem;
                              box-shadow:0 10px 30px rgba(255,51,102,.4);
                              transition:all .3s ease">
                        Open Form
                        <span style="font-size:1.2rem">→</span>
                    </a>
                </div>
            `;
        }
    }, 12000);
}

function closeModal() {
    const modal = document.getElementById('modal');
    const frame = document.getElementById('formFrame');

    modal.classList.remove('show');
    document.body.style.overflow = '';

    setTimeout(() => {
        frame.src = '';
        frame.classList.remove('loaded');
    }, 400);
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Listen for form submission complete message from iframe
window.addEventListener('message', (event) => {
    if (event.data === 'formSubmitted') {
        setTimeout(closeModal, 1000);
    }
});

// Console branding
console.log(
    '%c SHOWA ',
    'background:linear-gradient(135deg,#ff3366,#8b5cf6);color:#fff;font-size:28px;font-weight:bold;padding:20px 40px;border-radius:14px'
);
console.log(
    '%c Ranjna Agencies Private Limited ',
    'color:rgba(255,255,255,.5);font-size:14px'
);
console.log(
    '%c 📍 High-Accuracy GPS | 📸 Camera | ♾️ Unlimited Responses ',
    'color:#10b981;font-size:12px;font-weight:600'
);

// Configuration check on load
if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL') {
    console.log(
        '%c ⚠️ SETUP REQUIRED ',
        'background:#ff3366;color:#fff;font-size:14px;font-weight:bold;padding:8px 16px;border-radius:8px'
    );
    console.log(
        '%c Deploy Google Apps Script and update APPS_SCRIPT_URL in script.js\nSee: apps-script/SETUP_GUIDE.md ',
        'color:#ff3366;font-size:12px;margin-top:8px'
    );
}
