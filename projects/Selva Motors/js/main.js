document.addEventListener("DOMContentLoaded", () => {

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const target =
                    document.querySelector(
                        link.getAttribute("href")
                    );

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            });

        });


    const menu =
        document.querySelector(".menu");

    const nav =
        document.querySelector(".nav nav");


    menu?.addEventListener("click", () => {

        nav.classList.toggle("open");

    });

});