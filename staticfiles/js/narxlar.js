let KuzovCoefficient = 0;
let kuzovMurakkablikSumma = 0;
let totalTamirlashVaqtiYechiladiganlar = 0;
let totalTamirlashVaqtiYechilmaydiganlar = 0;
let silliqlashSumm 
let boyoqlashSumm
let umumiyNarxMateriallar
let umumiyUstaHaqqi
let jismoniyEskirishdanKeyingiNarx

document.querySelector('.boyoqlash-check-button').addEventListener('click', async e => {
    // inputni tozalaymiz
    let boyoqlashInput = document.querySelector('.boyoqlash-input');
    boyoqlashInput.value = '';

    let yechiladiganBoyoqlashVaqt = 0;
    let yechilmaydiganBoyoqlashVaqt = 0;

    // tanlangan yechiladigan detallarning inputlari
    let yechiladiganBoyoqlash = document.querySelectorAll(
        '.yechiladigan-detallar-tamir-ul input[name="boyoq"]:checked'
    );

    // yechilmaydigan detallarning inputlari
    let yechilmaydiganBoyoqlash = document.querySelectorAll(
        '.yechilmaydigan-detallar-tamir-ul input[name="boyoq"]:checked'
    );

    // agar car_model radio kerak bo‘lsa, shuni ham oling
    let selectedCarModel = document.querySelector('#car-models-container input[name="model"]:checked');
    let carModelId =selectedCarModel.getAttribute('data-id')  // agar tanlanmagan bo‘lsa 1

    // yechiladigan detallardan fetch
    const promisesYechiladigan = Array.from(yechiladiganBoyoqlash).map(detal => {
        return fetch(`http://127.0.0.1:8000/api/boyoqlash-yechiladigan/?detail=${detal.value}&car_model=${carModelId}`)
            .then(res => res.json())
            .then(data => (data.length > 0 ? data[0].vaqt : 0));
    });

    // yechilmaydigan detallardan fetch
    const promisesYechilmaydigan = Array.from(yechilmaydiganBoyoqlash).map(detal => {
        return fetch(`http://127.0.0.1:8000/api/boyoqlash-yechilmaydigan/?detail=${detal.value}&car_model=${carModelId}`)
            .then(res => res.json())
            .then(data => (data.length > 0 ? data[0].vaqt : 0));
    });

    // barcha fetch'larni kutamiz
    const resultsYechiladigan = await Promise.all(promisesYechiladigan);
    const resultsYechilmaydigan = await Promise.all(promisesYechilmaydigan);



    // yig‘ish
    yechiladiganBoyoqlashVaqt = resultsYechiladigan.reduce((sum, v) => sum + (v || 0), 0);
    yechilmaydiganBoyoqlashVaqt = resultsYechilmaydigan.reduce((sum, v) => sum + (v || 0), 0);


    // umumiy boyoqlashSumma va 2 xonagacha yaxlitlash
    boyoqlashSumm = (yechiladiganBoyoqlashVaqt || 0) + (yechilmaydiganBoyoqlashVaqt || 0);
    boyoqlashInput.value = boyoqlashSumm.toFixed(2);

});


document.querySelector('.boyoqlash-check-button').addEventListener('click', async e => {
    // inputni tozalaymiz
    let silliqlashInput = document.querySelector('.silliqlash-input');
    silliqlashInput.value = '';

    let yechiladiganSilliqlashVaqt = 0;
    let yechilmaydiganSilliqlashVaqt = 0;

    // tanlangan yechiladigan detallarning inputlari
    let yechiladiganSilliqlash = document.querySelectorAll(
        '.yechiladigan-detallar-tamir-ul input[name="boyoq"]:checked'
    );

    // yechilmaydigan detallarning inputlari
    let yechilmaydiganSilliqlash = document.querySelectorAll(
        '.yechilmaydigan-detallar-tamir-ul input[name="boyoq"]:checked'
    );

    // agar car_model radio kerak bo‘lsa, shuni ham oling
    let selectedCarModel = document.querySelector('#car-models-container input[name="model"]:checked');
    let carModelId = selectedCarModel.getAttribute('data-id')

    // yechiladigan detallardan fetch
    const promisesYechiladigan = Array.from(yechiladiganSilliqlash).map(detal => {
        return fetch(`http://127.0.0.1:8000/api/silliqlash-yechiladigan/?detail=${detal.value}&car_model=${carModelId}`)
            .then(res => res.json())
            .then(data => (data.length > 0 ? data[0].vaqt : 0));
    });

    // yechilmaydigan detallardan fetch
    const promisesYechilmaydigan = Array.from(yechilmaydiganSilliqlash).map(detal => {
        return fetch(`http://127.0.0.1:8000/api/silliqlash-yechilmaydigan/?detail=${detal.value}&car_model=${carModelId}`)
            .then(res => res.json())
            .then(data => (data.length > 0 ? data[0].vaqt : 0));
    });

    // barcha fetch'larni kutamiz
    const resultsYechiladigan = await Promise.all(promisesYechiladigan);
    const resultsYechilmaydigan = await Promise.all(promisesYechilmaydigan);


    // yig‘ish
    yechiladiganSilliqlashVaqt = resultsYechiladigan.reduce((sum, v) => sum + (v || 0), 0);
    yechilmaydiganSilliqlashVaqt = resultsYechilmaydigan.reduce((sum, v) => sum + (v || 0), 0);


    // umumiy silliqlashSumma va 2 xonagacha yaxlitlash
     silliqlashSumm = (yechiladiganSilliqlashVaqt || 0) + (yechilmaydiganSilliqlashVaqt || 0);
    silliqlashInput.value = silliqlashSumm.toFixed(2);


});

document.querySelector("button[name='detallar-tasdiqlash']").addEventListener('click', () => {
    const kuzovContainer = document.querySelector(".kuzov-yechib-ornatish-accordion-body");

    kuzovContainer.querySelectorAll(".stuff").forEach(div => {
    const checkbox = div.querySelector(".last-checbox");
    if (checkbox.checked) {
        const coeff = parseFloat(div.querySelector(".coefficient").textContent) || 0;
        KuzovCoefficient += coeff;
    }
    });

    const container = document.querySelector(".ichki-detallar-accordion-body");

    function hisoblaYigindi() {
        let sum = 0;

        const checkedBoxes = container.querySelectorAll(".last-checbox:checked");

        checkedBoxes.forEach(box => {
            const stuff = box.closest(".stuff"); // shu checkbox qaysi blokda bo‘lsa
            const select = stuff.querySelector("select.detallar-soni");
            const coefficient = stuff.querySelector(".coefficient");

            const soni = parseInt(select.value, 10); 
            const coeff = parseFloat(coefficient.textContent);

            sum += soni * coeff;
        });
        return sum.toFixed(2);
    }
    let ichkiSumma = hisoblaYigindi()
    
})





document.querySelector(".boyoqlash-check-button").addEventListener('click', async () => {
    totalTamirlashVaqtiYechiladiganlar = 0;
    totalTamirlashVaqtiYechilmaydiganlar = 0;
    try {
        let carModelId = document.querySelector('input[name="model"]:checked')?.dataset.id;
        let murakkablikId = document.querySelector('.geometrik-murakkablik-select').value;
        let res = await fetch(`http://127.0.0.1:8000/api/kuzov-geometrik-murakkablik-coefitsienti/?car_model=${carModelId}&geometrik_murakkablik=${murakkablikId}`);
        let data = await res.json();

        if (data.length > 0) {
            kuzovMurakkablikSumma = data[0].coefficient;
            // shu yerda keyingi hisob-kitoblarni davom ettirishingiz mumkin
        } else {
            
        }
    } catch (err) {
        console.error("Xato:", err);
    }


    let carModelId = document.querySelector('input[name="model"]:checked')?.dataset.id;
    if (!carModelId) {
        console.log("Avtomobil modeli tanlanmagan!");
        return;
    }
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
    // Barcha checked tamir checkboxlarni olish
    let checkedTamirlarYechiladiganlar = document.querySelectorAll('input[name="tamir"]:checked');
    for (let checkbox of checkedTamirlarYechiladiganlar) {
        let detailId = checkbox.value;
        let li = checkbox.closest("li");
        let daraja = li.querySelector('.tamirlash-darajasi-select').value;
        try {
            let res = await fetch(
                `http://127.0.0.1:8000/api/tamirlash-vaqti-yechiladigan/?car_model=${carModelId}&detail=${detailId}&daraja=${daraja}`
            );
            let data = await res.json();
            if (data.length > 0) {
                totalTamirlashVaqtiYechiladiganlar += parseFloat(data[0].vaqt);
            } else {
                console.log(`Detail ID ${detailId} uchun vaqt topilmadi`);
            }
        } catch (err) {
            console.error("Xato:", err);
        }
    }

    // Barcha checked tamir checkboxlarni olish (yechilmaydiganlar)
        let checkedTamirlarYechilmaydiganlar = document.querySelectorAll('input[name="tamir"]:checked');
        for (let checkbox of checkedTamirlarYechilmaydiganlar) {
            let detailId = checkbox.value;
            let li = checkbox.closest("li");
            let daraja = li.querySelector('.tamirlash-darajasi-select').value;
            try {
                let res = await fetch(
                    `http://127.0.0.1:8000/api/tamirlash-vaqti-yechilmaydigan/?car_model=${carModelId}&detail=${detailId}&daraja=${daraja}`
                );
                let data = await res.json();
                if (data.length > 0) {
                    totalTamirlashVaqtiYechilmaydiganlar += parseFloat(data[0].vaqt);
                } else {
                    console.log(`Yechilmaydigan Detail ID ${detailId} uchun vaqt topilmadi`);
                }
            } catch (err) {
                console.error("Xato:", err);
            }
        }

        let umumiyUstaHaqqiInput = document.querySelector('#umumiy-narxi-usta-haqqi')
        let ishHaqiSoatiga = document.querySelector('.usta-haqqi').value
        umumiyUstaHaqqi = ((boyoqlashSumm + silliqlashSumm + parseFloat(KuzovCoefficient) + parseFloat(kuzovMurakkablikSumma) + parseFloat(totalTamirlashVaqtiYechiladiganlar) + parseFloat(totalTamirlashVaqtiYechilmaydiganlar)) * ishHaqiSoatiga).toFixed(2)
        umumiyUstaHaqqiInput.value = parseFloat(umumiyUstaHaqqi)?.toFixed(2) || 0 + ' So\'m'
         
});
document.querySelector(".extiyot-qisimlari-check-button").addEventListener("click", async () => {
  function hisoblaUmumiyNarx() {
    let umumiy = 0;

    document.querySelectorAll(".spares .spare").forEach(li => {
      let soni = parseInt(li.querySelector("select[name='level']").value, 10) || 0;
      let narx = parseFloat(li.querySelector(".number-of-items").value.replace(/\s/g, "")) || 0;
      umumiy += soni * narx;
    });

    return umumiy;
  }

  const extiyotQismlariUmumiyNarx = hisoblaUmumiyNarx();
  document.querySelector("#umumiy-narx-extioytqisimlar").value = extiyotQismlariUmumiyNarx.toFixed(2);

  // Jismoniy eskirish foizini olish
  let jismoniyEskirishInput = document.querySelector(".jismoniy-eskirish");
  let jismoniyEskirishFoizi = parseFloat(jismoniyEskirishInput.value) || 0;
  if(jismoniyEskirishFoizi > 50){
    jismoniyEskirishFoizi = parseFloat(document.querySelector('.jismoniy-eskirish-manual').value)
  }
  if(jismoniyEskirishFoizi < 10){
    jismoniyEskirishFoizi = 0
  }
  // Agar foiz masalan "20" bo‘lsa → 20% = 0.2 qilib olish kerak
  jismoniyEskirishdanKeyingiNarx = extiyotQismlariUmumiyNarx * (1 - jismoniyEskirishFoizi / 100);

  document.querySelector("#jismoniy-eskirishdan-keyingi-narx").value = jismoniyEskirishdanKeyingiNarx.toFixed(2);
});


document.querySelector(".btn-materiallar-check").addEventListener("click", async () => {

  async function hisoblaMateriallarUmumiy() {
    return new Promise((resolve) => {
      let umumiy = 0;

      // Har bir li .stuff elementini aylanish
      document.querySelectorAll(".materials-list-last .stuff").forEach(li => {
        // Miqdor inputini olish
        let miqdor = parseFloat(li.querySelector("input.miqdor").value) || 0;
        // Narx inputini olish
        let narx = parseFloat(li.querySelector("input.mony").value) || 0;

        // Agar checkbox belgilangan bo‘lsa hisobga qo‘shamiz
        let checkbox = li.querySelector(".last-checbox");
        if (checkbox && checkbox.checked) {
          umumiy += miqdor * narx;
        }
      });

      resolve(umumiy); // umumiy summani qaytarish
    });
  }

  try {
    // async/await bilan hisoblash
    umumiyNarxMateriallar = await hisoblaMateriallarUmumiy();

    // Natijani inputga yozamiz
    document.querySelector("#umumiy-narx-materiallar").value = umumiyNarxMateriallar.toFixed(2);
  } catch (err) {
    console.error("Xatolik:", err);
  }

});


document.querySelector(".finish-tasdiqlash").addEventListener('click', async () => { 
    // Usta haqqini olish (agar input bo‘lsa)
    let umumiyUstaHaqqi = parseFloat(document.querySelector("#umumiy-narxi-usta-haqqi")?.value) || 0;

    // Jismoniy eskirishdan keyingi narx
    let jismoniyEskirishdanKeyingiNarx = parseFloat(document.querySelector("#jismoniy-eskirishdan-keyingi-narx")?.value) || 0;

    // Materiallar narxi
    let umumiyNarxMateriallar = parseFloat(document.querySelector(".umumiy-narx-materiallar")?.value) || 0;

    // Natijaviy summani hisoblash
    let natijaviySumma = document.querySelector('#natijaviy-summa');
    natijaviySumma.value = (umumiyUstaHaqqi + jismoniyEskirishdanKeyingiNarx + umumiyNarxMateriallar).toFixed(2);
});


