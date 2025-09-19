import { csrftoken } from "./functions.js";
document.addEventListener("change", function (e) {
  if (e.target.matches('input[name="model"]')) {
    window.carModelId = e.target.id.replace('model', ''); // model1 -> 1
    // Containerni tozalash
    const container = document.querySelector('.ichki-detallar-accordion-body');
    container.innerHTML = '';
    fetch(`http://127.0.0.1:8000/api/ichki-detail-coefficient/?car_model_id=${window.carModelId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.length === 0) {
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
                  <div class="for-ichki-detallar-select"></div>
                  <p class="d-flex mb-0 me-3 ps-2 pe-2 coefficient" value="${item.id}">${coefficient}</p>
                  <div class="form-check checkbox d-flex ms-3">
                      <input class="form-check-input last-checbox" type="checkbox" value="" data-id="${item.id}" id="checkDefault${item.id}">
                  </div>
              </div>
          `;

          // Select yaratish
          const selectContainer = div.querySelector(".for-ichki-detallar-select");
          const select = document.createElement("select");
          select.setAttribute('data-id', item.id)
          select.className = "form-select detallar-soni";
          select.name = "detallarSoni";

          for (let i = 1; i <=5; i++) {
              const option = document.createElement("option");
              option.value = i;
              option.textContent = i;
              if (i === 1) option.selected = true; // default 1
              option.id = `detal-soni${i}`;
              select.appendChild(option);
          }

          selectContainer.appendChild(select);
          container.appendChild(div);
      });

      })
      .catch(err => {
        console.error('Ichki detallarni yuklashda xatolik:', err);
      });
  }
});
