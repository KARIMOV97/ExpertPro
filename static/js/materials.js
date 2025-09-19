// 1. Materiallar ul elementini olish
const materialsList = document.querySelector(".materials-list-last");

// 2. Backend API dan Materiallar ro'yxatini olish
fetch("http://127.0.0.1:8000/api/materiallar")  // API endpoint sizning Django url.py ga mos bo'lishi kerak
  .then(response => response.json())
  .then(data => {
    // 3. Har bir material uchun li yaratish
    data.forEach(material => {
      const li = document.createElement("li");
      li.classList.add("stuff", "border-bottom")
      li.innerHTML = `
        <div class="d-flex align-items-center w-100 px-3">
          <span class="stuff-input px-0 flex-grow-1 text-start">${material.name}</span>
          <input class="stuff-input miqdor" value ="${material.miqdor}">
          <input class="stuff-input miqdor border-1" value='${material.olchov_birligi}'>
          <input  class="mony" value="${material.narxi}">
          <input class="form-check-input last-checbox ms-auto" type="checkbox" checked>
        </div>
      `;
      materialsList.appendChild(li);
    });
  })
  .catch(error => console.error("Materiallarni olishda xatolik:", error));
