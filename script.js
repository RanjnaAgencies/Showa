// ══════════════════════════════════════════
// LOADING SCREEN
// ══════════════════════════════════════════
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('main-app');
    const loadingProgress = document.getElementById('loading-progress');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderStatus = document.getElementById('loader-status');
    const loaderHint = document.getElementById('loader-hint');

    const statusMilestones = [
        { at: 25, text: 'fetching dashboard schema', hint: 'git pull origin production-ui' },
        { at: 55, text: 'compiling crm modules', hint: 'npm run build:crm --silent' },
        { at: 80, text: 'injecting secure session keys', hint: 'openssl session:init --env=live' },
        { at: 100, text: 'portal boot complete', hint: 'launch showa-crm --ready' }
    ];

    let progress = 0;
    let milestoneIndex = 0;

    const progressTimer = setInterval(() => {
        if (progress >= 92) {
            clearInterval(progressTimer);
            return;
        }

        progress += Math.floor(Math.random() * 4) + 2;
        progress = Math.min(progress, 92);

        if (loadingProgress) {
            loadingProgress.style.width = `${progress}%`;
        }

        if (loaderPercent) {
            loaderPercent.textContent = `${progress}%`;
        }

        while (milestoneIndex < statusMilestones.length && progress >= statusMilestones[milestoneIndex].at) {
            if (loaderStatus) {
                loaderStatus.textContent = statusMilestones[milestoneIndex].text;
            }
            if (loaderHint) {
                loaderHint.textContent = statusMilestones[milestoneIndex].hint;
            }
            milestoneIndex += 1;
        }
    }, 90);

    setTimeout(() => {
        clearInterval(progressTimer);
        progress = 100;

        if (loadingProgress) {
            loadingProgress.style.width = '100%';
        }

        if (loaderPercent) {
            loaderPercent.textContent = '100%';
        }

        if (loaderStatus) {
            loaderStatus.textContent = 'portal boot complete';
        }

        if (loaderHint) {
            loaderHint.textContent = 'launch showa-crm --ready';
        }

        if (!loadingScreen || !mainApp) {
            return;
        }

        loadingScreen.classList.add('hidden');
        mainApp.classList.add('visible');

        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 3200);
});

// ══════════════════════════════════════════
// DATE & TIME UPDATE
// ══════════════════════════════════════════
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const dateTimeElement = document.getElementById('current-datetime');
    if (dateTimeElement) {
        dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

updateDateTime();
setInterval(updateDateTime, 60000); // Update every minute

// ══════════════════════════════════════════
// UI ENHANCEMENTS (ANIMATIONS)
// ══════════════════════════════════════════
let navIndicator = null;

function initUIEnhancements() {
    initRevealAnimations();
    initCardMicroInteractions();
    initNavIndicator();

    window.addEventListener('resize', () => {
        updateNavIndicatorPosition(document.querySelector('.nav-btn.active'));
    });
}

function initRevealAnimations() {
    const revealTargets = document.querySelectorAll(
        '.section-header, .employee-card, .payment-card, .catalogue-card, .service-card, .ecom-card'
    );

    revealTargets.forEach((target, index) => {
        target.classList.add('reveal-item');
        target.style.setProperty('--reveal-delay', `${Math.min((index % 10) * 70, 560)}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    revealTargets.forEach((target) => observer.observe(target));
}

function initCardMicroInteractions() {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cards = document.querySelectorAll('.employee-card, .payment-card, .catalogue-card, .service-card, .ecom-card');

    cards.forEach((card) => {
        if (supportsHover) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                const tiltY = (px - 0.5) * 8;
                const tiltX = (0.5 - py) * 8;

                card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
                card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        }

        card.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 0.7;

            ripple.className = 'card-ripple';
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 550);
        });
    });
}

function initNavIndicator() {
    const nav = document.getElementById('main-nav');
    if (!nav || navIndicator) {
        updateNavIndicatorPosition(document.querySelector('.nav-btn.active'));
        return;
    }

    navIndicator = document.createElement('span');
    navIndicator.className = 'nav-active-indicator';
    nav.appendChild(navIndicator);

    requestAnimationFrame(() => {
        updateNavIndicatorPosition(document.querySelector('.nav-btn.active'));
    });
}

function updateNavIndicatorPosition(activeBtn) {
    if (!navIndicator || !activeBtn || window.innerWidth <= 768) {
        return;
    }

    navIndicator.style.width = `${activeBtn.offsetWidth}px`;
    navIndicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
}

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
function showSection(sectionName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Update sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(`${sectionName}-section`);
    if (activeSection) {
        activeSection.classList.add('active');

        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.classList.remove('section-animate');
            void mainContent.offsetWidth;
            mainContent.classList.add('section-animate');
        }
    }

    updateNavIndicatorPosition(activeBtn);

    closeMobileNav();
}

function toggleMobileNav() {
    const nav = document.getElementById('main-nav');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (!nav || !backdrop) {
        return;
    }

    const willOpen = !nav.classList.contains('open');
    nav.classList.toggle('open', willOpen);
    backdrop.classList.toggle('active', willOpen);
    document.body.classList.toggle('nav-open', willOpen);

    if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', String(willOpen));
    }
}

function closeMobileNav() {
    const nav = document.getElementById('main-nav');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (nav) {
        nav.classList.remove('open');
    }

    if (backdrop) {
        backdrop.classList.remove('active');
    }

    document.body.classList.remove('nav-open');

    if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
    }
}

// ══════════════════════════════════════════
// PAYMENT TABS
// ══════════════════════════════════════════
function showPaymentTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update content
    document.querySelectorAll('.payment-content').forEach(content => {
        content.classList.remove('active');
    });

    const activeContent = document.getElementById(`${tabName}-payments`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// ══════════════════════════════════════════
// FORM LINKS
// ══════════════════════════════════════════
const FORM_LINKS = {
    checkin: 'https://forms.zohopublic.in/sy942255gm1/form/MassageIntakeForm/formperma/ueC94qrA8DuPZF5anFYgsSHpXPwCtIvPqDUyVadzFaM?zf_enablecamera=true',
    checkout: 'https://forms.zohopublic.in/sy942255gm1/form/RanjnaAgenciesPrivateLimitedLogOutForm/formperma/BCa1Xblj4Ca1pVvIBhee1MK1KaIYF2ULj6eJb5GIZN4?zf_enablecamera=true',
    visit: 'https://forms.zohopublic.in/sy942255gm1/form/CounterVisitTrackingForm/formperma/bnCAwS8ikFtWgcaGPa67xwJ_XUVQ4QRlbFgtFTHX1VI?zf_enablecamera=true',
    packageshipped: 'https://forms.zohopublic.in/1839ryluckgm1/form/QRScanOrderForm/formperma/CfiDf62e3sPrqlDURO0xjidLML5i3IMFSuwcMDr7dFQ?zf_enablecamera=true',
    returnreceived: 'https://forms.zohopublic.in/1839ryluckgm1/form/ReturnECOM/formperma/8s-HW1w7c_H74eoJ6uVHUMJWB7TF3EtkYh7KFLoD2Lk?zf_enablecamera=true',
    petrol: 'coming-soon',
    cashPayment: 'https://forms.zohopublic.in/1839ryluckgm1/form/CorporateTeamOutingForm/formperma/3PrB4-JEfMPLSE7By3aTgs8YEvalmCZh4fSqfo7RzWc',
    onlinePayment: 'https://forms.zohopublic.in/enquiryranjnagm1/form/SimpleOrderForm/formperma/x2sbfz1aRS1ZCgrqU-WI2p_wR23UiA7O7RQMK8iJni0?zf_enablecamera=true',
    ascEtawah: 'https://forms.zohopublic.in/ranjanaagency123gm1/form/ServiceCenterComplaintForm/formperma/eECIgdBkfx4l1MDAZh_4riGc4BC27wbH-scue6oPibY',
    ascMainpuri: 'coming-soon',
    ascFirozabad: 'coming-soon',
    ascAgra: 'coming-soon'
};

const FORM_PERMISSIONS = {
    checkin: 'geolocation; camera;',
    checkout: 'geolocation; camera;',
    visit: 'geolocation; camera;',
    packageshipped: 'camera;',
    returnreceived: 'camera;',
    petrol: 'camera;',
    cashPayment: '',
    onlinePayment: 'camera;',
    ascEtawah: '',
    ascMainpuri: '',
    ascFirozabad: '',
    ascAgra: ''
};

// ══════════════════════════════════════════
// FORM MODAL
// ══════════════════════════════════════════
function openForm(formType, formTitle) {
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const iframe = document.getElementById('form-iframe');
    const loader = document.getElementById('modal-loader');

    // Set title
    modalTitle.textContent = formTitle || 'Loading Form...';

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset iframe
    iframe.src = '';
    iframe.classList.remove('loaded');
    loader.style.display = 'flex';

    // Get form link
    const link = FORM_LINKS[formType];

    if (!link || link === 'coming-soon') {
        const isAscPending = ['ascMainpuri', 'ascFirozabad', 'ascAgra'].includes(formType);
        const title = isAscPending ? 'ASC Form Coming Soon' : 'Coming Soon';
        const subtitle = isAscPending
            ? 'This ASC complaint closing form will be available shortly.'
            : 'This form will be available shortly.';

        loader.innerHTML = `
            <div class="coming-soon-wrap">
                <div class="coming-soon-pulse" aria-hidden="true"></div>
                <div class="coming-soon-icon" aria-hidden="true">🔜</div>
                <h3>${title}</h3>
                <p>${subtitle}</p>
                <div class="coming-soon-dots" aria-hidden="true">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        return;
    }

    // Set iframe attributes
    iframe.setAttribute('allow', FORM_PERMISSIONS[formType] || '');
    iframe.setAttribute('allowfullscreen', '');

    // Load iframe
    iframe.onload = () => {
        setTimeout(() => {
            loader.style.display = 'none';
            iframe.classList.add('loaded');
        }, 500);
    };

    iframe.src = link;

    // Fallback timeout
    setTimeout(() => {
        if (!iframe.classList.contains('loaded')) {
            loader.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔗</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Open in New Tab</h3>
                    <p style="color: var(--text-tertiary); margin-bottom: 1.5rem;">The form might load better in a new window.</p>
                    <a href="${link}" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: var(--primary-color); color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">
                        Open Form
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                </div>
            `;
        }
    }, 10000);
}

function closeFormModal() {
    const modal = document.getElementById('form-modal');
    const iframe = document.getElementById('form-iframe');

    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Clear iframe after animation
    setTimeout(() => {
        iframe.src = '';
        iframe.classList.remove('loaded');
    }, 300);
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFormModal();
        closeMobileNav();
    }
});

initUIEnhancements();

// ══════════════════════════════════════════
// CONSOLE INFO
// ══════════════════════════════════════════
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6366f1;');
console.log("%c🏢 Showa Ranjna's CRM Portal", 'font-size: 20px; font-weight: bold; color: #c2410c;');
console.log("%cShowa Ranjna's CRM Portal | Ranjna Agencies Private Limited", 'font-size: 14px; color: #92400e;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6366f1;');
console.log('Version: 2.0.0');
console.log('Build: Web Dashboard');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6366f1;');

// ══════════════════════════════════════════
// EXPORT FUNCTIONS
// ══════════════════════════════════════════
window.ShowaPortal = {
    showSection: showSection,
    toggleMobileNav: toggleMobileNav,
    closeMobileNav: closeMobileNav,
    openForm: openForm,
    closeFormModal: closeFormModal,
    showPaymentTab: showPaymentTab,
    version: '2.0.0'
};
