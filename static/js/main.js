'use strict'
import { showBootstrapAlert, makeCalendar } from "./functions.js"
document.addEventListener('DOMContentLoaded', () => {
//  ------------------------------INPUT INPUTS---------------------------------------------------------
let fullNameInput = document.querySelector('#full-name-input')
let vinCodeInput = document.querySelector('.vin-code-input')
let dvigatelRaqamiInput = document.querySelector('.dvigatel-number-input')
let colorInput = document.querySelector('#color-of-the-car') 
let odometrInput = document.querySelector('.odometr-korsatkichi-input')
let odometrInputNorma = document.querySelector('.odometr-korsatkichi-input-norma')
//  ------------------------------OUTPUT INPUTS-------------------------------------------------------
let fullNameOutput = document.querySelector('.full-name-output')
let vinCodeOutput = document.querySelector('.vin-code-output')
let carYearOutput = document.querySelector('.car-year-output')
let odometrOutput = document.querySelector('.odometr-korsatkichi-output')
let colorOutput = document.querySelector('.rang')
let dvigatelRaqamiOutput = document.querySelector('.dvigatel-number-output')

//  -----------------------------SELECT INPUTS--------------------------------------------------------
let carYearChoose = document.querySelector('.calendar-box-1')
let carYearChoose2 = document.querySelector('.calendar-box-2')
//  --------------------------------BUTTONS------------------------------------------------------------
let checkInfoButton = document.querySelector(".check-information")
//  -----------------------------INPUT GROUPS---------------------------------------------------------
let identificationInputs = document.querySelectorAll('.identification input[type="number"], .identification input[type="text"], .identification select');
//  ----------------------------RADIO INPUTS-----------------------------------------------------------
let sozNosozRadios = document.querySelectorAll('.soz-nosoz-box input[type="radio"]')
//  -------------------------AUXILIARY VARIABLES---------------------------------------------------------
let hozirgiYil = new Date().getFullYear();

//  -------------------------------FOR ADDING ELEMENT-------------------------------------------------------------

//  ------------------------------RADIO INPUTS--------------------------------------------------------

sozNosozRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (radio.value == 'soz') {
        odometrInput.removeAttribute("disabled");
        odometrInputNorma.setAttribute("disabled", "disabled");
        odometrInputNorma.value = ''
        odometrInput.style.border = "none"
      } else if (radio.value == 'nosoz') {
        odometrInputNorma.removeAttribute("disabled");
        odometrInput.setAttribute("disabled", "disabled");
        odometrInput.value = ''
        odometrInput.style.border = "none"
      }
    });
  });

//  -----------------CALENDAR FOR CHOOSING YEAR OF THE CAR-----------------------------------------------
// first calendar
makeCalendar(carYearChoose, 2025, 1)

// second calendar
makeCalendar(carYearChoose2, 2015, 2)

//  --------------------------------BUTTONS-----------------------------------------------------------

async function loadGeometrikMurakkablikOptions() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/kuzov-geometrik-murakkablik'); // endpoint o'zgartiring
        const data = await response.json();
        const select = document.querySelector('.geometrik-murakkablik-select');
        select.innerHTML = ''; // eski optionlarni tozalash

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            select.appendChild(option);
        });

        // agar default qiymat kerak bo'lsa
        select.value = data[1]?.id || ''; // misol uchun ikkinchi elementni default qilamiz

    } catch (err) {
        console.error("Xato:", err);
    }
}

// chaqirish
loadGeometrikMurakkablikOptions();


document.querySelectorAll('.money').forEach(input => {
        input.addEventListener('input', e => {
            // faqat raqamlarni qoldiramiz
            let value = e.target.value.replace(/\D/g, "");

            // agar bo‘sh bo‘lsa qaytib ketsin
            if (!value) {
                e.target.value = "";
                return;
            }

            // uchliklarga bo‘lib formatlash (masalan: 10000 -> 10 000)
            let formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

            e.target.value = formatted;
        });
    });

    const slots = document.querySelectorAll('.img-upload-slot');

    slots.forEach(slot => {
        const fileInput = slot.querySelector('.file-input');

        // Faqat input change ishlasin
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                // Eski rasm va delete tugmasini olib tashlash
                const oldImg = slot.querySelector('img');
                const oldRemoveBtn = slot.querySelector('.remove-btn');
                if (oldImg) oldImg.remove();
                if (oldRemoveBtn) oldRemoveBtn.remove();

                // Yangi rasm preview
                const img = document.createElement('img');
                img.src = ev.target.result;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.classList.add('position-absolute', 'top-0', 'start-0');
                slot.appendChild(img);

                // icon/textni yashirish
                const icon = slot.querySelector('.icon');
                if (icon) icon.style.display = 'none';

                // Faylni datasetga yozib qo‘yish
                slot.dataset.fileUrl = ev.target.result;

                // ❌ Delete tugmasi
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.textContent = '×';
                removeBtn.classList.add('remove-btn');
                Object.assign(removeBtn.style, {
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    zIndex: '10'
                });

                slot.appendChild(removeBtn);

                // Delete tugma bosilganda
                removeBtn.addEventListener('click', (ev) => {
                    ev.stopPropagation(); // slot click ishlamasin
                    img.remove();
                    removeBtn.remove();
                    fileInput.value = ''; // inputni tozalash
                    delete slot.dataset.fileUrl; // datasetni tozalash

                    // ikonka qayta ko‘rinadigan bo‘lsin
                    if (icon) icon.style.display = '';
                });
            };
            reader.readAsDataURL(file);
        });
    });
});





