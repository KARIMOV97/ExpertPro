import { apiGet, apiPost, apiPut, apiDelete, showBootstrapAlert } from './functions.js';
const API = {}; // bu object ichida endpointlar bo‘ladi

fetch("http://127.0.0.1:8000/api")
  .then(res => res.json())
  .then(data => {
    for (const [key, url] of Object.entries(data)) {
    API[key] = {
        get: () => apiGet(url),
        create: (data) => apiPost(url, data),
        update: (id, data) => apiPut(`${url}${id}/`, data),
        delete: (id) => apiDelete(`${url}${id}/`)
      }
    }
// ---------------------------------------VARIABLES-----------------------------------------------------------------------
    const container = document.querySelector('#car-models-container');
    const addButton = document.querySelector(".model-add-button");
    const input = document.querySelector(".add-model-name");
// ------------------------------------CAR-MODEL-LOAD-----------------------------------------------------------------------
    async function renderModels() {
        try {
            const models = await API['car-models'].get(); 
            models.forEach((model, index) => {
                const div = document.createElement("div");
                div.className = "stuff border-bottom d-flex justify-content-between";
                div.innerHTML = `
                <label class="form-check-label d-flex align-items-center mb-0">
                    <input class="form-check-input me-3" type="radio" name="model" id="model${model.id}" data-id="${model.id}">
                    <span>${model.name}</span>
                </label>
            `;
            container.appendChild(div);
            });
        } catch (err) {
            console.error('Car modelda xatolik:', err);
        }
    }
    renderModels();

})
