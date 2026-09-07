/* =========================================================
   STUBER.WEB — PROJECT DATA
   ========================================================= */

(() => {
    "use strict";

    const projects = [

        {
            id: "orbita-fintech",
            number: "01",
            title: "Órbita Fintech",
            category: "Fintech · Landing Page",
            description:
                "Landing page tecnológica para una plataforma fintech, enfocada en transmitir seguridad, innovación y confianza.",
            image: "projects/01-orbita-fintech/assets/hero-orbita.svg",
            url: "projects/01-orbita-fintech/index.html",
            tags: ["Diseño UI", "Frontend", "Responsive"]
        },

        {
            id: "casa-lume",
            number: "02",
            title: "Casa Lume",
            category: "Gastronomía · Sitio Web",
            description:
                "Experiencia web elegante para un restaurante, combinando identidad visual, fotografía, menú y sistema de reservas.",
            image: "projects/02-casa-lume/assets/hero-lume.svg",
            url: "projects/02-casa-lume/index.html",
            tags: ["Branding", "Web Design", "Responsive"]
        },

                {
            id: "vanta-architecture",
            number: "03",
            title: "Vanta Architecture",
            category: "Arquitectura · Portfolio",
            description:
                "Portfolio editorial para un estudio de arquitectura, pensado para destacar proyectos, espacios y una identidad visual sofisticada.",
            image: "projects/03-vanta-architecture/assets/hero-vanta.svg",
            url: "projects/03-vanta-architecture/index.html",
            tags: ["Editorial", "Portfolio", "Frontend"]
        },

        {
            id: "selva-motors",
            number: "04",
            title: "Selva Motors",
            category: "Automotriz · Concesionaria",
            description:
                "Sitio web premium para una concesionaria de Posadas, con vehículos destacados, financiación y contacto comercial.",
            image: "projects/Selva Motors/assets/hero-selva.svg",
            url: "projects/Selva Motors/index.html",
            tags: ["UI Design", "Frontend", "Responsive"]
        },

        {
            id: "leo-barber",
            number: "05",
            title: "Leo Barber",
            category: "Barbería · Turnos Online",
            description:
                "Experiencia digital para una barbería de Posadas, con servicios, disponibilidad y un flujo de reserva de turnos.",
            image: "projects/Leo Barber/assets/hero-leo.svg",
            url: "projects/Leo Barber/index.html",
            tags: ["UX/UI", "Booking", "Responsive"]
        }

    ];


    function createProjectCard(project) {

        const article = document.createElement("article");

        article.className = "project-card";

        article.innerHTML = `

            <a
                href="${project.url}"
                class="project-card__link"
                aria-label="Ver proyecto ${project.title}"
            >

                <div class="project-card__image">

                    <img
                        src="${project.image}"
                        alt="Vista previa del proyecto ${project.title}"
                        loading="lazy"
                    >

                    <span class="project-card__view">
                        Ver proyecto ↗
                    </span>

                </div>


                <div class="project-card__content">

                    <div class="project-card__meta">

                        <span class="project-card__number">
                            ${project.number}
                        </span>

                        <span class="project-card__category">
                            ${project.category}
                        </span>

                    </div>


                    <h3 class="project-card__title">
                        ${project.title}
                    </h3>


                    <p class="project-card__description">
                        ${project.description}
                    </p>


                    <div class="project-card__tags">

                        ${project.tags
                            .map(tag => `<span>${tag}</span>`)
                            .join("")}

                    </div>

                </div>

            </a>

        `;

        return article;
    }


    function init() {

        const grid = document.getElementById("projectsGrid");

        if (!grid) {
            return;
        }

        grid.innerHTML = "";

        projects.forEach(project => {

            const card = createProjectCard(project);

            grid.appendChild(card);

        });

    }


    window.StuberProjects = {

        init,

        getAll() {
            return [...projects];
        }

    };


    /*
     * Inicializamos cuando el DOM está disponible.
     */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();