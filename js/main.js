const openModal = () => {
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
};

document.addEventListener('DOMContentLoaded', () => {

    // ── Модальное окно ──
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();  // ← исправлено: overlay вместо this
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ── Шапка с тенью ──
    const header = document.getElementById('siteHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        });
    }

    // ── Бургер-меню ──
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    const scrim = document.getElementById('scrim');
    const mnClose = document.getElementById('mnClose');

    const openNav = () => {
        burger?.classList.add('open');
        mobileNav?.classList.add('open');
        scrim?.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeNav = () => {
        burger?.classList.remove('open');
        mobileNav?.classList.remove('open');
        scrim?.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (burger) {
        burger.addEventListener('click', () => {
            mobileNav.classList.contains('open') ? closeNav() : openNav();
        });
    }

    mnClose?.addEventListener('click', closeNav);
    scrim?.addEventListener('click', closeNav);

    document.querySelectorAll('.mobile-nav a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    // ── Scroll Reveal ──
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in'));
    }

    // ── Count-up ──
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        const countIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    const duration = 1400;
                    const start = performance.now();

                    const tick = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target).toLocaleString('ru-RU');
                        if (progress < 1) {
                            requestAnimationFrame(tick);
                        } else {
                            el.textContent = target.toLocaleString('ru-RU') + '+';
                        }
                    };
                    requestAnimationFrame(tick);
                    countIO.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((el) => countIO.observe(el));
    }

    // ── Фильтр вкладок (courses.html) ──
    const tabs = document.querySelectorAll('.filter-tab');
    const groups = document.querySelectorAll('.course-group');

    if (tabs.length) {
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                tabs.forEach((t) => t.classList.remove('active'));
                tab.classList.add('active');

                const category = tab.getAttribute('data-cat');
                groups.forEach((group) => {
                    const groupCat = group.getAttribute('data-cat');
                    group.style.display = (category === 'all' || groupCat === category) ? '' : 'none';
                });
            });
        });
    }

    // ── Активная ссылка в навигации ──
    const currentPath = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav.primary a, .mobile-nav a').forEach((link) => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

});
