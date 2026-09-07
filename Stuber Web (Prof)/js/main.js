/* =========================================================
   STUBER.WEB — MAIN
   Application entry point
   ========================================================= */

(() => {
    "use strict";

    /**
     * STUBER.WEB
     * Main application controller
     *
     * Responsabilidades:
     * - Inicializar la aplicación
     * - Controlar el estado de carga
     * - Inicializar módulos independientes
     * - Gestionar errores de runtime durante desarrollo
     * - Exponer información mínima de diagnóstico
     */

    const App = {

        /* -------------------------------------------------
           STATE
           ------------------------------------------------- */

        state: {
            loaded: false,
            domReady: false
        },


        /* -------------------------------------------------
           INITIALIZATION
           ------------------------------------------------- */

        init() {

            if (this.state.domReady) {
                return;
            }

            this.state.domReady = true;

            document.documentElement.classList.add("js-enabled");

            this.bindGlobalEvents();
            this.initializeModules();
        },


        /* -------------------------------------------------
           MODULE INITIALIZATION
           ------------------------------------------------- */

        initializeModules() {

            /*
             * Cada módulo se inicializa de forma independiente.
             * Si uno falla, los demás continúan funcionando.
             */

            this.safeInit("Navigation", () => {
                window.StuberNavigation?.init?.();
            });

            this.safeInit("Animations", () => {
                window.StuberAnimations?.init?.();
            });

            this.safeInit("Cursor", () => {
                window.StuberCursor?.init?.();
            });

            this.safeInit("Contact", () => {
                window.StuberContact?.init?.();
            });

            /*
             * Projects es opcional.
             * data/projects.js puede no estar disponible
             * durante determinadas fases del desarrollo.
             */

            this.safeInit("Projects", () => {
                window.StuberProjects?.init?.();
            });
        },


        /* -------------------------------------------------
           GLOBAL EVENTS
           ------------------------------------------------- */

        bindGlobalEvents() {

            /*
             * Los errores solamente se registran durante
             * desarrollo local.
             *
             * No mostramos información técnica al visitante.
             */

            if (
                window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1"
            ) {

                window.addEventListener("error", (event) => {
                    this.handleError(event.error || event.message);
                });

                window.addEventListener("unhandledrejection", (event) => {
                    this.handleError(event.reason);
                });
            }


            /*
             * Esperamos a que todos los recursos principales
             * terminen de cargar antes de finalizar el estado
             * de carga de la aplicación.
             */

            if (document.readyState === "complete") {

                this.setLoadedState();

            } else {

                window.addEventListener(
                    "load",
                    () => this.setLoadedState(),
                    { once: true }
                );
            }
        },


        /* -------------------------------------------------
           LOADING STATE
           ------------------------------------------------- */

        setLoadedState() {

            if (this.state.loaded) {
                return;
            }

            this.state.loaded = true;

            document.documentElement.classList.add("is-loaded");
            document.body.classList.add("is-loaded");


            /*
             * Dejamos que la transición del preloader
             * se ejecute antes de eliminarlo del DOM.
             */

            window.setTimeout(() => {

                const preloader =
                    document.getElementById("preloader");

                if (!preloader) {
                    return;
                }

                preloader.classList.add("is-hidden");


                /*
                 * Eliminamos completamente el preloader
                 * después de su transición.
                 */

                window.setTimeout(() => {

                    if (preloader.isConnected) {
                        preloader.remove();
                    }

                }, 800);

            }, 250);
        },


        /* -------------------------------------------------
           SAFE MODULE INITIALIZATION
           ------------------------------------------------- */

        safeInit(name, callback) {

            try {

                callback();

            } catch (error) {

                /*
                 * Los errores de módulos no deberían
                 * detener el resto de la aplicación.
                 */

                if (
                    window.location.hostname === "localhost" ||
                    window.location.hostname === "127.0.0.1"
                ) {

                    console.error(
                        `[STUBER.WEB] Error inicializando ${name}:`,
                        error
                    );
                }
            }
        },


        /* -------------------------------------------------
           ERROR HANDLING
           ------------------------------------------------- */

        handleError(error) {

            /*
             * Los errores técnicos solamente se muestran
             * durante desarrollo local.
             */

            if (
                window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1"
            ) {

                console.error(
                    "[STUBER.WEB] Runtime error:",
                    error
                );
            }
        },


        /* -------------------------------------------------
           PUBLIC API
           ------------------------------------------------- */

        getState() {
            return {
                ...this.state
            };
        }
    };


    /* -----------------------------------------------------
       PUBLIC GLOBAL
       ----------------------------------------------------- */

    window.StuberApp = App;


    /* -----------------------------------------------------
       DOM READY
       ----------------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            () => App.init(),
            { once: true }
        );

    } else {

        App.init();
    }

})();