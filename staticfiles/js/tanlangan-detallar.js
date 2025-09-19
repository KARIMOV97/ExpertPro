import { csrftoken } from "./functions.js";

let kuzovChecked = [];
let ichkiChecked = [];

document.querySelector('button[name="detallar-tasdiqlash"]').addEventListener("click", function () {
    
    let extiyotQisimlariBtnBox = document.querySelector('.extiyot-qisimlari-check');
    extiyotQisimlariBtnBox.classList.remove('d-none');

    const carModelId = document.querySelector('input[name="model"]:checked').dataset.id;

    // Tanlangan checkboxlardan idlarni olish
    kuzovChecked = [];
    document.querySelectorAll('.kuzov-yechib-ornatish-accordion-body input[type="checkbox"]:checked')
        .forEach(ch => {
            const id = parseInt(ch.dataset.id);
            if (!isNaN(id)) kuzovChecked.push(id);
        });
    kuzovChecked = Array.from(new Set(kuzovChecked)); // takrorlarni olib tashlaydi

    ichkiChecked = [];
    document.querySelectorAll('.ichki-detallar-accordion-body input[type="checkbox"]:checked')
        .forEach(ch => {
            const id = parseInt(ch.dataset.id);
            if (!isNaN(id)) ichkiChecked.push(id);
        });
    ichkiChecked = Array.from(new Set(ichkiChecked));

    const list = document.querySelector("ul.spares");
    list.innerHTML = ""; // eski elementlarni tozalash

    // Ichki elementlarini frontendga chiqarish
    fetch(`http://127.0.0.1:8000/api/ichki-detail-coefficient/?car_model_id=${carModelId}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(item => {
                if (ichkiChecked.includes(item.id)) {
                    const li = document.createElement("li");
                    li.className = "spare px-3 d-flex";
                    li.dataset.id = item.id;
                    li.dataset.type = "ichki"; // faqat "ichki"
                    li.dataset.detailId = item.detail.id;
                    li.innerHTML = `
                        <img src="${item.detail.img}" alt="">
                        <p>${item.detail.name}</p>
                        <label class="mt-0">
                            <select name="level" class='border-none'>
                                <option value="1">1ta</option>
                                <option value="2">2ta</option>
                                <option value="3">3ta</option>
                                <option value="4">4ta</option>
                            </select>
                        </label>
                        <input class="number-of-items money flex-grow-1"" type="text" placeholder="Narxi">
                        <div class="trash-icon ms-auto">
                            <button class='btn' type='button'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z 
                                             M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z 
                                             M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z 
                                             M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z"></path>
                                </svg>
                            </button>
                        </div>
                    `;
                    list.appendChild(li);
                }
            });
        });

    // Kuzov elementlarini frontendga chiqarish
    fetch(`http://127.0.0.1:8000/api/kuzov-detail-coefficient/?car_model_id=${carModelId}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(item => {
                if (kuzovChecked.includes(item.id)) {
                    const li = document.createElement("li");
                    li.className = "spare px-3 d-flex";
                    li.dataset.id = item.id;
                    li.dataset.type = "kuzov"; // faqat "kuzov"
                    li.dataset.detailId = item.detail.id;
                    li.innerHTML = `
                        <img src="${item.detail.img}" alt="">
                        <p>${item.detail.name}</p>
                        <label class="mt-0">
                            <select name="level">
                                <option value="1">1ta</option>
                                <option value="2">2ta</option>
                                <option value="3">3ta</option>
                                <option value="4">4ta</option>
                            </select>
                        </label>
                        <input class="number-of-items money flex-grow-1"" type="text" placeholder="Narxi">
                        <div class="trash-icon ms-auto">
                            <button class='btn' type='button'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z 
                                             M 5 7 L 5 22 L 19 22 L 19 7 L 5 7 z 
                                             M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z 
                                             M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z"></path>
                                </svg>
                            </button>
                        </div>
                    `;
                    list.appendChild(li);
                }
            });
        });
        
});

// Trash button bosilganda idni arraydan ham o‘chirish
document.querySelector("ul.spares").addEventListener("click", function (e) {
    const btn = e.target.closest(".trash-icon button");
    if (!btn) return;

    const li = btn.closest("li.spare");
    if (!li) return;

    const id = parseInt(li.dataset.id);
    const type = li.dataset.type;

    if (type === "kuzov") {
        kuzovChecked = kuzovChecked.filter(i => i !== id);
    } else if (type === "ichki") {
        ichkiChecked = ichkiChecked.filter(i => i !== id);
    }

    li.remove();
});
