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
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) {
            return null;
        }

        const context = canvas.getContext('2d');
        const frameCount = 232;
        const images = new Array(frameCount);
        let currentFrame = 0;
        let pendingFrame = 0;
        let ticking = false;

        const setCanvasSize = () => {
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * ratio);
            canvas.height = Math.floor(window.innerHeight * ratio);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            drawFrame(currentFrame);
        };

        const drawFrame = (index) => {
            const image = images[index];
            if (!image || !image.complete || image.naturalWidth === 0) {
                return;
            }

            const canvasWidth = window.innerWidth;
            const canvasHeight = window.innerHeight;
            const canvasRatio = canvasWidth / canvasHeight;
            const imageRatio = image.naturalWidth / image.naturalHeight;

            let width = canvasWidth;
            let height = canvasHeight;
            let x = 0;
            let y = 0;

            if (canvasRatio > imageRatio) {
                height = width / imageRatio;
                y = (canvasHeight - height) * 0.5;
            } else {
                width = height * imageRatio;
                x = (canvasWidth - width) * 0.5;
            }

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(image, x, y, width, height);
            currentFrame = index;
        };

        const preloadFrames = () => {
            for (let i = 0; i < frameCount; i++) {
                const frame = new Image();
                const frameLabel = String(i + 1).padStart(3, '0');
                frame.src = `images/ezgif-frame-${frameLabel}.jpg`;
                frame.loading = 'eager';

                frame.addEventListener('load', () => {
                    if (i === 0) {
                        drawFrame(0);
                    }

                    if (i === pendingFrame) {
                        drawFrame(pendingFrame);
                    }
                });

                images[i] = frame;
            }
        };

        const updateFrameByScroll = () => {
            const maxScroll = window.innerHeight * 1.4;
            const fraction = Math.min(window.scrollY / maxScroll, 1);
            pendingFrame = Math.round(fraction * (frameCount - 1));
            drawFrame(pendingFrame);
        };

        const updateParallax = () => {
            if (!heroParallax) {
                return;
            }

            const offset = Math.min(window.scrollY * 0.17, window.innerHeight * 0.24);
            heroParallax.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
        };

        const onScroll = () => {
            if (ticking) {
                return;
            }

            ticking = true;
            requestAnimationFrame(() => {
                updateNavbar();
                updateFrameByScroll();
                updateParallax();
                ticking = false;
            });
        };

        preloadFrames();
        setCanvasSize();
        updateFrameByScroll();
        updateParallax();

        window.addEventListener('resize', () => {
            setCanvasSize();
            updateFrameByScroll();
        });

        window.addEventListener('scroll', onScroll, { passive: true });

        return {
            refresh: () => {
                setCanvasSize();
                updateFrameByScroll();
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
