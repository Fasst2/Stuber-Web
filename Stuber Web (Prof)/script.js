/* =========================================================
   STUBER.WEB
   JavaScript principal
========================================================= */


/* =========================================================
   HEADER — CAMBIO AL HACER SCROLL
========================================================= */

const header =
    document.getElementById("header");


function updateHeader() {

    if (!header) return;

    if (window.scrollY > 30) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    updateHeader
);


updateHeader();


/* =========================================================
   MENÚ MOBILE
========================================================= */

const menuButton =
    document.getElementById("menuButton");

const nav =
    document.querySelector(".nav");


if (menuButton && nav) {

    menuButton.addEventListener(
        "click",
        () => {

            nav.classList.toggle(
                "mobile-open"
            );

        }
    );


    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove(
                        "mobile-open"
                    );

                }
            );

        });

}


/* =========================================================
   AÑO AUTOMÁTICO
========================================================= */

const year =
    document.getElementById("year");


if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =========================================================
   ANIMACIONES AL ENTRAR EN PANTALLA
========================================================= */

const animatedElements =
    document.querySelectorAll(
        ".service-card, .difference-item, .process-item, .about-grid, .cta-box"
    );


animatedElements.forEach(
    element => {

        element.classList.add(
            "reveal"
        );

    }
);


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


animatedElements.forEach(
    element => {

        observer.observe(
            element
        );

    }
);


/* =========================================================
   LINK ACTIVO DEL MENÚ
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );


const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        navLinks.forEach(
                            link => {

                                link.classList.remove(
                                    "active"
                                );

                                if (
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${entry.target.id}`
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                }

                            }
                        );

                    }

                }
            );

        },
        {
            rootMargin:
                "-35% 0px -55% 0px"
        }
    );


sections.forEach(
    section => {

        sectionObserver.observe(
            section
        );

    }
);


/* =========================================================
   EFECTO SUAVE EN BOTONES
========================================================= */

document
    .querySelectorAll(
        ".button"
    )
    .forEach(button => {

        button.addEventListener(
            "mouseenter",
            () => {

                button.style.transform =
                    "translateY(-2px)";

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.style.transform =
                    "translateY(0)";

            }
        );

    });


/* =========================================================
   LOG DE DESARROLLO
========================================================= */

console.log(
    "%cSTUBER.WEB",
    "color:#00a8ff;font-size:20px;font-weight:bold;"
);

console.log(
    "%cDesarrollo Web Freelance",
    "color:#d7dde5;font-size:12px;"
);