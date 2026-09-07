/* =========================================================
   STUBER.WEB — ANIMATIONS
   Scroll reveals, hero entrance and subtle interactions
   ========================================================= */

(() => {
    "use strict";

    const Animations = {

        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        state: {
            initialized: false,
            reducedMotion: false,
            observer: null,
            ticking: false,
            parallaxElements: [],
            parallaxEnabled: false
        },


        /* -------------------------------------------------
           INITIALIZATION
           ------------------------------------------------- */

        init() {

            if (this.state.initialized) {
                return;
            }

            this.state.initialized = true;

            this.detectReducedMotion();

            /*
             * Si el usuario pidió reducir movimiento,
             * mantenemos todos los contenidos visibles
             * sin ejecutar animaciones innecesarias.
             */

            if (this.state.reducedMotion) {
                this.prepareReducedMotion();
                return;
            }

            this.prepareRevealElements();
            this.initRevealObserver();
            this.initHeroEntrance();
            this.initParallax();
            this.initMarqueePause();
        },


        /* -------------------------------------------------
           REDUCED MOTION
           ------------------------------------------------- */

        detectReducedMotion() {

            if (!window.matchMedia) {
                this.state.reducedMotion = false;
                return;
            }

            this.state.reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;
        },


        prepareReducedMotion() {

            document
                .querySelectorAll(
                    "[data-reveal], [data-animate]"
                )
                .forEach(element => {

                    element.classList.add("is-visible");

                });


            const hero =
                document.querySelector(".hero");

            if (hero) {
                hero.classList.add("is-ready");
            }
        },


        /* -------------------------------------------------
           REVEAL ELEMENTS
           ------------------------------------------------- */

        prepareRevealElements() {

            const selectors = [
                ".section-heading",
                ".about__intro",
                ".about__details",
                ".service-item",
                ".project-card",
                ".stack-item",
                ".process-step",
                ".contact__content"
            ];


            selectors.forEach(selector => {

                document
                    .querySelectorAll(selector)
                    .forEach(element => {

                        element.dataset.reveal = "";

                    });

            });


            /*
             * Stagger visual.
             *
             * Limitamos el retraso máximo para evitar que
             * una sección grande tarde demasiado en aparecer.
             */

            document
                .querySelectorAll(
                    ".service-item, .project-card, .stack-item, .process-step"
                )
                .forEach((element, index) => {

                    const delay =
                        Math.min(index * 60, 360);

                    element.style.setProperty(
                        "--reveal-delay",
                        `${delay}ms`
                    );

                });
        },


        /* -------------------------------------------------
           INTERSECTION OBSERVER
           ------------------------------------------------- */

        initRevealObserver() {

            if (!("IntersectionObserver" in window)) {

                document
                    .querySelectorAll("[data-reveal]")
                    .forEach(element => {

                        element.classList.add("is-visible");

                    });

                return;
            }


            this.state.observer =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(entry => {

                            if (!entry.isIntersecting) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            /*
                             * Ya apareció.
                             * No necesitamos seguir observándolo.
                             */

                            this.state.observer?.unobserve(
                                entry.target
                            );

                        });

                    },
                    {
                        threshold: 0.12,
                        rootMargin: "0px 0px -60px 0px"
                    }
                );


            document
                .querySelectorAll("[data-reveal]")
                .forEach(element => {

                    this.state.observer.observe(
                        element
                    );

                });
        },


        /* -------------------------------------------------
           HERO ENTRANCE
           ------------------------------------------------- */

        initHeroEntrance() {

            const hero =
                document.querySelector(".hero");

            if (!hero) {
                return;
            }


            /*
             * Esperamos un frame para permitir que el navegador
             * pinte el estado inicial antes de activar la entrada.
             */

            window.requestAnimationFrame(() => {

                window.setTimeout(() => {

                    hero.classList.add("is-ready");

                }, 100);

            });
        },


        /* -------------------------------------------------
           PARALLAX
           ------------------------------------------------- */

        initParallax() {

            /*
             * No ejecutamos parallax en dispositivos táctiles.
             */

            if (
                window.matchMedia &&
                window.matchMedia(
                    "(hover: none) and (pointer: coarse)"
                ).matches
            ) {
                return;
            }


            const elements =
                Array.from(
                    document.querySelectorAll(
                        "[data-parallax]"
                    )
                );


            if (!elements.length) {
                return;
            }


            this.state.parallaxElements =
                elements.map(element => ({

                    element,

                    speed:
                        Number(
                            element.dataset.parallax
                        ) || 0.08,

                    rect: null

                }));


            this.state.parallaxEnabled = true;


            /*
             * Actualizamos las posiciones de los elementos
             * solamente cuando cambia el viewport.
             */

            this.updateParallaxMeasurements();


            const requestUpdate = () => {

                if (
                    !this.state.parallaxEnabled ||
                    this.state.ticking
                ) {
                    return;
                }


                this.state.ticking = true;

                window.requestAnimationFrame(() => {

                    this.updateParallax();

                });
            };


            window.addEventListener(
                "scroll",
                requestUpdate,
                {
                    passive: true
                }
            );


            window.addEventListener(
                "resize",
                () => {

                    this.updateParallaxMeasurements();
                    requestUpdate();

                },
                {
                    passive: true
                }
            );


            /*
             * Primera actualización.
             */

            requestUpdate();
        },


        /* -------------------------------------------------
           PARALLAX MEASUREMENTS
           ------------------------------------------------- */

        updateParallaxMeasurements() {

            if (!this.state.parallaxElements.length) {
                return;
            }


            this.state.parallaxElements.forEach(item => {

                item.rect =
                    item.element.getBoundingClientRect();

            });
        },


        /* -------------------------------------------------
           PARALLAX UPDATE
           ------------------------------------------------- */

        updateParallax() {

            if (!this.state.parallaxElements.length) {

                this.state.ticking = false;
                return;
            }


            const viewportCenter =
                window.innerHeight / 2;


            this.state.parallaxElements.forEach(item => {

                if (!item.rect) {
                    return;
                }


                const rect =
                    item.rect;


                /*
                 * Si el elemento está muy lejos del viewport,
                 * no necesitamos modificarlo.
                 */

                if (
                    rect.bottom < -300 ||
                    rect.top > window.innerHeight + 300
                ) {
                    return;
                }


                const center =
                    rect.top +
                    rect.height / 2;


                const distance =
                    center -
                    viewportCenter;


                const movement =
                    distance *
                    item.speed;


                item.element.style.transform =
                    `translate3d(0, ${movement}px, 0)`;

            });


            this.state.ticking = false;
        },


        /* -------------------------------------------------
           MARQUEE
           ------------------------------------------------- */

        initMarqueePause() {

            const marquee =
                document.querySelector(".marquee");

            if (!marquee) {
                return;
            }


            /*
             * Pausar el movimiento cuando el usuario
             * coloca el mouse encima.
             */

            marquee.addEventListener(
                "mouseenter",
                () => {

                    marquee.classList.add(
                        "is-paused"
                    );

                }
            );


            marquee.addEventListener(
                "mouseleave",
                () => {

                    marquee.classList.remove(
                        "is-paused"
                    );

                }
            );
        },


        /* -------------------------------------------------
           PUBLIC API
           ------------------------------------------------- */

        refresh() {

            if (this.state.reducedMotion) {
                return;
            }


            if (this.state.observer) {

                document
                    .querySelectorAll(
                        "[data-reveal]:not(.is-visible)"
                    )
                    .forEach(element => {

                        this.state.observer.observe(
                            element
                        );

                    });
            }


            /*
             * Si existen elementos con parallax,
             * actualizamos sus mediciones.
             */

            if (this.state.parallaxEnabled) {

                this.updateParallaxMeasurements();

            }
        }

    };


    /* -----------------------------------------------------
       PUBLIC GLOBAL
       ----------------------------------------------------- */

    window.StuberAnimations = Animations;


    /* -----------------------------------------------------
       INITIALIZE
       ----------------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            () => Animations.init(),
            {
                once: true
            }
        );

    } else {

        Animations.init();

    }

})();