/**
 * VARUN JOSHI - PORTFOLIO INTERACTIVITY SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Elements
    const headerNav = document.getElementById('headerNav');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksList = document.querySelectorAll('.nav-links a');
    const backToTopBtn = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');

    /* --- 1. Header Scroll Effect --- */
    const handleScroll = () => {
        if (window.scrollY > 40) {
            headerNav.classList.add('scrolled');
        } else {
            headerNav.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Highlight Active Link on Scroll
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    /* --- 2. Mobile Drawer Toggle --- */
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });

        // Close drawer when clicking a navigation link
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    /* --- 3. Skill Progress Bar Fill Animation --- */
    const skillBars = document.querySelectorAll('.progress-bar-fill');

    const animateSkillBars = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress') || '80%';
                bar.style.width = progress;
                observer.unobserve(bar);
            }
        });
    };

    const skillObserver = new IntersectionObserver(animateSkillBars, {
        threshold: 0.2
    });

    skillBars.forEach(bar => skillObserver.observe(bar));

    /* --- 4. Back To Top Scroll --- */
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* --- 5. Contact Form Interactive Handler --- */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('formName');
            const emailInput = document.getElementById('formEmail');
            const messageInput = document.getElementById('formMessage');

            if (nameInput.value.trim() === '' || emailInput.value.trim() === '') {
                alert('Please fill in your name and email address.');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                alert(`Thank you, ${nameInput.value}! Your message has been sent successfully. I will get back to you soon.`);
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1200);
        });
    }
});
