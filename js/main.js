document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const header = document.getElementById('header');
    const mainNav = document.getElementById('mainNav');
    const menuToggle = document.getElementById('menuToggle');
    const successModal = document.getElementById('successModal');
    const projectLightbox = document.getElementById('projectLightbox');

    function syncPageScrollLock() {
        const menuIsOpen = mainNav?.classList.contains('open') ?? false;
        const modalIsOpen = successModal ? !successModal.hidden : false;
        const lightboxIsOpen = projectLightbox ? !projectLightbox.hidden : false;
        document.body.classList.toggle('scroll-locked', menuIsOpen || modalIsOpen || lightboxIsOpen);
    }

    function closeMobileMenu() {
        if (!mainNav || !menuToggle) return;

        mainNav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        syncPageScrollLock();
    }

    function initNavigation() {
        if (mainNav && menuToggle) {
            menuToggle.addEventListener('click', () => {
                const isOpen = mainNav.classList.toggle('open');
                menuToggle.classList.toggle('active', isOpen);
                menuToggle.setAttribute('aria-expanded', String(isOpen));
                syncPageScrollLock();
            });

            mainNav.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', closeMobileMenu);
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
                    closeMobileMenu();
                }
            });
        }

        const navLinks = [...document.querySelectorAll('.nav-link')];
        const sections = [...document.querySelectorAll('main section[id]')];
        let scrollUpdateRequested = false;

        function updateHeaderAndActiveLink() {
            const scrollPosition = window.scrollY;
            header?.classList.toggle('scrolled', scrollPosition > 50);

            const markerPosition = scrollPosition + 140;
            let activeSectionId = sections[0]?.id ?? '';

            sections.forEach((section) => {
                if (markerPosition >= section.offsetTop) {
                    activeSectionId = section.id;
                }
            });

            navLinks.forEach((link) => {
                const isActive = link.getAttribute('href') === `#${activeSectionId}`;
                link.classList.toggle('active', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            scrollUpdateRequested = false;
        }

        window.addEventListener('scroll', () => {
            if (scrollUpdateRequested) return;

            scrollUpdateRequested = true;
            window.requestAnimationFrame(updateHeaderAndActiveLink);
        }, { passive: true });

        updateHeaderAndActiveLink();
    }

    function initHeroSlider() {
        const slides = [...document.querySelectorAll('#heroSlider .slide')];
        if (slides.length === 0) return;

        const intervalDuration = 5000;
        let currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('active')));
        let sliderTimer = null;

        function showSlide(index) {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === currentIndex;
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });
        }

        function stopSlider() {
            if (sliderTimer !== null) {
                window.clearInterval(sliderTimer);
                sliderTimer = null;
            }
        }

        function startSlider() {
            stopSlider();

            if (slides.length > 1 && !document.hidden) {
                sliderTimer = window.setInterval(() => showSlide(currentIndex + 1), intervalDuration);
            }
        }

        document.addEventListener('visibilitychange', startSlider);
        showSlide(currentIndex);
        startSlider();
    }

    function initSkillBars() {
        const skillsContainer = document.getElementById('skillsContainer');
        if (!skillsContainer) return;

        const progressBars = [...skillsContainer.querySelectorAll('[role="progressbar"]')];
        let hasAnimated = false;

        progressBars.forEach((progressBar) => {
            const fill = progressBar.querySelector('.progress-bar-fill');
            if (fill) fill.style.width = '0%';
            progressBar.setAttribute('aria-valuenow', '0');
        });

        function animateSkillBars() {
            if (hasAnimated) return;
            hasAnimated = true;

            progressBars.forEach((progressBar) => {
                const value = Number.parseInt(progressBar.dataset.value ?? '0', 10);
                const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
                const fill = progressBar.querySelector('.progress-bar-fill');

                if (fill) fill.style.width = `${safeValue}%`;
                progressBar.setAttribute('aria-valuenow', String(safeValue));
            });
        }

        if (!('IntersectionObserver' in window)) {
            animateSkillBars();
            return;
        }

        const skillsObserver = new IntersectionObserver((entries, observer) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                animateSkillBars();
                observer.disconnect();
            }
        }, { threshold: 0.25 });

        skillsObserver.observe(skillsContainer);
    }

    function initProjectFilters() {
        const filterContainer = document.getElementById('projectsFilter');
        const projectCards = [...document.querySelectorAll('#projectsGrid .project-card')];
        if (!filterContainer || projectCards.length === 0) return;

        const filterButtons = [...filterContainer.querySelectorAll('.filter-btn')];

        function applyFilter(filterValue) {
            filterButtons.forEach((button) => {
                const isActive = button.dataset.filter === filterValue;
                button.classList.toggle('active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });

            projectCards.forEach((card) => {
                const shouldShow = filterValue === 'all' || card.dataset.category === filterValue;
                card.hidden = !shouldShow;
            });
        }

        filterContainer.addEventListener('click', (event) => {
            const selectedButton = event.target.closest('.filter-btn');
            if (!selectedButton || !filterContainer.contains(selectedButton)) return;
            applyFilter(selectedButton.dataset.filter ?? 'all');
        });

        applyFilter('all');
    }

    function initTestimonials() {
        const slider = document.getElementById('testimonialSlides');
        const dotsContainer = document.getElementById('testimonialDots');
        if (!slider || !dotsContainer) return;

        const slides = [...slider.querySelectorAll('.testimonial-slide')];
        const dots = [...dotsContainer.querySelectorAll('.t-dot')];
        if (slides.length === 0 || slides.length !== dots.length) return;

        const intervalDuration = 7000;
        let currentIndex = 0;
        let sliderTimer = null;

        function showTestimonial(index) {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === currentIndex;
                slide.classList.toggle('active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            dots.forEach((dot, dotIndex) => {
                const isActive = dotIndex === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', String(isActive));
                dot.tabIndex = isActive ? 0 : -1;
            });
        }

        function stopSlider() {
            if (sliderTimer !== null) {
                window.clearInterval(sliderTimer);
                sliderTimer = null;
            }
        }

        function startSlider() {
            stopSlider();

            if (slides.length > 1 && !document.hidden) {
                sliderTimer = window.setInterval(() => showTestimonial(currentIndex + 1), intervalDuration);
            }
        }

        dotsContainer.addEventListener('click', (event) => {
            const selectedDot = event.target.closest('.t-dot');
            if (!selectedDot || !dotsContainer.contains(selectedDot)) return;

            showTestimonial(Number.parseInt(selectedDot.dataset.slide ?? '0', 10));
            startSlider();
        });

        dotsContainer.addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();

            let nextIndex = currentIndex;
            if (event.key === 'ArrowLeft') nextIndex -= 1;
            if (event.key === 'ArrowRight') nextIndex += 1;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = slides.length - 1;

            showTestimonial(nextIndex);
            dots[currentIndex].focus();
            startSlider();
        });

        document.addEventListener('visibilitychange', startSlider);
        showTestimonial(0);
        startSlider();
    }

    function initProjectLightbox() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid || !projectLightbox) return;

        const projectCards = [...projectsGrid.querySelectorAll('.project-card')];
        const lightboxDialog = projectLightbox.querySelector('.project-lightbox-dialog');
        const lightboxImage = document.getElementById('projectLightboxImage');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxCategory = document.getElementById('projectLightboxCategory');
        const fullSizeLink = document.getElementById('projectLightboxOpen');
        const closeButton = document.getElementById('projectLightboxClose');
        const previousButton = document.getElementById('projectLightboxPrev');
        const nextButton = document.getElementById('projectLightboxNext');

        if (!lightboxDialog || !lightboxImage || !lightboxTitle || !lightboxCategory || !fullSizeLink) return;

        let currentIndex = 0;
        let previouslyFocusedElement = null;
        let hideTimer = null;

        function showProject(index) {
            currentIndex = (index + projectCards.length) % projectCards.length;
            const card = projectCards[currentIndex];
            const sourceImage = card.querySelector('.project-image');

            lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
            lightboxImage.alt = `${sourceImage.alt} — full-size preview`;
            lightboxTitle.textContent = card.querySelector('.project-title')?.textContent.trim() ?? 'Project preview';
            lightboxCategory.textContent = card.querySelector('.project-category')?.textContent.trim() ?? '';
            fullSizeLink.href = sourceImage.currentSrc || sourceImage.src;
        }

        function open(index, trigger) {
            if (hideTimer !== null) window.clearTimeout(hideTimer);

            previouslyFocusedElement = trigger;
            showProject(index);
            projectLightbox.hidden = false;
            projectLightbox.setAttribute('aria-hidden', 'false');
            window.requestAnimationFrame(() => {
                projectLightbox.classList.add('active');
                lightboxDialog.focus();
            });
            syncPageScrollLock();
        }

        function close() {
            projectLightbox.classList.remove('active');
            projectLightbox.setAttribute('aria-hidden', 'true');

            hideTimer = window.setTimeout(() => {
                projectLightbox.hidden = true;
                lightboxImage.removeAttribute('src');
                syncPageScrollLock();
            }, 250);

            if (previouslyFocusedElement instanceof HTMLElement) {
                previouslyFocusedElement.focus();
            }
        }

        projectsGrid.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-project-preview]');
            if (!trigger || !projectsGrid.contains(trigger)) return;

            const card = trigger.closest('.project-card');
            open(projectCards.indexOf(card), trigger);
        });

        closeButton?.addEventListener('click', close);
        previousButton?.addEventListener('click', () => showProject(currentIndex - 1));
        nextButton?.addEventListener('click', () => showProject(currentIndex + 1));

        projectLightbox.addEventListener('click', (event) => {
            if (event.target === projectLightbox) close();
        });

        document.addEventListener('keydown', (event) => {
            if (projectLightbox.hidden) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                close();
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showProject(currentIndex - 1);
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                showProject(currentIndex + 1);
                return;
            }

            if (event.key !== 'Tab') return;

            const focusableElements = [...projectLightbox.querySelectorAll('button:not([disabled]), a[href]')];
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        });
    }

    function initModal() {
        if (!successModal) return { open: () => {} };

        const modalContent = successModal.querySelector('.modal-content');
        const closeButtons = [
            document.getElementById('modalCloseBtn'),
            document.getElementById('modalOkBtn')
        ].filter(Boolean);
        let previouslyFocusedElement = null;
        let hideTimer = null;

        function open() {
            if (hideTimer !== null) window.clearTimeout(hideTimer);

            previouslyFocusedElement = document.activeElement;
            successModal.hidden = false;
            successModal.setAttribute('aria-hidden', 'false');
            window.requestAnimationFrame(() => {
                successModal.classList.add('active');
                modalContent?.focus();
            });
            syncPageScrollLock();
        }

        function close() {
            successModal.classList.remove('active');
            successModal.setAttribute('aria-hidden', 'true');
            syncPageScrollLock();

            hideTimer = window.setTimeout(() => {
                successModal.hidden = true;
                syncPageScrollLock();
            }, 300);

            if (previouslyFocusedElement instanceof HTMLElement) {
                previouslyFocusedElement.focus();
            }
        }

        closeButtons.forEach((button) => button.addEventListener('click', close));

        successModal.addEventListener('click', (event) => {
            if (event.target === successModal) close();
        });

        successModal.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                close();
                return;
            }

            if (event.key !== 'Tab') return;

            const focusableElements = [...successModal.querySelectorAll('button:not([disabled]), a[href]')];
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        });

        return { open, close };
    }

    function initContactForm(openSuccessModal) {
        const contactForm = document.getElementById('contactForm');
        const submitButton = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');
        if (!contactForm || !submitButton || !formStatus) return;

        const fields = [...contactForm.querySelectorAll('input, textarea')];
        let isSubmitting = false;

        function setFieldError(field, message = '') {
            const errorElement = document.getElementById(`${field.id}Error`);
            field.classList.toggle('input-error', Boolean(message));

            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.toggle('visible', Boolean(message));
            }
        }

        fields.forEach((field) => {
            field.addEventListener('invalid', () => setFieldError(field, field.validationMessage));
            field.addEventListener('input', () => setFieldError(field));
        });

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (isSubmitting || !contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            isSubmitting = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            submitButton.disabled = true;
            submitButton.classList.add('loading');

            const requestBody = {
                name: contactForm.elements.name.value.trim(),
                email: contactForm.elements.email.value.trim(),
                website: contactForm.elements.website.value.trim(),
                message: contactForm.elements.message.value.trim()
            };

            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                contactForm.reset();
                fields.forEach((field) => setFieldError(field));
                openSuccessModal();
            } catch {
                formStatus.textContent = 'Your message could not be sent. Please try again.';
                formStatus.classList.add('error');
            } finally {
                isSubmitting = false;
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mainNav?.classList.contains('open')) {
            closeMobileMenu();
            menuToggle?.focus();
        }
    });

    initNavigation();
    initHeroSlider();
    initSkillBars();
    initProjectFilters();
    initProjectLightbox();
    initTestimonials();

    const modalController = initModal();
    initContactForm(modalController.open);
});
