document.addEventListener('DOMContentLoaded', () => {

    /* ==============================
       STICKY NAVBAR
    ============================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==============================
       CANVAS IMAGE SEQUENCE (Hero Background)
    ============================== */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 232;
        
        // Define canvas sizing based on window
        const setupCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setupCanvas();
        window.addEventListener('resize', setupCanvas);

        // Preload images
        const images = [];
        let imagesLoaded = 0;
        
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Pads the number with leading zeros (e.g., 001, 010, 100)
            const paddedIndex = i.toString().padStart(3, '0');
            img.src = `images/ezgif-frame-${paddedIndex}.jpg`;
            
            img.onload = () => {
                imagesLoaded++;
                // Draw first frame once loaded
                if (imagesLoaded === 1) {
                    renderFrame(0);
                }
            };
            images.push({ loaded: false, img: img });
            img.addEventListener('load', () => { images[i-1].loaded = true; });
        }

        const renderFrame = (index) => {
            if (images[index] && images[index].loaded) {
                // Calculate scale to "cover" the canvas (like object-fit: cover)
                const img = images[index].img;
                const canvasRatio = canvas.width / canvas.height;
                const imgRatio = img.width / img.height;
                
                let drawWidth, drawHeight, offsetX, offsetY;
                
                if (canvasRatio > imgRatio) {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imgRatio;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = canvas.height * imgRatio;
                    drawHeight = canvas.height;
                    offsetX = (canvas.width - drawWidth) / 2;
                    offsetY = 0;
                }
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        };

        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            // The max scroll required to reach the last frame (e.g., 1.5 * windowHeight)
            const maxScrollTop = window.innerHeight * 1.5; 
            
            // Map scroll fraction to frame index
            const scrollFraction = Math.min(scrollTop / maxScrollTop, 1);
            const frameIndex = Math.floor(scrollFraction * (frameCount - 1));
            
            requestAnimationFrame(() => renderFrame(frameIndex));
        });
    }

    /* ==============================
       FADE-IN ON SCROLL (IntersectionObserver)
    ============================== */
    const scrollElements = document.querySelectorAll('.scroll-observe');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.15)) {
                displayScrollElement(el);
            }
        })
    }

    // Debounce/throttle optional for performance, but modern browsers handle this well enough for lightweight pages
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Trigger once on load
    handleScrollAnimation();

    /* ==============================
       SET CURRENT YEAR IN FOOTER
    ============================== */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ==============================
       FORM SUBMISSION PREVENT DEFAULT
    ============================== */
    const form = document.getElementById('resForm');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.textContent;
            
            btn.textContent = "Reservation Request Sent...";
            btn.style.backgroundColor = "transparent";
            btn.style.color = "var(--accent)";
            
            setTimeout(() => {
                form.reset();
                btn.textContent = originalText;
                btn.style.backgroundColor = "var(--accent)";
                btn.style.color = "var(--bg-color)";
                alert("Thank you! Your reservation request has been received. We will contact you to confirm.");
            }, 2000);
        });
    }

});
