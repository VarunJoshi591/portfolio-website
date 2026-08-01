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



    /* --- 4. Back To Top Scroll --- */
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* --- 5. Contact Form — Backend Integration --- */
    // Dynamically choose API endpoint:
    // Uses http://localhost:5000/api/contact when running locally,
    // and relative '/api/contact' when deployed on Vercel / production.
    const CONTACT_API_URL =
        window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api/contact'
            : '/api/contact';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // --- Gather form data ---
            const payload = {
                name: document.getElementById('formName').value.trim(),
                email: document.getElementById('formEmail').value.trim(),
                subject: document.getElementById('formSubject').value.trim(),
                message: document.getElementById('formMessage').value.trim(),
            };

            // --- Quick client-side guard ---
            if (!payload.name || !payload.email || !payload.subject || !payload.message) {
                alert('Please fill in all fields.');
                return;
            }

            // --- Show loading state ---
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            try {
                const response = await fetch(CONTACT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();

                if (data.success) {
                    // ✅ Success
                    alert(`✅ Thank you, ${payload.name}! Your message has been sent successfully. I will get back to you soon.`);
                    contactForm.reset();
                } else if (response.status === 422 && data.errors) {
                    // ⚠️ Validation errors — show the first one
                    const messages = data.errors.map(err => `• ${err.message}`).join('\n');
                    alert(`⚠️ Validation Error:\n${messages}`);
                } else if (response.status === 429) {
                    // 🚫 Rate limited
                    alert('🚫 Too many requests. Please wait 15 minutes and try again.');
                } else {
                    // ❌ Generic server error
                    alert('❌ ' + (data.message || 'Something went wrong. Please try again.'));
                }
            } catch (error) {
                // 🌐 Network / connection error
                console.error('Contact form error:', error);
                alert('❌ Network error. Could not reach the server. Please check your connection and try again.');
            } finally {
                // Always re-enable the button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});
