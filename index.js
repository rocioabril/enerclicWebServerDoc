
const forms = document.querySelectorAll('.ec-text');
const field1 = document.getElementById('field1');
const field2 = document.getElementById('field2');
const field3 = document.getElementById('field3');
const form1 = document.getElementById('form1');
const form3 = document.getElementById('form3');
const form3Fields = document.querySelectorAll('.form3-field');


// const form2 = document.getElementById('form2');
// const field4 = document.getElementById('field4');
// const field5 = document.getElementById('field5');
// const form2Fields = document.querySelectorAll('.form2-field');
// const form2Submit = document.getElementById("form2-submit");


const openModalBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('form1-modal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');

const advanceTriggers = document.querySelectorAll('.advance-trigger');
const form1Fields = document.querySelectorAll('.form1-field');




///////////////////////////////////////////////////////////////
////////////////////////// ROUTES /////////////////////////////
///////////////////////////////////////////////////////////////

const hideAllForms = () => forms.forEach(form => form.classList.add("hideElement"));
const selectTab = (formId) => {
    const tabs = document.querySelectorAll('.ec-sidebar__tab');

    tabs.forEach(tab => {
        if (tab.getAttribute('href') === `#${formId}`) {
            tab.classList.add('selected-tab');
        } else {
            tab.classList.remove('selected-tab');
        }
    });
}
const showFormForCurrentRoute = () => {
    const currentRoute = window.location.hash;
    const formId = currentRoute.substring(1);// quitar "#"
    hideAllForms();
    selectTab(formId);

    // Mostrar el formulario correspondiente
    const formToShow = document.getElementById(formId);
    if (formToShow) {
        formToShow.classList.remove("hideElement");
    }
}
// Verificar si no hay una ruta en la URL y establecerla en #form1
if (window.location.hash === "") {
    window.location.hash = "introduccion";
}
window.addEventListener('hashchange', showFormForCurrentRoute);
showFormForCurrentRoute();
//al añadir nuevos intems al menú y formularios, poner a la etiqueta a el href "# + el nobmre del ID del formulario que debe mostrar". El formulario nuevo debe tener la clase .form. 
//Al cambiar el hash showFormForCurrentRoute() busca el formulario cuyo id sea igual a la ruta.
//los elementos <a> deben tener la clase "ec-sidebar__tab"



///////////////////////////////////////////////////////////////
////////////////////////// DISPLAY ADVANCE ////////////////////
///////////////////////////////////////////////////////////////

// por cada advance trigger mostrar su propio advance content
const toggleAdvanceContent = () =>{
    advanceTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const form = trigger.id.split("-")[1]
            const container = document.getElementById(`advance_content-${form}`)
            const arrow = document.getElementById(`advance_arrow-${form}`)
            container.classList.toggle("hideElement")
            arrow.classList.toggle("spin")
        })
    })
}
toggleAdvanceContent()


///////////////////////////////////////////////////////////////
////////////////////////// MODAL /////////////////////////////
///////////////////////////////////////////////////////////////
// Abrir modal
openModalBtn.addEventListener('click', () => modal.classList.remove("hideElement"));

// Cerrar modal con X y cancel
[closeModalBtn, cancelModalBtn].forEach(btn => 
    btn.addEventListener('click', () => { 
        modal.classList.add("hideElement")
}))

// Cerrar el modal haciendo clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add("hideElement")
    }
});

///////////////////////////////////////////////////////////////
/////////////////////////////// GET ///////////////////////////
///////////////////////////////////////////////////////////////

const getForm3 = {
    "field6": "dato 6",
    "field7": "dato 7",
    "field8": true
}

//funciona correctamente unicamente si el get trae un elemento por cada input del formulario y lleva la misma key que id del campo en el html. Si un input no viene con un valor determinado del get, simplemente se vera vacio. En caso de que el get traiga un valor que no coincida con el id de ningun campo se desestima.
const setFormValues = (form, getValues) => {
    const fields = document.querySelectorAll(`.${form.id}-field`);
    fields.forEach(field => {
        field.type === 'checkbox'
            ? field.checked = getValues[field.id]
            : field.value = getValues[field.id] ?? "";
    });
}


const getFormValues = async (form, fetchDataFunction) => {
    try {
        const data = await fetchDataFunction();
        setFormValues(form, data);
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
    }
};

setFormValues(form3, getForm3)

///////////////////////////////////////////////////////////////
/////////////////////////// POST/PUT //////////////////////////
///////////////////////////////////////////////////////////////
const form3Submit = document.getElementById("form3-submit");

const updateDataform3 = async (data) =>{
    /* Reemplazar console por función asincrona que actualicen los datos enviandolos al endpoint correspondientes */
    console.log(data)
}

const updateFormValues = async (form, updateDataFunction) => {
    try {
        let postFormValues = {};
        const fields = document.querySelectorAll(`.${form.id}-field`);
        fields.forEach(field => {
            if (field.type === 'checkbox') {
                postFormValues[field.id] = field.checked;
            } else {
                if (field.value !== "") {
                    postFormValues[field.id] = field.value;
                }
            }
        });
        await updateDataFunction(postFormValues);
    } catch (error) {
        console.error('Error al enviar modificaciones a la API:', error);
    }
};

form3Submit.addEventListener("click", () => {
    /* Acompañar con condicionales de las validaciones pertinentes */
    updateFormValues(form3, updateDataform3);
});



///////////////////////////////////////////////////////////////
/////////////////////// VALIDATIONS ///////////////////////////
///////////////////////////////////////////////////////////////
//en caso de que un campo no necesite validacion nos  ele pone form1-field ni se lo incluye e elementValidations o bien se lo incluye pomiendo como validacion true

const form2 = document.getElementById('form2');
const field4 = document.getElementById('field4');
const field5 = document.getElementById('field5');
const form2Fields = document.querySelectorAll('.form2-field');
const form2Submit = document.getElementById("form2-submit");

// Funciones de validación para campos específicos
const isField4Valid = () => field4.value !== "";/* Cambiar por la condicion necesario */
const isField5Valid = () => field5.value !== "";/* Cambiar por la condicion necesario */

// Objeto que mapea campos a sus funciones de validación correspondientes. 
// Relacionar el ID del campo como key y la funcion que lo valida como value
const elementValidationsForm2 = {
    "field4": isField4Valid,
    "field5": isField5Valid
}

// Función para validar el formulario en conjunto
const validateForm2 = () => isField4Valid() && isField5Valid();

// Función para mostrar la feedback de error en un campo específico
const showInvalidFeedback = (input) => {
    const icon = document.getElementById(`${input.id}-error-icon`);
    const msg = document.getElementById(`${input.id}-error-msg`);
    input.classList.add("ec-invalid-feedback");
    icon.classList.remove("hideElement");
    msg.classList.remove("hideElement");
}

// Función para eliminar feedback de error de un campo específico
const removeInvalidFeedback = (input) => {
    const icon = document.getElementById(`${input.id}-error-icon`);
    const msg = document.getElementById(`${input.id}-error-msg`);
    input.classList.remove("ec-invalid-feedback");
    icon.classList.add("hideElement");
    msg.classList.add("hideElement");
}

// Función para proporcionar feedback al enviar el formulario
const feedbackOnSubmit = (allInputs, elementValidations) => {
    Array.from(allInputs).forEach(inp => {
        const validationFunction = elementValidations[inp.id];
        if (validationFunction !== undefined) {
            // Mostrar o eliminar feedback de error según la validación
            if (validationFunction()) {
                removeInvalidFeedback(inp);
            } else {
                showInvalidFeedback(inp);
            }
        }
    });
}

// Función para proporcionar feedback en tiempo real durante la interacción con el formulario
const feedbackInRealTime = (inp, validationFn) => {
    const errorEl = document.getElementById(`${inp.id}-error`);
    const event = inp.tagName === "SELECT" ? 'change' : 'input';
    if (validationFn !== undefined) {
        inp.addEventListener(event, (event) => {
            // Mostrar o eliminar feedback de error en tiempo real según la validación
            if (validationFn()) {
                removeInvalidFeedback(inp);
            } else {
                showInvalidFeedback(inp);
            }
        });
    }
}

// Asociar funciones de feedback en tiempo real a los campos del formulario
Array.from(form2Fields).forEach(inp => {
    feedbackInRealTime(inp, elementValidationsForm2[inp.id]);
});

// Asociar función de feedback al evento de clic en el botón de envío del formulario
form2Submit.addEventListener("click", () => {
    if (validateForm2()) {
        //enviar formulario
    } else {
        feedbackOnSubmit(form2Fields, elementValidationsForm2);
    }
});

// Llamar cuando el usuario cambie de seccion sin haber enviado el formulario o cuando considere pertinente
const clearErrors = (form2Fields) => Array.from(form2Fields).forEach( field => removeInvalidFeedback(field))


//updateFormValues(form1);






const en = {
    "information": "Information",
    "configuration": "Configuration"
}

const es = {
    "information": "Información",
    "configuration": "Configuración"
}


const languages = { en, es }
let currentLang = "en";
let lang = languages[currentLang];

const applySelectedLang = () => {
	const langTags = document.querySelectorAll('[data-lang]');
	const langPlaceHolder = document.querySelectorAll('[data-lang-placeholder]');
	const langToolTips = document.querySelectorAll('[data-lang-tooltips]');
	const langValue = document.querySelectorAll('[data-lang-value]');

	langTags.forEach((tag) =>  tag.textContent = lang[tag.getAttribute('data-lang')]);
	langPlaceHolder.forEach((tag) => tag.placeholder = lang[tag.getAttribute('data-lang-placeholder')]);
	langToolTips.forEach((tag) => tag.title = lang[tag.getAttribute('data-lang-tooltips')]);
	langValue.forEach((tag) => tag.value = lang[tag.getAttribute('data-lang-value')]);
}

const setLang = () => {
	currentLang = document.getElementById("select-lang").value.toLowerCase();
	lang = languages[currentLang];
	applySelectedLang();
}

document.getElementById('select-lang').addEventListener('change', (e) => setLang() )

setLang()

