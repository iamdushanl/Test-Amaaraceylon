document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const heroParallax = document.getElementById('heroParallax');

    const updateNavbar = () => {
        if (!navbar) {
            return;
        }

        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    const smoothAnchorScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                const href = link.getAttribute('href');

                if (!href || href === '#') {
                    return;
                }

                const target = document.querySelector(href);
                if (!target) {
                    return;
                }

                event.preventDefault();

                const navOffset = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset + 8;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    };

    const setupHeroSequence = () => {
        const frames = Array.from(document.querySelectorAll('.hero-frame'));
        if (!frames.length) {
            return null;
        }

        const indicators = Array.from(document.querySelectorAll('.hero-indicator'));
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let activeFrame = 0;
        let rotationTimer = null;
        let ticking = false;

        const setFrame = (index) => {
            const frameCount = frames.length;
            activeFrame = ((index % frameCount) + frameCount) % frameCount;

            frames.forEach((frame, frameIndex) => {
                frame.classList.toggle('is-active', frameIndex === activeFrame);
            });

            indicators.forEach((indicator, indicatorIndex) => {
                const isActive = indicatorIndex === activeFrame;
                indicator.classList.toggle('is-active', isActive);
                indicator.setAttribute('aria-selected', String(isActive));
                indicator.tabIndex = isActive ? 0 : -1;
            });
        };

        const updateParallax = () => {
            if (!heroParallax) {
                return;
            }

            const offset = Math.min(window.scrollY * 0.17, window.innerHeight * 0.24);
            heroParallax.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
        };

        const stopRotation = () => {
            if (rotationTimer === null) {
                return;
            }

            window.clearInterval(rotationTimer);
            rotationTimer = null;
        };

        const startRotation = () => {
            stopRotation();
            if (prefersReducedMotion || frames.length < 2) {
                return;
            }

            rotationTimer = window.setInterval(() => {
                setFrame(activeFrame + 1);
            }, 4200);
        };

        const onScroll = () => {
            if (ticking) {
                return;
            }

            ticking = true;
            requestAnimationFrame(() => {
                updateNavbar();
                updateParallax();
                ticking = false;
            });
        };

        indicators.forEach((indicator) => {
            indicator.addEventListener('click', () => {
                const target = Number.parseInt(indicator.dataset.frameTarget || '', 10);
                if (Number.isNaN(target)) {
                    return;
                }

                setFrame(target);
                startRotation();
            });

            indicator.addEventListener('keydown', (event) => {
                const key = event.key;
                let targetIndex = null;

                if (key === 'ArrowRight' || key === 'ArrowDown') {
                    targetIndex = activeFrame + 1;
                } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
                    targetIndex = activeFrame - 1;
                } else if (key === 'Home') {
                    targetIndex = 0;
                } else if (key === 'End') {
                    targetIndex = frames.length - 1;
                }

                if (targetIndex === null) {
                    return;
                }

                event.preventDefault();
                setFrame(targetIndex);
                startRotation();
                indicators[activeFrame].focus();
            });
        });

        const hero = document.getElementById('hero');
        if (hero) {
            hero.addEventListener('mouseenter', stopRotation);
            hero.addEventListener('mouseleave', startRotation);
            hero.addEventListener('focusin', stopRotation);
            hero.addEventListener('focusout', (event) => {
                if (hero.contains(event.relatedTarget)) {
                    return;
                }

                startRotation();
            });
        }

        setFrame(0);
        startRotation();
        updateParallax();

        window.addEventListener('resize', updateParallax);
        window.addEventListener('scroll', onScroll, { passive: true });

        return {
            refresh: () => {
                setFrame(activeFrame);
                updateParallax();
            }
        };
    };

    const setupRevealOnScroll = () => {
        const revealElements = document.querySelectorAll('.scroll-observe');
        if (!revealElements.length) {
            return;
        }

        revealElements.forEach((element) => {
            const delay = element.getAttribute('data-delay');
            if (delay) {
                element.style.setProperty('--delay', delay);
            }
        });

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                });
            },
            {
                root: null,
                threshold: 0.2,
                rootMargin: '0px 0px -8% 0px'
            }
        );

        revealElements.forEach((element) => observer.observe(element));
    };

    const setupForm = () => {
        const form = document.getElementById('resForm');
        if (!form) {
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const submitButton = form.querySelector('.submit-btn');
            const defaultLabel = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Request Sent';

            setTimeout(() => {
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = defaultLabel;
                alert('Thank you for choosing Amaara. Your reservation request has been received.');
            }, 1200);
        });
    };

    smoothAnchorScroll();
    setupRevealOnScroll();
    setupForm();
    setupHeroSequence();
    updateNavbar();

    const year = document.getElementById('year');
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
});
