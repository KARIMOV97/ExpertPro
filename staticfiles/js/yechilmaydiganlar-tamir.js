// UL elementni olish
const ul = document.querySelector(".yechilmaydigan-detallar-tamir-ul");

// Birinchi fetch: Yechilmaydigan detallarni olish
fetch("http://127.0.0.1:8000/api/yechilmaydigan-detallar-tamir/")
  .then(response => response.json())
  .then(data => {
    ul.innerHTML = ""; // eski elementlarni tozalash

    data.forEach(detail => {
      // Har bir li yaratamiz
      const li = document.createElement("li");
      li.classList.add("stuff", "border-bottom", "d-flex");
      li.innerHTML = `
        <div class="d-flex w-100">
          <div class="form-check checkbox d-flex ps-0">
            <label class="form-check-label ms-auto">
              <input name="boyoq" class="form-check-input last-checbox ms-4" type="checkbox" value="${detail.id}">
            </label>
            <label class="form-check-label ms-auto">
              <input name="tamir" class="form-check-input last-checbox ms-4" type="checkbox" value="${detail.id}">
            </label>
          </div>
          <div class="d-flex align-items-center">
            <select class="tamirlash-darajasi-select ps-2 pe-2 mx-4 border-0 outline-none"></select>
            <p class="d-flex mb-0 ps-2 pe-2">${detail.name}</p>
          </div>
        </div>
      `;

      ul.appendChild(li);

      // DOM ga qo‘shilgandan keyin selectni olamiz
      const select = li.querySelector(".tamirlash-darajasi-select");

      // Endi ikkinchi fetch: Tamirlash darajasi yuklash
      fetch("http://127.0.0.1:8000/api/tamirlash-darajasi/")
        .then(res => res.json())
        .then(darajalar => {
          select.innerHTML = ""; // eski optionlarni tozalash
          darajalar.forEach(item => {
            let option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name || item.title || `№${item.level}`;
            option.dataset.level = item.level
            select.appendChild(option);
          });
        })
        .catch(err => {
          console.error("Tamirlash darajalari yuklanmadi:", err);
          select.innerHTML = `<option value="">Xatolik</option>`;
        });
    });
  })
  .catch(error => console.error("Xatolik:", error));
