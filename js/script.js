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
       PARALLAX EFFECT (Hero Background)
    ============================== */
    const parallaxImg = document.querySelector('.parallax-img');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        // Move background at 40% the scroll speed
        if(parallaxImg && scrollPosition < window.innerHeight) {
            parallaxImg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
        }
    });

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
