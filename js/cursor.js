/* =========================================================
   STUBER.WEB — CUSTOM CURSOR
   Custom cursor and interactive hover states
   ========================================================= */

(() => {
    "use strict";

    const Cursor = {

        /* -------------------------------------------------
           ELEMENTS
           ------------------------------------------------- */

        elements: {
            cursor: null,
            dot: null
        },


        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        state: {
            initialized: false,
            enabled: false,
            visible: false,
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            hovering: false,
            rafId: null,
            animating: false
        },


        /* -------------------------------------------------
           INITIALIZATION
           ------------------------------------------------- */

        init() {

            if (this.state.initialized) {
                return;
            }

            this.state.initialized = true;


            /*
             * El cursor personalizado solamente tiene sentido
             * en dispositivos con mouse/puntero preciso.
             */

            if (!this.isMouseDevice()) {
                return;
            }


            this.cacheElements();


            if (!this.elements.cursor) {
                return;
            }


            this.state.enabled = true;

            this.bindEvents();
        },


        /* -------------------------------------------------
           DEVICE DETECTION
           ------------------------------------------------- */

        isMouseDevice() {

            return (
                window.matchMedia &&
                window.matchMedia(
                    "(hover: hover) and (pointer: fine)"
                ).matches
            );
        },


        /* -------------------------------------------------
           CACHE DOM
           ------------------------------------------------- */

        cacheElements() {

            this.elements.cursor =
                document.getElementById("cursor");


            if (this.elements.cursor) {

                this.elements.dot =
                    this.elements.cursor.querySelector(
                        ".cursor__dot"
                    );
            }
        },


        /* -------------------------------------------------
           EVENTS
           ------------------------------------------------- */

        bindEvents() {

            /*
             * Movimiento del mouse.
             *
             * No hacemos trabajo visual directamente dentro
             * del evento. Solo actualizamos la posición objetivo
             * y activamos el frame de animación.
             */

            window.addEventListener(
                "mousemove",
                event => {

                    this.state.targetX =
                        event.clientX;

                    this.state.targetY =
                        event.clientY;

                    this.show();
                    this.startAnimation();

                },
                {
                    passive: true
                }
            );


            /*
             * Cuando el mouse abandona la ventana.
             */

            document.addEventListener(
                "mouseleave",
                () => this.hide()
            );


            /*
             * Cuando vuelve a entrar.

             * No iniciamos la animación hasta recibir
             * nuevamente movimiento del mouse.
             */

            document.addEventListener(
                "mouseenter",
                () => this.show()
            );


            /*
             * Elementos interactivos.
             */

            this.bindInteractiveElements();


            /*
             * Contenido generado dinámicamente.
             */

            window.addEventListener(
                "stuber:content-updated",
                () => this.bindInteractiveElements()
            );
        },


        /* -------------------------------------------------
           INTERACTIVE ELEMENTS
           ------------------------------------------------- */

        bindInteractiveElements() {

            const interactiveElements =
                document.querySelectorAll(
                    "a, button, input, textarea, select, " +
                    "[role='button'], .magnetic, " +
                    ".project-card, .service-item, " +
                    ".stack-item"
                );


            interactiveElements.forEach(element => {

                /*
                 * Evitamos registrar los mismos listeners
                 * más de una vez.
                 */

                if (
                    element.dataset.cursorBound === "true"
                ) {
                    return;
                }


                element.dataset.cursorBound = "true";


                element.addEventListener(
                    "mouseenter",
                    () => this.enterInteractive()
                );


                element.addEventListener(
                    "mouseleave",
                    () => this.leaveInteractive()
                );
            });
        },


        /* -------------------------------------------------
           CURSOR VISIBILITY
           ------------------------------------------------- */

        show() {

            if (!this.state.enabled) {
                return;
            }


            if (this.state.visible) {
                return;
            }


            this.state.visible = true;


            this.elements.cursor.classList.add(
                "is-visible"
            );
        },


        hide() {

            if (!this.elements.cursor) {
                return;
            }


            this.state.visible = false;


            this.elements.cursor.classList.remove(
                "is-visible"
            );


            this.leaveInteractive();
        },


        /* -------------------------------------------------
           INTERACTIVE STATE
           ------------------------------------------------- */

        enterInteractive() {

            if (!this.state.enabled) {
                return;
            }


            if (this.state.hovering) {
                return;
            }


            this.state.hovering = true;


            this.elements.cursor.classList.add(
                "is-hovering"
            );
        },


        leaveInteractive() {

            if (!this.elements.cursor) {
                return;
            }


            this.state.hovering = false;


            this.elements.cursor.classList.remove(
                "is-hovering"
            );
        },


        /* -------------------------------------------------
           ANIMATION
           ------------------------------------------------- */

        startAnimation() {

            if (
                !this.state.enabled ||
                this.state.animating
            ) {
                return;
            }


            this.state.animating = true;


            const animate = () => {

                const dx =
                    this.state.targetX -
                    this.state.x;

                const dy =
                    this.state.targetY -
                    this.state.y;


                /*
                 * Interpolación suave.
                 */

                this.state.x += dx * 0.18;
                this.state.y += dy * 0.18;


                this.elements.cursor.style.transform =
                    `translate3d(` +
                    `${this.state.x}px, ` +
                    `${this.state.y}px, 0)`;


                /*
                 * Si ya estamos prácticamente en la posición
                 * objetivo, detenemos completamente el loop.
                 */

                if (
                    Math.abs(dx) < 0.1 &&
                    Math.abs(dy) < 0.1
                ) {

                    this.state.x =
                        this.state.targetX;

                    this.state.y =
                        this.state.targetY;


                    this.elements.cursor.style.transform =
                        `translate3d(` +
                        `${this.state.x}px, ` +
                        `${this.state.y}px, 0)`;


                    this.state.animating = false;
                    this.state.rafId = null;

                    return;
                }


                this.state.rafId =
                    window.requestAnimationFrame(
                        animate
                    );
            };


            this.state.rafId =
                window.requestAnimationFrame(
                    animate
                );
        },


        /* -------------------------------------------------
           PUBLIC API
           ------------------------------------------------- */

        refresh() {

            if (!this.state.enabled) {
                return;
            }


            this.bindInteractiveElements();
        },


        destroy() {

            if (this.state.rafId !== null) {

                window.cancelAnimationFrame(
                    this.state.rafId
                );

                this.state.rafId = null;
            }


            this.state.animating = false;
            this.state.enabled = false;
            this.state.visible = false;
            this.state.hovering = false;


            if (this.elements.cursor) {

                this.elements.cursor.classList.remove(
                    "is-visible",
                    "is-hovering"
                );
            }
        }
    };


    /* -----------------------------------------------------
       PUBLIC GLOBAL
       ----------------------------------------------------- */

    window.StuberCursor = Cursor;


    /* -----------------------------------------------------
       INITIALIZE
       ----------------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            () => Cursor.init(),
            {
                once: true
            }
        );

    } else {

        Cursor.init();
    }

})();