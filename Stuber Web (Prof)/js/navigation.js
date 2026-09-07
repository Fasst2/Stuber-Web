/* =========================================================
   STUBER.WEB — NAVIGATION
   Header, menu, smooth scroll and mobile navigation
   ========================================================= */

(() => {
    "use strict";

    const Navigation = {

        /* -------------------------------------------------
           ELEMENTS
           ------------------------------------------------- */

        elements: {
            header: null,
            menuToggle: null,
            mobileMenu: null,
            mobileLinks: [],
            navLinks: [],
            sections: []
        },


        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        state: {
            menuOpen: false,
            currentSection: ""
        },


        /* -------------------------------------------------
           INITIALIZATION
           ------------------------------------------------- */

        init() {

            this.cacheElements();

            /*
             * Si el header o el botón del menú no existen,
             * no intentamos continuar.
             */

            if (!this.elements.header) {
                return;
            }

            this.bindEvents();
            this.updateHeader();
            this.updateActiveLink();

        },


        /* -------------------------------------------------
           CACHE DOM ELEMENTS
           ------------------------------------------------- */

        cacheElements() {

            this.elements.header =
                document.getElementById("siteHeader");

            this.elements.menuToggle =
                document.getElementById("menuToggle");

            this.elements.mobileMenu =
                document.getElementById("mobileMenu");

            this.elements.navLinks =
                Array.from(
                    document.querySelectorAll(
                        '.site-header__nav a[href^="#"]'
                    )
                );

            this.elements.mobileLinks =
                Array.from(
                    document.querySelectorAll(
                        '.mobile-menu a[href^="#"]'
                    )
                );

            this.elements.sections =
                Array.from(
                    document.querySelectorAll(
                        "main section[id]"
                    )
                );
        },


        /* -------------------------------------------------
           EVENTS
           ------------------------------------------------- */

        bindEvents() {

            /*
             * Header al hacer scroll
             */

            window.addEventListener(
                "scroll",
                () => {
                    this.updateHeader();
                    this.updateActiveLink();
                },
                { passive: true }
            );


            /*
             * Menú móvil
             */

            if (this.elements.menuToggle) {

                this.elements.menuToggle.addEventListener(
                    "click",
                    () => this.toggleMobileMenu()
                );
            }


            /*
             * Links desktop
             */

            this.elements.navLinks.forEach(link => {

                link.addEventListener(
                    "click",
                    event => this.handleAnchorClick(event)
                );

            });


            /*
             * Links mobile
             */

            this.elements.mobileLinks.forEach(link => {

                link.addEventListener(
                    "click",
                    event => {

                        this.handleAnchorClick(event);
                        this.closeMobileMenu();

                    }
                );

            });


            /*
             * Cerrar menú al pulsar Escape
             */

            document.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Escape") {
                        this.closeMobileMenu();
                    }

                }
            );


            /*
             * Si cambia el tamaño de pantalla y volvemos
             * al desktop, cerramos el menú móvil.
             */

            window.addEventListener(
                "resize",
                () => {

                    if (window.innerWidth > 900) {
                        this.closeMobileMenu();
                    }

                },
                { passive: true }
            );
        },


        /* -------------------------------------------------
           HEADER
           ------------------------------------------------- */

        updateHeader() {

            if (!this.elements.header) {
                return;
            }

            const scrollPosition = window.scrollY;

            /*
             * A partir de 40px agregamos la clase .scrolled.
             * Esa clase ya está preparada en components.css.
             */

            if (scrollPosition > 40) {

                this.elements.header.classList.add("scrolled");

            } else {

                this.elements.header.classList.remove("scrolled");

            }
        },


        /* -------------------------------------------------
           MOBILE MENU
           ------------------------------------------------- */

        toggleMobileMenu() {

            if (this.state.menuOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        },


        openMobileMenu() {

            if (!this.elements.mobileMenu) {
                return;
            }

            this.state.menuOpen = true;

            this.elements.mobileMenu.classList.add("is-open");

            document.body.classList.add("menu-open");

            if (this.elements.menuToggle) {

                this.elements.menuToggle.classList.add("is-active");

                this.elements.menuToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }

        },


        closeMobileMenu() {

            if (!this.elements.mobileMenu) {
                return;
            }

            this.state.menuOpen = false;

            this.elements.mobileMenu.classList.remove("is-open");

            document.body.classList.remove("menu-open");

            if (this.elements.menuToggle) {

                this.elements.menuToggle.classList.remove("is-active");

                this.elements.menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        },


        /* -------------------------------------------------
           ANCHOR LINKS
           ------------------------------------------------- */

        handleAnchorClick(event) {

            const link = event.currentTarget;

            if (!link) {
                return;
            }

            const href = link.getAttribute("href");

            /*
             * Ignoramos links que no sean anclas.
             */

            if (!href || !href.startsWith("#")) {
                return;
            }

            const targetId = href.substring(1);

            /*
             * Caso especial:
             * href="#" vuelve simplemente al inicio.
             */

            if (!targetId) {

                event.preventDefault();

                this.scrollToPosition(0);

                return;
            }

            const target =
                document.getElementById(targetId);

            /*
             * Si el elemento no existe, dejamos que el navegador
             * maneje el comportamiento normal.
             */

            if (!target) {
                return;
            }

            event.preventDefault();

            this.scrollToElement(target);
        },


        /* -------------------------------------------------
           SMOOTH SCROLL
           ------------------------------------------------- */

        scrollToElement(element) {

            if (!element) {
                return;
            }

            const headerHeight =
                this.elements.header
                    ? this.elements.header.offsetHeight
                    : 0;

            /*
             * Separación adicional para que el título de la
             * sección no quede pegado al header.
             */

            const extraOffset = 20;

            const elementPosition =
                element.getBoundingClientRect().top +
                window.scrollY;

            const targetPosition =
                elementPosition -
                headerHeight -
                extraOffset;

            this.scrollToPosition(
                Math.max(0, targetPosition)
            );
        },


        scrollToPosition(position) {

            window.scrollTo({
                top: position,
                behavior: this.supportsSmoothScroll()
                    ? "smooth"
                    : "auto"
            });
        },


        /* -------------------------------------------------
           ACTIVE NAVIGATION LINK
           ------------------------------------------------- */

        updateActiveLink() {

            if (!this.elements.sections.length) {
                return;
            }

            const scrollPosition =
                window.scrollY +
                window.innerHeight * 0.35;

            let currentSection = "";

            this.elements.sections.forEach(section => {

                const sectionTop =
                    section.offsetTop;

                const sectionBottom =
                    sectionTop +
                    section.offsetHeight;

                if (
                    scrollPosition >= sectionTop &&
                    scrollPosition < sectionBottom
                ) {

                    currentSection = section.id;

                }

            });

            /*
             * Si todavía no estamos dentro de una sección,
             * usamos la primera.
             */

            if (!currentSection) {

                if (window.scrollY < 200) {
                    currentSection = "inicio";
                }
            }

            if (
                currentSection &&
                currentSection !== this.state.currentSection
            ) {

                this.state.currentSection =
                    currentSection;

                this.setActiveLink(currentSection);
            }
        },


        setActiveLink(sectionId) {

            const allLinks = [
                ...this.elements.navLinks,
                ...this.elements.mobileLinks
            ];

            allLinks.forEach(link => {

                const href =
                    link.getAttribute("href");

                const isActive =
                    href === `#${sectionId}`;

                link.classList.toggle(
                    "active",
                    isActive
                );

                if (isActive) {

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );

                } else {

                    link.removeAttribute(
                        "aria-current"
                    );
                }

            });
        },


        /* -------------------------------------------------
           ACCESSIBILITY
           ------------------------------------------------- */

        supportsSmoothScroll() {

            return "scrollBehavior" in document.documentElement.style;
        },


        /* -------------------------------------------------
           PUBLIC API
           ------------------------------------------------- */

        getCurrentSection() {

            return this.state.currentSection;
        },


        isMenuOpen() {

            return this.state.menuOpen;
        }
    };


    /* -----------------------------------------------------
       PUBLIC GLOBAL
       ----------------------------------------------------- */

    window.StuberNavigation = Navigation;


    /* -----------------------------------------------------
       INITIALIZE
       ----------------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            () => Navigation.init(),
            { once: true }
        );

    } else {

        Navigation.init();
    }

})();