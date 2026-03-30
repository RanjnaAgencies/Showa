// ========================================
// SHOWA - Next Level Premium Portal
// ========================================

const FORMS = {
    checkin: 'https://forms.zohopublic.in/sy942255gm1/form/MassageIntakeForm/formperma/ueC94qrA8DuPZF5anFYgsSHpXPwCtIvPqDUyVadzFaM?zf_enablecamera=true',
    visit: 'https://forms.zohopublic.in/sy942255gm1/form/CounterVisitTrackingForm/formperma/bnCAwS8ikFtWgcaGPa67xwJ_XUVQ4QRlbFgtFTHX1VI?zf_enablecamera=true',
    packageshipped: 'https://forms.zohopublic.in/1839ryluckgm1/form/QRScanOrderForm/formperma/CfiDf62e3sPrqlDURO0xjidLML5i3IMFSuwcMDr7dFQ?zf_enablecamera=true',
    returnreceived: 'https://forms.zohopublic.in/1839ryluckgm1/form/ReturnECOM/formperma/8s-HW1w7c_H74eoJ6uVHUMJWB7TF3EtkYh7KFLoD2Lk?zf_enablecamera=true',
    cashPayment: 'https://forms.zohopublic.in/1839ryluckgm1/form/CorporateTeamOutingForm/formperma/3PrB4-JEfMPLSE7By3aTgs8YEvalmCZh4fSqfo7RzWc',
    onlinePayment: 'https://forms.zohopublic.in/enquiryranjnagm1/form/SimpleOrderForm/formperma/x2sbfz1aRS1ZCgrqU-WI2p_wR23UiA7O7RQMK8iJni0?zf_enablecamera=true',
    ascEtawah: 'https://forms.zohopublic.in/ranjanaagency123gm1/form/ServiceCenterComplaintForm/formperma/eECIgdBkfx4l1MDAZh_4riGc4BC27wbH-scue6oPibY',
    ascMainpuri: null,
    ascFirozabad: null,
    ascAgra: null
};

const PERMISSIONS = {
    checkin: 'geolocation; camera;',
    visit: 'geolocation; camera;',
    packageshipped: 'camera;',
    returnreceived: 'camera;',
    cashPayment: '',
    onlinePayment: 'camera;',
    ascEtawah: '',
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
        loader.innerHTML = `
            <div style="text-align:center;padding:2rem">
                <div style="font-size:5rem;margin-bottom:1.5rem;animation:float 3s ease-in-out infinite">🚧</div>
                <h3 style="font-size:1.75rem;font-weight:700;margin-bottom:.75rem;background:linear-gradient(135deg,#fff,#ff3366);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Coming Soon</h3>
                <p style="color:rgba(255,255,255,.5);font-size:1rem">This form will be available shortly.</p>
            </div>
            <style>@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}</style>
        `;
        return;
    }

    frame.setAttribute('allow', PERMISSIONS[type] || '');

    frame.onload = () => {
        setTimeout(() => {
            loader.classList.add('hide');
            frame.classList.add('loaded');
        }, 400);
    };

    frame.src = link;

    // Fallback
    setTimeout(() => {
        if (!frame.classList.contains('loaded')) {
            loader.innerHTML = `
                <div style="text-align:center;padding:2rem">
                    <div style="font-size:4rem;margin-bottom:1.5rem">🔗</div>
                    <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:.5rem">Open in Browser</h3>
                    <p style="color:rgba(255,255,255,.5);margin-bottom:2rem">Form couldn't load here</p>
                    <a href="${link}" target="_blank" rel="noopener"
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

// Console branding
console.log(
    '%c SHOWA ',
    'background:linear-gradient(135deg,#ff3366,#8b5cf6);color:#fff;font-size:28px;font-weight:bold;padding:20px 40px;border-radius:14px'
);
console.log(
    '%c Ranjna Agencies Private Limited ',
    'color:rgba(255,255,255,.5);font-size:14px'
);
