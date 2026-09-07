/* =========================================================
   STUBER.WEB — CONTACT
   Formulario de proyecto
   ========================================================= */

(() => {

    "use strict";


    const CONFIG = {

        formEndpoint:
            "https://api.web3forms.com/submit",

        // MANTENÉ ACÁ TU MISMA ACCESS KEY ACTUAL
        accessKey:
            "bd83eb98-6955-4905-840a-cec41d924dd1",

        totalSteps: 7,

        requestTimeout: 15000

    };


    const Contact = {

        /* =====================================================
           STATE
           ===================================================== */

        state: {

            initialized: false,

            isOpen: false,

            isSending: false,

            currentStep: 1

        },


        /* =====================================================
           ELEMENTS
           ===================================================== */

        elements: {

            modal: null,

            form: null,

            steps: [],

            openTriggers: [],

            closeTriggers: [],

            next: null,

            back: null,

            submit: null,

            progress: null,

            stepLabel: null,

            stepPercent: null,

            navigation: null,

            error: null,

            summary: null,

            summaryContent: null,

            success: null,

            hasWebsite: [],

            existingWebsiteField: null,

            existingWebsite: null

        },


        /* =====================================================
           INIT
           ===================================================== */

        init() {

            this.cacheElements();


            if (
                !this.elements.modal ||
                !this.elements.form
            ) {

                console.warn(
                    "[STUBER.WEB] No se encontró el formulario de proyecto."
                );

                return;
            }


            this.bindEvents();

            this.updateExistingWebsiteField();

            this.updateUI();


            this.state.initialized = true;


            console.log(
                "[STUBER.WEB] Formulario de proyecto inicializado correctamente."
            );

        },


        /* =====================================================
           CACHE
           ===================================================== */

        cacheElements() {

            this.elements.modal =
                document.getElementById(
                    "projectForm"
                );


            this.elements.form =
                document.getElementById(
                    "projectBriefForm"
                );


            this.elements.steps =
                Array.from(
                    document.querySelectorAll(
                        ".project-form__step"
                    )
                );


            this.elements.openTriggers =
                Array.from(
                    document.querySelectorAll(
                        "[data-contact-trigger]"
                    )
                );


            this.elements.closeTriggers =
                Array.from(
                    document.querySelectorAll(
                        "[data-form-close]"
                    )
                );


            this.elements.next =
                document.getElementById(
                    "formNext"
                );


            this.elements.back =
                document.getElementById(
                    "formBack"
                );


            this.elements.submit =
                document.getElementById(
                    "formSubmit"
                );


            this.elements.progress =
                document.getElementById(
                    "formProgressBar"
                );


            this.elements.stepLabel =
                document.getElementById(
                    "formStepLabel"
                );


            this.elements.stepPercent =
                document.getElementById(
                    "formProgressPercent"
                );


            this.elements.navigation =
                document.getElementById(
                    "projectFormNavigation"
                );


            this.elements.error =
                document.getElementById(
                    "projectFormError"
                );


            this.elements.summary =
                document.getElementById(
                    "projectFormSummary"
                );


            this.elements.summaryContent =
                document.getElementById(
                    "formSummaryContent"
                );


            this.elements.success =
                document.getElementById(
                    "projectFormSuccess"
                );


            /* =================================================
               PÁGINA WEB EXISTENTE
               ================================================= */

            this.elements.hasWebsite =
                Array.from(
                    document.querySelectorAll(
                        'input[name="hasWebsite"]'
                    )
                );


            this.elements.existingWebsiteField =
                document.getElementById(
                    "existingWebsiteField"
                );


            this.elements.existingWebsite =
                document.getElementById(
                    "existingWebsite"
                );

        },


        /* =====================================================
           EVENTS
           ===================================================== */

        bindEvents() {

            this.elements.openTriggers.forEach(
                (trigger) => {

                    trigger.addEventListener(
                        "click",
                        (event) => {

                            event.preventDefault();

                            this.open();

                        }
                    );

                }
            );


            this.elements.closeTriggers.forEach(
                (trigger) => {

                    trigger.addEventListener(
                        "click",
                        (event) => {

                            event.preventDefault();

                            this.close();

                        }
                    );

                }
            );


            if (this.elements.next) {

                this.elements.next.addEventListener(
                    "click",
                    () => {

                        this.nextStep();

                    }
                );

            }


            if (this.elements.back) {

                this.elements.back.addEventListener(
                    "click",
                    () => {

                        this.previousStep();

                    }
                );

            }


            if (this.elements.form) {

                this.elements.form.addEventListener(
                    "submit",
                    (event) => {

                        event.preventDefault();

                        this.submitForm();

                    }
                );

            }


            /* =================================================
               PÁGINA WEB EXISTENTE
               ================================================= */

            this.elements.hasWebsite.forEach(
                (radio) => {

                    radio.addEventListener(
                        "change",
                        () => {

                            this.updateExistingWebsiteField();

                            this.clearError();

                        }
                    );

                }
            );


            document.addEventListener(
                "keydown",
                (event) => {

                    if (!this.state.isOpen) {
                        return;
                    }


                    if (
                        event.key === "Escape" &&
                        !this.state.isSending
                    ) {

                        this.close();

                    }

                }
            );


            if (this.elements.modal) {

                this.elements.modal.addEventListener(
                    "click",
                    (event) => {

                        if (
                            event.target ===
                                this.elements.modal &&
                            !this.state.isSending
                        ) {

                            this.close();

                        }

                    }
                );

            }

        },


        /* =====================================================
           PÁGINA WEB EXISTENTE
           ===================================================== */

        updateExistingWebsiteField() {

            const selected =
                this.elements.hasWebsite.find(
                    (radio) =>
                        radio.checked
                );


            if (!selected) {

                if (
                    this.elements.existingWebsiteField
                ) {

                    this.elements.existingWebsiteField.hidden =
                        true;

                }


                if (
                    this.elements.existingWebsite
                ) {

                    this.elements.existingWebsite.required =
                        false;

                }

                return;
            }


            const hasWebsite =
                selected.value === "Sí";


            if (
                this.elements.existingWebsiteField
            ) {

                this.elements.existingWebsiteField.hidden =
                    !hasWebsite;

            }


            if (
                this.elements.existingWebsite
            ) {

                this.elements.existingWebsite.required =
                    hasWebsite;


                if (!hasWebsite) {

                    this.elements.existingWebsite.value =
                        "";

                }

            }

        },


        /* =====================================================
           OPEN / CLOSE
           ===================================================== */

        open() {

            if (!this.elements.modal) {
                return;
            }


            if (this.state.isSending) {
                return;
            }


            this.state.isOpen =
                true;


            this.state.currentStep =
                1;


            this.elements.modal.classList.add(
                "is-open"
            );


            this.elements.modal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.classList.add(
                "form-is-open"
            );


            if (this.elements.form) {

                this.elements.form.style.display =
                    "";

            }


            if (this.elements.success) {

                this.elements.success.hidden =
                    true;


                this.elements.success.classList.remove(
                    "is-visible"
                );


                this.elements.success.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            if (this.elements.navigation) {

                this.elements.navigation.hidden =
                    false;

            }


            this.clearError();

            this.updateExistingWebsiteField();

            this.updateUI();


            window.setTimeout(
                () => {

                    this.focusCurrentStep();

                },
                100
            );

        },


        close() {

            if (!this.elements.modal) {
                return;
            }


            if (this.state.isSending) {
                return;
            }


            const wasSuccessful =
                this.elements.success &&
                !this.elements.success.hidden;


            this.state.isOpen =
                false;


            this.elements.modal.classList.remove(
                "is-open"
            );


            this.elements.modal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.classList.remove(
                "form-is-open"
            );


            if (wasSuccessful) {

                this.reset();

            }

        },


        /* =====================================================
           STEPS
           ===================================================== */

        nextStep() {

            if (this.state.isSending) {
                return;
            }


            if (!this.validateCurrentStep()) {
                return;
            }


            if (
                this.state.currentStep >=
                CONFIG.totalSteps
            ) {

                return;

            }


            this.state.currentStep +=
                1;


            this.clearError();

            this.updateUI();

            this.focusCurrentStep();

        },


        previousStep() {

            if (this.state.isSending) {
                return;
            }


            if (this.state.currentStep <= 1) {
                return;
            }


            this.state.currentStep -=
                1;


            this.clearError();

            this.updateUI();

            this.focusCurrentStep();

        },


        /* =====================================================
           UI
           ===================================================== */

        updateUI() {

            const currentStep =
                this.state.currentStep;


            const totalSteps =
                CONFIG.totalSteps;


            this.elements.steps.forEach(
                (step) => {

                    const stepNumber =
                        Number(
                            step.getAttribute(
                                "data-form-step"
                            )
                        );


                    const isActive =
                        stepNumber ===
                        currentStep;


                    step.classList.toggle(
                        "is-active",
                        isActive
                    );


                    step.hidden =
                        !isActive;


                    step.setAttribute(
                        "aria-hidden",
                        isActive
                            ? "false"
                            : "true"
                    );

                }
            );


            const progressPercentage =
                Math.round(
                    (
                        currentStep /
                        totalSteps
                    ) * 100
                );


            if (this.elements.progress) {

                this.elements.progress.style.width =
                    `${progressPercentage}%`;

            }


            if (this.elements.stepLabel) {

                this.elements.stepLabel.textContent =
                    `Paso ${currentStep} de ${totalSteps}`;

            }


            if (this.elements.stepPercent) {

                this.elements.stepPercent.textContent =
                    `${progressPercentage}%`;

            }


            if (this.elements.back) {

                this.elements.back.disabled =
                    currentStep === 1;

            }


            if (this.elements.next) {

                this.elements.next.hidden =
                    currentStep === totalSteps;

            }


            if (this.elements.submit) {

                this.elements.submit.hidden =
                    currentStep !== totalSteps;

            }


            if (this.elements.summary) {

                const showSummary =
                    currentStep === totalSteps;


                this.elements.summary.hidden =
                    !showSummary;


                this.elements.summary.setAttribute(
                    "aria-hidden",
                    showSummary
                        ? "false"
                        : "true"
                );


                if (showSummary) {

                    this.updateSummary();

                }

            }


            if (this.elements.navigation) {

                this.elements.navigation.hidden =
                    false;

            }

        },


        focusCurrentStep() {

            const activeStep =
                this.elements.steps.find(
                    (step) =>
                        Number(
                            step.getAttribute(
                                "data-form-step"
                            )
                        ) ===
                        this.state.currentStep
                );


            if (!activeStep) {
                return;
            }


            const firstField =
                activeStep.querySelector(
                    "input:not([type='hidden']), select, textarea, button"
                );


            if (firstField) {

                window.setTimeout(
                    () => {

                        firstField.focus();

                    },
                    50
                );

            }

        },


        /* =====================================================
           VALIDATION
           ===================================================== */

        validateCurrentStep() {

            const currentStep =
                this.elements.steps.find(
                    (step) =>
                        Number(
                            step.getAttribute(
                                "data-form-step"
                            )
                        ) ===
                        this.state.currentStep
                );


            if (!currentStep) {
                return true;
            }


            const requiredFields =
                Array.from(
                    currentStep.querySelectorAll(
                        "[required]"
                    )
                );


            const validatedRadioGroups =
                new Set();


            /* =================================================
               VALIDACIÓN ESPECIAL — PÁGINA WEB
               ================================================= */

            if (
                this.state.currentStep === 2
            ) {

                const selectedWebsite =
                    currentStep.querySelector(
                        'input[name="hasWebsite"]:checked'
                    );


                if (!selectedWebsite) {

                    this.showError(
                        "Completá todos los campos obligatorios marcados con * para continuar."
                    );


                    const firstRadio =
                        currentStep.querySelector(
                            'input[name="hasWebsite"]'
                        );


                    if (firstRadio) {
                        firstRadio.focus();
                    }


                    return false;

                }


                if (
                    selectedWebsite.value ===
                    "Sí"
                ) {

                    const websiteField =
                        this.elements.existingWebsite;


                    const websiteValue =
                        websiteField?.value
                            ?.trim() || "";


                    if (!websiteValue) {

                        this.showError(
                            "Completá todos los campos obligatorios marcados con * para continuar."
                        );


                        if (websiteField) {
                            websiteField.focus();
                        }


                        return false;

                    }


                    if (
                        !this.isValidURL(
                            websiteValue
                        )
                    ) {

                        this.showError(
                            "Ingresá una URL válida. Ejemplo: https://tusitio.com"
                        );


                        if (websiteField) {
                            websiteField.focus();
                        }


                        return false;

                    }

                }

            }


            /* =================================================
               CAMPOS REQUIRED
               ================================================= */

            for (
                const field of requiredFields
            ) {

                const type =
                    field.type?.toLowerCase();


                /* =============================================
                   RADIO
                   ============================================= */

                if (type === "radio") {

                    if (
                        validatedRadioGroups.has(
                            field.name
                        )
                    ) {

                        continue;

                    }


                    validatedRadioGroups.add(
                        field.name
                    );


                    const checked =
                        currentStep.querySelector(
                            `input[type="radio"][name="${CSS.escape(
                                field.name
                            )}"]:checked`
                        );


                    if (!checked) {

                        this.showError(
                            "Completá todos los campos obligatorios marcados con * para continuar."
                        );


                        field.focus();


                        return false;

                    }


                    continue;

                }


                /* =============================================
                   CHECKBOX
                   ============================================= */

                if (type === "checkbox") {

                    if (!field.checked) {

                        this.showError(
                            "Completá todos los campos obligatorios marcados con * para continuar."
                        );


                        field.focus();


                        return false;

                    }


                    continue;

                }


                /* =============================================
                   CAMPOS NORMALES
                   ============================================= */

                const value =
                    String(
                        field.value || ""
                    ).trim();


                if (!value) {

                    this.showError(
                        "Completá todos los campos obligatorios marcados con * para continuar."
                    );


                    field.focus();


                    return false;

                }

            }


            /* =================================================
               EMAIL
               ================================================= */

            const emailField =
                currentStep.querySelector(
                    'input[type="email"]'
                );


            if (
                emailField &&
                emailField.value.trim()
            ) {

                const email =
                    emailField.value.trim();


                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailRegex.test(
                        email
                    )
                ) {

                    this.showError(
                        "Ingresá un correo electrónico válido."
                    );


                    emailField.focus();


                    return false;

                }

            }


            /* =================================================
               URL
               ================================================= */

            const urlField =
                currentStep.querySelector(
                    'input[type="url"]'
                );


            if (
                urlField &&
                urlField.value.trim()
            ) {

                const url =
                    urlField.value.trim();


                if (
                    !this.isValidURL(
                        url
                    )
                ) {

                    this.showError(
                        "Ingresá una URL válida. Ejemplo: https://tusitio.com"
                    );


                    urlField.focus();


                    return false;

                }

            }


            /* =================================================
               PASO 4 — ESTILOS
               ================================================= */

            if (
                this.state.currentStep === 4
            ) {

                const styleOptions =
                    Array.from(
                        currentStep.querySelectorAll(
                            'input[type="checkbox"][name="style"]'
                        )
                    );


                const hasStyle =
                    styleOptions.some(
                        (checkbox) =>
                            checkbox.checked
                    );


                if (!hasStyle) {

                    this.showError(
                        "Seleccioná al menos un estilo para continuar."
                    );


                    if (styleOptions[0]) {
                        styleOptions[0].focus();
                    }


                    return false;

                }

            }


            /* =================================================
               PASO 5 — FUNCIONALIDADES
               ================================================= */

            if (
                this.state.currentStep === 5
            ) {

                const featureOptions =
                    Array.from(
                        currentStep.querySelectorAll(
                            'input[type="checkbox"][name="features"]'
                        )
                    );


                const hasFeature =
                    featureOptions.some(
                        (checkbox) =>
                            checkbox.checked
                    );


                if (!hasFeature) {

                    this.showError(
                        "Seleccioná al menos una funcionalidad para continuar."
                    );


                    if (featureOptions[0]) {
                        featureOptions[0].focus();
                    }


                    return false;

                }

            }


            return true;

        },


        /* =====================================================
           URL VALIDATION
           ===================================================== */

        isValidURL(value) {

            try {

                const url =
                    new URL(value);


                return (
                    url.protocol === "http:" ||
                    url.protocol === "https:"
                );

            } catch {

                return false;

            }

        },


        /* =====================================================
           FORM DATA
           ===================================================== */

        getFormData() {

            const formData =
                new FormData(
                    this.elements.form
                );


            return {

                fullName:
                    formData.get(
                        "fullName"
                    ) || "",


                email:
                    formData.get(
                        "email"
                    ) || "",


                whatsapp:
                    formData.get(
                        "whatsapp"
                    ) || "",


                company:
                    formData.get(
                        "company"
                    ) || "",


                projectName:
                    formData.get(
                        "projectName"
                    ) || "",


                projectDescription:
                    formData.get(
                        "projectDescription"
                    ) || "",


                hasWebsite:
                    formData.get(
                        "hasWebsite"
                    ) || "",


                existingWebsite:
                    formData.get(
                        "existingWebsite"
                    ) || "",


                websiteType:
                    formData.get(
                        "websiteType"
                    ) || "",


                style:
                    formData.getAll(
                        "style"
                    ),


                references:
                    formData.get(
                        "references"
                    ) || "",


                contentStatus:
                    formData.get(
                        "contentStatus"
                    ) || "",


                features:
                    formData.getAll(
                        "features"
                    ),


                otherFeatures:
                    formData.get(
                        "otherFeatures"
                    ) || "",


                budget:
                    formData.get(
                        "budget"
                    ) || "",


                deadline:
                    formData.get(
                        "deadline"
                    ) || "",


                domainHosting:
                    formData.get(
                        "hostingStatus"
                    ) || "",


                additionalDetails:
                    formData.get(
                        "additionalDetails"
                    ) || "",


                howFound:
                    formData.get(
                        "source"
                    ) || "",


                contactConsent:
                    formData.get(
                        "consent"
                    ) === "on"

            };

        },


        /* =====================================================
           SUMMARY
           ===================================================== */

        updateSummary() {

            if (
                !this.elements.summaryContent
            ) {

                return;

            }


            const data =
                this.getFormData();


            const styles =
                Array.isArray(
                    data.style
                )
                    ? data.style.join(
                        ", "
                    )
                    : data.style;


            const features =
                Array.isArray(
                    data.features
                )
                    ? data.features.join(
                        ", "
                    )
                    : data.features;


            const websiteStatus =
                data.hasWebsite ||
                "No indicado";


            const websiteURL =
                data.hasWebsite === "Sí"
                    ? (
                        data.existingWebsite ||
                        "No indicado"
                    )
                    : "No tiene";


            this.elements.summaryContent.innerHTML = `

                <div class="project-form__summary-grid">

                    <div class="project-form__summary-item">

                        <span>Nombre</span>

                        <strong>
                            ${this.escapeHTML(
                                data.fullName
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Email</span>

                        <strong>
                            ${this.escapeHTML(
                                data.email
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>WhatsApp</span>

                        <strong>
                            ${this.escapeHTML(
                                data.whatsapp ||
                                "No indicado"
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Empresa / Marca</span>

                        <strong>
                            ${this.escapeHTML(
                                data.company ||
                                "No indicada"
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Proyecto</span>

                        <strong>
                            ${this.escapeHTML(
                                data.projectName
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Descripción</span>

                        <strong>
                            ${this.escapeHTML(
                                data.projectDescription
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>¿Ya tiene página web?</span>

                        <strong>
                            ${this.escapeHTML(
                                websiteStatus
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Página actual</span>

                        <strong>
                            ${this.escapeHTML(
                                websiteURL
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Tipo de sitio</span>

                        <strong>
                            ${this.escapeHTML(
                                data.websiteType
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Estilo</span>

                        <strong>
                            ${this.escapeHTML(
                                styles ||
                                "No indicado"
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Referencias</span>

                        <strong>
                            ${this.escapeHTML(
                                data.references ||
                                "No indicadas"
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Contenido</span>

                        <strong>
                            ${this.escapeHTML(
                                data.contentStatus ||
                                "No indicado"
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Funcionalidades</span>

                        <strong>
                            ${this.escapeHTML(
                                features ||
                                "No indicadas"
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Otras funcionalidades</span>

                        <strong>
                            ${this.escapeHTML(
                                data.otherFeatures ||
                                "No indicadas"
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Presupuesto</span>

                        <strong>
                            ${this.escapeHTML(
                                data.budget
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Plazo</span>

                        <strong>
                            ${this.escapeHTML(
                                data.deadline
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Dominio / Hosting</span>

                        <strong>
                            ${this.escapeHTML(
                                data.domainHosting
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>Detalles adicionales</span>

                        <strong>
                            ${this.escapeHTML(
                                data.additionalDetails
                            )}
                        </strong>

                    </div>


                    <div class="project-form__summary-item">

                        <span>¿Cómo nos encontró?</span>

                        <strong>
                            ${this.escapeHTML(
                                data.howFound
                            )}
                        </strong>

                    </div>

                </div>

            `;

        },


        /* =====================================================
           SUBMIT
           ===================================================== */

        async submitForm() {

            if (this.state.isSending) {
                return;
            }


            if (
                !this.validateCurrentStep()
            ) {

                return;

            }


            if (
                !CONFIG.accessKey ||
                CONFIG.accessKey ===
                    "PEGÁ_ACÁ_TU_ACCESS_KEY"
            ) {

                this.showError(
                    "Falta configurar la Access Key del formulario."
                );


                console.error(
                    "[STUBER.WEB] Falta configurar la Access Key de Web3Forms."
                );


                return;

            }


            const data =
                this.getFormData();


            this.setSendingState(
                true
            );


            this.clearError();


            const formData =
                new FormData(
                    this.elements.form
                );


            /* =================================================
               DATOS PRINCIPALES WEB3FORMS
               ================================================= */

            formData.append(
                "access_key",
                CONFIG.accessKey
            );


            formData.append(
                "name",
                data.fullName
            );


            formData.append(
                "email",
                data.email
            );


            formData.append(
                "replyto",
                data.email
            );


            formData.append(
                "subject",
                `Nuevo proyecto web — ${
                    data.projectName ||
                    "STUBER.WEB"
                }`
            );


            formData.append(
                "from_name",
                "STUBER.WEB"
            );


            /* =================================================
               DATOS DEL PROYECTO
               ================================================= */

            formData.append(
                "project_name",
                data.projectName
            );


            formData.append(
                "project_description",
                data.projectDescription
            );


            formData.append(
                "company",
                data.company
            );


            formData.append(
                "whatsapp",
                data.whatsapp
            );


            formData.append(
                "has_website",
                data.hasWebsite
            );


            formData.append(
                "existing_website",
                data.existingWebsite
            );


            formData.append(
                "website_type",
                data.websiteType
            );


            formData.append(
                "style",
                Array.isArray(
                    data.style
                )
                    ? data.style.join(
                        ", "
                    )
                    : data.style
            );


            formData.append(
                "references",
                data.references
            );


            formData.append(
                "content_status",
                data.contentStatus
            );


            formData.append(
                "features",
                Array.isArray(
                    data.features
                )
                    ? data.features.join(
                        ", "
                    )
                    : data.features
            );


            formData.append(
                "other_features",
                data.otherFeatures
            );


            formData.append(
                "budget",
                data.budget
            );


            formData.append(
                "deadline",
                data.deadline
            );


            formData.append(
                "hosting_status",
                data.domainHosting
            );


            formData.append(
                "additional_details",
                data.additionalDetails
            );


            formData.append(
                "source",
                data.howFound
            );


            formData.append(
                "consent",
                data.contactConsent
                    ? "Sí"
                    : "No"
            );


            /* =================================================
               REQUEST
               ================================================= */

            const controller =
                new AbortController();


            const timeoutId =
                window.setTimeout(
                    () => {

                        controller.abort();

                    },
                    CONFIG.requestTimeout
                );


            try {

                const response =
                    await fetch(
                        CONFIG.formEndpoint,
                        {
                            method: "POST",

                            body: formData,

                            signal:
                                controller.signal
                        }
                    );


                const responseText =
                    await response.text();


                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                } catch {

                    throw new Error(
                        "El servidor devolvió una respuesta inválida."
                    );

                }


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "No se pudo enviar el formulario."
                    );

                }


                console.log(
                    "[STUBER.WEB] Formulario enviado correctamente.",
                    result.message || ""
                );


                this.showSuccess();


            } catch (error) {

                console.error(
                    "[STUBER.WEB] Error enviando formulario:",
                    error
                );


                if (
                    error.name ===
                    "AbortError"
                ) {

                    this.showError(
                        "La solicitud tardó demasiado. Revisá tu conexión e intentá nuevamente."
                    );

                } else {

                    this.showError(
                        error.message ||
                        "No se pudo enviar el formulario. Intentá nuevamente."
                    );

                }

            } finally {

                window.clearTimeout(
                    timeoutId
                );


                this.setSendingState(
                    false
                );

            }

        },


        /* =====================================================
           SUCCESS
           ===================================================== */

        showSuccess() {

            if (!this.elements.success) {

                console.error(
                    "[STUBER.WEB] No se encontró el elemento de éxito."
                );


                return;

            }


            /* Ocultar formulario */

            if (this.elements.form) {

                this.elements.form.style.display =
                    "none";

            }


            /* Ocultar navegación */

            if (this.elements.navigation) {

                this.elements.navigation.hidden =
                    true;

            }


            /* Mostrar éxito */

            this.elements.success.hidden =
                false;


            this.elements.success.classList.add(
                "is-visible"
            );


            this.elements.success.setAttribute(
                "aria-hidden",
                "false"
            );


            /* Mover foco */

            const successTitle =
                this.elements.success.querySelector(
                    "h3"
                );


            if (successTitle) {

                successTitle.setAttribute(
                    "tabindex",
                    "-1"
                );


                window.setTimeout(
                    () => {

                        successTitle.focus();

                    },
                    100
                );

            }

        },


        /* =====================================================
           SENDING STATE
           ===================================================== */

        setSendingState(
            isSending
        ) {

            this.state.isSending =
                isSending;


            if (this.elements.submit) {

                this.elements.submit.disabled =
                    isSending;


                if (isSending) {

                    this.elements.submit.innerHTML = `
                        <span>Enviando...</span>
                    `;

                } else {

                    this.elements.submit.innerHTML = `
                        Enviar proyecto
                        <span aria-hidden="true">↗</span>
                    `;

                }

            }


            if (this.elements.next) {

                this.elements.next.disabled =
                    isSending;

            }


            if (this.elements.back) {

                this.elements.back.disabled =
                    isSending ||
                    this.state.currentStep === 1;

            }


            if (this.elements.form) {

                this.elements.form.setAttribute(
                    "aria-busy",
                    isSending
                        ? "true"
                        : "false"
                );

            }

        },


        /* =====================================================
           ERROR
           ===================================================== */

        showError(
            message
        ) {

            if (!this.elements.error) {
                return;
            }


            this.elements.error.textContent =
                message;


            this.elements.error.classList.add(
                "is-visible"
            );


            this.elements.error.setAttribute(
                "aria-hidden",
                "false"
            );

        },


        clearError() {

            if (!this.elements.error) {
                return;
            }


            this.elements.error.textContent =
                "";


            this.elements.error.classList.remove(
                "is-visible"
            );


            this.elements.error.setAttribute(
                "aria-hidden",
                "true"
            );

        },


        /* =====================================================
           RESET
           ===================================================== */

        reset() {

            if (this.elements.form) {

                this.elements.form.reset();


                this.elements.form.style.display =
                    "";


                this.elements.form.setAttribute(
                    "aria-busy",
                    "false"
                );

            }


            this.state.currentStep =
                1;


            this.state.isSending =
                false;


            if (this.elements.success) {

                this.elements.success.hidden =
                    true;


                this.elements.success.classList.remove(
                    "is-visible"
                );


                this.elements.success.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            if (this.elements.navigation) {

                this.elements.navigation.hidden =
                    false;

            }


            if (this.elements.summary) {

                this.elements.summary.hidden =
                    true;


                this.elements.summary.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }


            this.updateExistingWebsiteField();

            this.clearError();

            this.updateUI();

        },


        /* =====================================================
           SECURITY / HTML
           ===================================================== */

        escapeHTML(value) {

            return String(
                value ?? ""
            )

                .replace(
                    /&/g,
                    "&amp;"
                )

                .replace(
                    /</g,
                    "&lt;"
                )

                .replace(
                    />/g,
                    "&gt;"
                )

                .replace(
                    /"/g,
                    "&quot;"
                )

                .replace(
                    /'/g,
                    "&#039;"
                );

        },


        /* =====================================================
           PUBLIC API
           ===================================================== */

        getState() {

            return {
                ...this.state
            };

        }

    };


    window.StuberContact =
        Contact;

})();