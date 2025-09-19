import { apiGet, apiPost, apiPut, apiDelete, showBootstrapAlert } from './functions.js';
const API = {}; // bu object ichida endpointlar bo‘ladi

    fetch("http://127.0.0.1:8000/api")
  .then(res => res.json())
  .then(data => {
    for (const [key, url] of Object.entries(data)) {
    API[key] = {
        get: () => apiGet(url),
      }
    }
// ---------------------------------------VARIABLES-----------------------------------------------------------------------
    const kuzovContainer = document.querySelector('#kuzov-container');
    const expertContainer = document.querySelector('#expert-container');
// ------------------------------------CAR-MODEL-LOAD-----------------------------------------------------------------------
    async function renderModels() {
        try {
            const models = await API['kuzov'].get();  // async chaqiruv
            const select = document.createElement("select");
            select.className = "form-select kuzov-select";
            select.name = "kuzov";

            models.forEach(model => {
                const option = document.createElement("option");
                option.value = model.id;       // value = id
                option.textContent = model.name; // ekranda ko‘rinadigan nom
                select.appendChild(option);
            });

            kuzovContainer.appendChild(select);
        } catch (err) {
            console.error('Kuzovda xatolik:', err);
        }
    }
    renderModels()
     async function renderExpert() {
        try {
            const experts = await API['expert'].get();  // async chaqiruv
            const select = document.querySelector("#expert");
            select.className = "form-select expert-select mb-3";
            select.name = "expert";
            select.id = 'expert'
            experts.forEach(expert => {              
                const option = document.createElement("option");
                option.value = expert.id;       // value = id
                option.textContent = expert.name; // ekranda ko‘rinadigan nom
                select.appendChild(option);
            });

            expertContainer.appendChild(select);
        } catch (err) {
            console.error('Expertda xatolik:', err);
        }
    }
    renderExpert()
})
