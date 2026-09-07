/* =========================================================
   STUBER.WEB — PROJECT DATA
   ========================================================= */

(() => {
    "use strict";

    /*
     * Punto de extensión para el portfolio.
     *
     * Ejemplo:
     * {
     *   title: "Nombre del proyecto",
     *   category: "Landing page",
     *   description: "Descripción breve",
     *   url: "https://...",
     *   image: "assets/projects/proyecto.webp"
     * }
     */

    const projects = [];

    window.StuberProjects = {
        init() {
            const grid = document.getElementById("projectsGrid");

            if (!grid || !projects.length) {
                return;
            }

            // La implementación visual de proyectos puede crecer
            // sin modificar el resto de la aplicación.
        },

        getAll() {
            return [...projects];
        }
    };
})();
