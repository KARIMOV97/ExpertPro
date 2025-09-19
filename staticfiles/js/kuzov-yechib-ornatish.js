import { csrftoken } from "./functions.js";
export let  carModelId
document.addEventListener("change", function (e) {
  if (e.target.matches('input[name="model"]')) {
    carModelId = e.target.id.replace('model', ''); // model1 -> 1
    // Containerni tozalash
    const container = document.querySelector('.kuzov-yechib-ornatish-accordion-body');
    container.innerHTML = '';

    fetch(`http://127.0.0.1:8000/api/kuzov-detail-coefficient/?car_model_id=${carModelId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.length === 0) {
          console.log('Bu model uchun detallar topilmadi');
          return;
        }

        data.forEach(item => {
          const name = item.detail.name;
          const img = item.detail.img;
          const coefficient = item.coefficient;

          const div = document.createElement("div");
          div.className = "stuff border-bottom d-flex justify-content-between align-items-center";
          div.innerHTML = `
            <div class="d-flex align-items-center">
              <img class="img-box" src="${img}" alt="" style="width: 50px; height: 50px; object-fit: cover;">
              <p class="d-flex ms-3 mb-0 ps-2 pe-2">${name}</p>
            </div>
            <div class="d-flex align-items-center ms-auto">
              <p class="d-flex mb-0 me-3 ps-2 pe-2 coefficient">${coefficient}</p>
              <div class="form-check checkbox d-flex ms-3">
                <label class="form-check-label">
                  <input class="form-check-input last-checbox" type="checkbox" data-id ="${item.id}" data-detail-id ="${item.detail.id}" value="" id="checkDefault${item.id}">
                </label>
              </div>
            </div>
          `;
          container.appendChild(div);
        });
      })
      .catch(err => {
        console.error('Kuzov detallarni yuklashda xatolik:', err);
      });
  }
});
