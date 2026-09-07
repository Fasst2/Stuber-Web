document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       SMOOTH SCROLL
    ================================= */

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


    /* ================================
       DAYS
    ================================= */

    document
        .querySelectorAll(".day")
        .forEach(day => {

            day.addEventListener("click", () => {

                document
                    .querySelectorAll(".day")
                    .forEach(item => {
                        item.classList.remove("active");
                    });

                day.classList.add("active");

            });

        });


    /* ================================
       TIMES
    ================================= */

    document
        .querySelectorAll(".times button")
        .forEach(time => {

            time.addEventListener("click", () => {

                document
                    .querySelectorAll(".times button")
                    .forEach(item => {
                        item.classList.remove("selected");
                    });

                time.classList.add("selected");

            });

        });


    /* ================================
       CONFIRM
    ================================= */

    const confirm =
        document.getElementById("confirm");

    const message =
        document.getElementById("message");


    confirm?.addEventListener("click", () => {

        const selectedTime =
            document.querySelector(
                ".times .selected"
            );

        const selectedDay =
            document.querySelector(
                ".day.active"
            );


        if (!selectedTime) {

            message.textContent =
                "Elegí primero un horario disponible.";

            return;
        }


        message.textContent =
            `Demo: turno seleccionado para ${
                selectedDay.textContent.replace(/\s+/g, " ")
            } a las ${
                selectedTime.textContent
            }.`;

    });

});