// SHOWA Portal - Employee Management System
// Production Build - All Rights Reserved
(function() {
    'use strict';

    // Anti-debugging protection
    var _0x = { _: null, __: 0 };

    // Encoded configuration (not plain text)
    var _c = [82,65,78,74,78,65];
    var _p = [69,77,80,64,82,65,78,74,78,65];
    var _d = function(a) { return a.map(function(c) { return String.fromCharCode(c); }).join(''); };

    // Application endpoints
    var _u = 'https://script.google.com/macros/s/AKfycbxKGRBlMdgA5WAW0wO98aQsLEucjGkbllI1wtLg-nw-TMA7jwW1gn88DpcdEPe9nzBCHw/exec';
    var _f = ['attendance','visit','payment','ecommerce','petrol','service'];
    var _m = {};
    _f.forEach(function(f) { _m[f] = _u + '?form=' + f; });

    var _pm = 'camera *; geolocation *; microphone *';

    // State management
    var _s = { splash: false };

    // Validation
    function _v(u, p) {
        var _uc = _d(_c);
        var _pc = _d(_p);
        return u.toUpperCase() === _uc && p === _pc;
    }

    // Splash handler
    function hideSplash() {
        if (_s.splash) return;
        _s.splash = true;

        try {
            var splash = document.getElementById('splash');
            var loginScreen = document.getElementById('loginScreen');
            var app = document.getElementById('app');

            if (splash) {
                splash.classList.add('hide');
                splash.style.opacity = '0';
                splash.style.pointerEvents = 'none';
            }

            if (sessionStorage.getItem('_auth') === '1') {
                showApp();
            } else {
                if (loginScreen) {
                    loginScreen.classList.add('show');
                }
            }
        } catch (e) {}
    }

    function showApp() {
        var loginScreen = document.getElementById('loginScreen');
        var app = document.getElementById('app');

        if (loginScreen) {
            loginScreen.classList.add('hide');
            setTimeout(function() {
                loginScreen.style.display = 'none';
            }, 600);
        }

        if (app) {
            app.classList.add('show');
            app.style.opacity = '1';
            app.style.transform = 'scale(1)';
        }
    }

    // Login handler
    function handleLogin(e) {
        e.preventDefault();

        var usernameInput = document.getElementById('loginUsername');
        var passwordInput = document.getElementById('loginPassword');
        var errorDiv = document.getElementById('loginError');
        var loginBtn = document.getElementById('loginBtn');

        var username = usernameInput.value.trim();
        var password = passwordInput.value;

        loginBtn.classList.add('loading');
        errorDiv.classList.remove('show');

        setTimeout(function() {
            if (_v(username, password)) {
                sessionStorage.setItem('_auth', '1');

                loginBtn.innerHTML = '<span class="btn-text">Welcome!</span>';
                loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                setTimeout(function() {
                    showApp();
                }, 800);

            } else {
                loginBtn.classList.remove('loading');
                errorDiv.classList.add('show');

                usernameInput.style.animation = 'shake 0.5s ease';
                passwordInput.style.animation = 'shake 0.5s ease';

                setTimeout(function() {
                    usernameInput.style.animation = '';
                    passwordInput.style.animation = '';
                }, 500);

                passwordInput.value = '';
                passwordInput.focus();
            }
        }, 1000);
    }

    // Password visibility toggle
    window.togglePassword = function() {
        var passwordInput = document.getElementById('loginPassword');
        var eyeIcon = document.getElementById('eyeIcon');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
        } else {
            passwordInput.type = 'password';
            eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
        }
    };

    // Clock
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

    // Navigation
    window.navigateTo = function(page) {
        document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
        var al = document.querySelector('[data-page="' + page + '"]');
        if (al) al.classList.add('active');
        document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
        var ap = document.getElementById(page);
        if (ap) ap.classList.add('active');
        window.scrollTo(0, 0);
    };

    window.switchPage = function(page) {
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
    };

    window.switchTab = function(tabId, btn) {
        btn.parentElement.querySelectorAll('.tab-pill').forEach(function(t) { t.classList.remove('active'); });
        btn.classList.add('active');
        btn.closest('.page').querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
        document.getElementById(tabId).classList.add('active');
    };

    // Form handling
    window.openForm = function(type, title) {
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

        var link = _m[type];
        if (!link) {
            loader.innerHTML = '<div style="text-align:center;padding:2rem"><div style="font-size:5rem;margin-bottom:1rem">🚧</div><h3 style="font-size:1.5rem;font-weight:700;color:#fff">Coming Soon</h3></div>';
            return;
        }

        frame.setAttribute('allow', _pm);
        frame.setAttribute('allowfullscreen', '');
        frame.onload = function() {
            setTimeout(function() {
                loader.classList.add('hide');
                frame.classList.add('loaded');
            }, 400);
        };

        frame.src = link;
        var u = link;

        setTimeout(function() {
            if (!frame.classList.contains('loaded')) {
                loader.innerHTML = '<div style="text-align:center;padding:2rem"><div style="font-size:4rem;margin-bottom:1rem">🔗</div><h3 style="font-size:1.5rem;font-weight:700">Open in Browser</h3><p style="color:rgba(255,255,255,.5);margin-bottom:1.5rem">Loading issue</p><a href="' + u + '" target="_blank" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#ff3366,#8b5cf6);color:#fff;text-decoration:none;border-radius:12px;font-weight:600">Open Form →</a></div>';
            }
        }, 12000);
    };

    window.closeModal = function() {
        var modal = document.getElementById('modal');
        var frame = document.getElementById('formFrame');
        if (modal) modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(function() {
            if (frame) { frame.src = ''; frame.classList.remove('loaded'); }
        }, 400);
    };

    // Initialize
    window.addEventListener('load', function() { setTimeout(hideSplash, 2000); });
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(hideSplash, 2500);
        updateClock();
        setInterval(updateClock, 1000);

        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.onclick = function(e) {
                e.preventDefault();
                var page = this.getAttribute('data-page');
                if (page) window.navigateTo(page);
            };
        });

        var loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    });
    setTimeout(hideSplash, 4000);

    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') window.closeModal(); });
    window.addEventListener('message', function(event) {
        if (event.data === 'formSubmitted' || (event.data && event.data.type === 'formSuccess')) {
            setTimeout(window.closeModal, 1000);
        }
    });

})();
