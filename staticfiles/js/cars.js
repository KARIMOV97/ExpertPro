// Word fayl generatsiya qilish
document.querySelector('.finish-tasdiqlash').addEventListener('click', async (e) => {
    e.preventDefault();
    const carModelsContainer = document.getElementById('car-models-container');
    let modelID
        const checkedRadio = carModelsContainer.querySelector('input[name="model"]:checked');
        if (checkedRadio) {
            modelID = checkedRadio.dataset.id 
        }
     
    let taqqoslandimi = document.querySelector("#texpassport-berilgan-joy")?.value;
    let taqqoslandimiJavobi = taqqoslandimi ? "таққосланди" : "таққосланмади";

    let xozirgiYil = new Date().getFullYear();

    // Kuzov detallarini yig‘ish
    const checkedBoxes = document.querySelectorAll('.kuzov-yechib-ornatish-accordion-body .last-checbox:checked');
    const tableKuzov = Array.from(checkedBoxes).map(checkbox => {
        const parentStuff = checkbox.closest('.stuff');
        const name = parentStuff.querySelector('p').textContent.trim();
        const coefficient = parseFloat(parentStuff.querySelector('.coefficient').textContent.trim());
        const soni = 1;
        const narx = (document.querySelector(".usta-haqqi").value * coefficient);
        const umumiy = (document.querySelector(".usta-haqqi").value * coefficient * soni);
        return { name, coefficient, soni, narx, umumiy };
    });

    // Ichki detallarni yig‘ish
    const checkedIchki = document.querySelectorAll('.ichki-detallar-accordion-body .last-checbox:checked');
    const tableIchki = Array.from(checkedIchki).map(checkbox => {
        const parentStuff = checkbox.closest('.stuff');
        const name = parentStuff.querySelector('p').textContent.trim();
        const coefficient = parseFloat(parentStuff.querySelector('.coefficient').textContent.trim());
        const soni = parseInt(parentStuff.querySelector('.detallar-soni').value) || 1;
        const narx = parseInt(document.querySelector(".usta-haqqi").value) * coefficient;
        const umumiy = narx * soni;
        return { name, coefficient, soni, narx, umumiy };
    });

    async function getVaqt(carModelId, detailId, darajaId) {
        try {
            let res = await fetch("http://127.0.0.1:8000/api/tamirlash-vaqti-yechiladigan/");
            let data = await res.json();

            // kerakli obyektni topamiz
            let item = data.find(obj =>
                obj.car_model.id == carModelId &&
                obj.detail.id == detailId &&
                obj.daraja.level == darajaId
            );
            return item ? item.vaqt : null; // topilsa vaqtni qaytaradi, topilmasa null
        } catch (err) {
            console.error("Xatolik:", err);
            return null;
        }
    }
     async function getVaqtYechilmaydigan(carModelId, detailId, darajaId) {
        try {
            let res = await fetch("http://127.0.0.1:8000/api/tamirlash-vaqti-yechilmaydigan/");
            let data = await res.json();

            // kerakli obyektni topamiz
            let item = data.find(obj =>
                obj.car_model.id == carModelId &&
                obj.detail.id == detailId &&
                obj.daraja.level == darajaId
            );
            return item ? item.vaqt : null; // topilsa vaqtni qaytaradi, topilmasa null
        } catch (err) {
            console.error("Xatolik:", err);
            return null;
        }
    }
    
    const checkedTamirYechiladigan = document.querySelectorAll('.yechiladigan-detallar-tamir-ul .last-checbox[name="tamir"]:checked');
    const tableTamirYechiladigan =await Promise.all( Array.from(checkedTamirYechiladigan).map(async checkbox => {
        const parentStuff = checkbox.closest('.stuff');
        let detalID = checkbox.value
        let levelID = parentStuff.querySelector('.tamirlash-darajasi-select').selectedOptions[0].dataset.level;
        // Name va tanlangan tamir darajasi
        const name = parentStuff.querySelector('p').textContent.trim();
        const tamirDarajasi = parentStuff.querySelector('.tamirlash-darajasi-select')?.selectedOptions[0]?.textContent.trim()
        const fullName = `${name} ${tamirDarajasi}`; // probel bilan qo‘shiladi
        // getVaqt(modelID, detal, tamir_turi)
        // Coefficient va soni
        const coefficient = await getVaqt(modelID, detalID, levelID)
        const soni = 1;

        // Usta haqqi inputdan
        const ustaHaqqi = parseInt(document.querySelector(".usta-haqqi").value|| 0);
        // Narx va umumiy
        const narx = ustaHaqqi * coefficient;
        const umumiy = narx * soni;

        return { fullName, coefficient, soni, narx, umumiy };
    }))
    const checkedTamirYechilmaydigan = document.querySelectorAll('.yechilmaydigan-detallar-tamir-ul .last-checbox[name="tamir"]:checked');
    const tableTamirYechilmaydigan = await Promise.all( Array.from(checkedTamirYechilmaydigan).map(async checkbox => {
        const parentStuff = checkbox.closest('.stuff');
        let detalID = checkbox.value
        let levelID = parseFloat(parentStuff.querySelector('.tamirlash-darajasi-select').selectedOptions[0].dataset.level);
        // Name va tanlangan tamir darajasi
        const name = parentStuff.querySelector('p').textContent.trim();
        const tamirDarajasi = parentStuff.querySelector('.tamirlash-darajasi-select')?.selectedOptions[0]?.textContent.trim()
        const fullName = `${name} ${tamirDarajasi}`; // probel bilan qo‘shiladi
        
        // Coefficient va soni
        const coefficient = await getVaqtYechilmaydigan(modelID, detalID, levelID)
        const soni = 1;

        // Usta haqqi inputdan
        const ustaHaqqi = parseInt(document.querySelector(".usta-haqqi").value|| 0);
        // Narx va umumiy
        const narx = ustaHaqqi * coefficient;
        const umumiy = narx * soni;

        return { fullName, coefficient, soni, narx, umumiy };
    }))
    // Almashadigan detallarini yig‘ish
    const almashadiganDetallar = Array.from(document.querySelectorAll('.spares .spare')).map(spare => {
        const name = spare.querySelector('p').textContent.trim();               // Nom
        const soni = parseInt(spare.querySelector('select[name="level"]').value) || 1;  // Tanlangan son
        const narx = parseInt(spare.querySelector('.number-of-items').value.replace(/\s/g, "")) || 0;   // Narx

        const umumiy = narx * soni; // Umumiy narx

        return { name, soni, narx, umumiy };
    });

    const materialsStaff = document.querySelectorAll(
    ".materials-list-last .form-check-input:checked"
    );

    const materials = Array.from(materialsStaff).map(checkbox => {
    // Har bir checked bo‘lgan checkboxning ota blokini topamiz
    const parent = checkbox.closest(".stuff");

    const name = parent.querySelector("span.stuff-input").innerText.trim();
    const quantity = parseFloat(parent.querySelector("input.miqdor").value);
    const unit = parent.querySelectorAll("input.miqdor")[1].value; // birlik
    const price = parseInt(parent.querySelector("input.mony").value);

    return { name, quantity, unit, price };
    });
    const checkedTamirBoxes = document.querySelectorAll('.last-checbox[name="tamir"]:checked');

    let umumiy_vaqt

//-----------------------------------------------------------Almashtirish uchun UTC----------------------------------------------------------------------------------
      let jamiVaqtAlmashtirishUTC = 0;
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/almashtiriladigan-UTC`);
            const json = await res.json();
            const kuzovItems = document.querySelectorAll('.spares .spare[data-type="kuzov"]');
            const almashtirishIds = Array.from(kuzovItems).map(item => item.dataset.detailId);
            const vaqtlar = json
                .filter(item => almashtirishIds.includes(String(item.detail.id)))
                .map(item => item.vaqt);
            jamiVaqtAlmashtirishUTC = (vaqtlar.reduce((sum, v) => sum + Number(v), 0)).toFixed(2);
        } catch (err) {
            console.error("Xatolik:", err);
        }

        // Kerak bo‘lsa geometrik murakkablikni qo‘shish
        const geomValue = parseInt(document.querySelector('.geometrik-murakkablik-select')?.value);
        if (geomValue === 2) jamiVaqtAlmashtirishUTC++;
        else if (geomValue === 3) jamiVaqtAlmashtirishUTC += 2;
        if(jamiVaqtAlmashtirishUTC == '0.00') jamiVaqtAlmashtirishUTC = '-'
//-----------------------------------------------------------Tamirlash yechiladigan uchun UTC----------------------------------------------------------------------------------

    const liElements = document.querySelectorAll('.yechiladigan-detallar-tamir-ul .stuff');
    const liElementsYechilmaydigan = document.querySelectorAll('.yechilmaydigan-detallar-tamir-ul .stuff');
    const yechiladiganDetalTamirTuri = [];
    const yechilmaydiganDetalTamirTuri = [];
    liElements.forEach(li => {
        const tamirInput = li.querySelector('input[name="tamir"]');
        const select = li.querySelector('.tamirlash-darajasi-select');

        if (tamirInput.checked) {
            yechiladiganDetalTamirTuri.push({
                detal: tamirInput.value,
                tamir_turi: select.selectedOptions[0].dataset.level // data-level qiymati
            });
        }
    });
   
    liElementsYechilmaydigan.forEach(li => {
        const tamirInput = li.querySelector('input[name="tamir"]');
        const select = li.querySelector('.tamirlash-darajasi-select');

        if (tamirInput.checked) {
            yechilmaydiganDetalTamirTuri.push({
                detal: tamirInput.value,
                tamir_turi: select.selectedOptions[0].dataset.level // data-level qiymati
            });
        }
    });
    let sumTamir2 = 0;
    let sumTamir3 = 0;
    async function getCoefficients() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/tamirlash-yechiladigan-utc/');
            const data = await response.json();
            data.forEach(item => {
                yechiladiganDetalTamirTuri.forEach(item2 => {
                    if(item.detal == item2.detal && item.tamir_turi == item2.tamir_turi){
                        if(item.tamir_turi == 2){
                            sumTamir2 += parseFloat(item.coefficient)
                        } 
                        if(item.tamir_turi== 3){
                            sumTamir3 += parseFloat(item.coefficient)
                        }

                }})
            }) 
            const response2 = await fetch('http://127.0.0.1:8000/api/tamirlash-yechilmaydigan-utc/');
            const data2 = await response2.json();
            data2.forEach(item => {
                yechilmaydiganDetalTamirTuri.forEach(item2 => {
                    if(parseInt(item.detal) == parseInt(item2.detal) && parseInt(item.tamir_turi) == parseInt(item2.tamir_turi)){
                        if(item.tamir_turi == '2'){
                            sumTamir2 += parseFloat(item.coefficient)
                        } 
                        if(item.tamir_turi== '3'){
                            sumTamir3 += parseFloat(item.coefficient)
                        }

                }})
            }) 
            return { sumTamir2, sumTamir3 };
       
    } catch (error) {
        console.error(error);
    }
    }
    // Funksiyani chaqiramiz
   const tamirSums = await getCoefficients();
   let boyoqlashUTClist = [
  "Юргизгич қопқоғи",
  "Олд ўнг қаноти",
  "Олд чап қаноти",
  "Ўнг ён устки қисми",
  "Чап ён устки қисми",
  "Орқа ўнг қанот",
  "Орқа чап қанот",
  "Олд ўнг эшик",
  "Олд чап эшик",
  "Орқа ўнг эшик",
  "Орқа чап эшик",
  "Юкхона қопқоғи",
  "Том панели"
];
   let boyoqlashUTC

   // barcha 'boyoq' inputlarini tanlaymiz
    const boyoqInputs = document.querySelectorAll('input[name="boyoq"]');

    // natija uchun massiv
    const boyoqTexts = [];

    // har bir inputni tekshiramiz
    boyoqInputs.forEach(input => {
        if (input.checked) {  // agar checked bo'lsa
            // li elementini topamiz
            const li = input.closest('li.stuff');
            if (li) {
                const p = li.querySelector('p');  // li ichidagi <p> ni olamiz
                if (p) {
                    boyoqTexts.push(p.textContent.trim());  // matnni massivga qo'shamiz
                }
            }
        }
    });
    const commonCount = boyoqlashUTClist.filter(text => {
        const exists = boyoqTexts.includes(text);
        return exists; // filter uchun shart
    }).length;
    if(commonCount > 0){
        if(commonCount == 1){
            boyoqlashUTC = 0.5
        } else if(commonCount > 1){
            boyoqlashUTC = 0.5 + (commonCount - 1) * 0.35
        }
    } else {
        boyoqlashUTC = '-'
    }
    let umumiyTamir = tableTamirYechiladigan.concat(tableTamirYechilmaydigan)
    let umumiyUTC = 0
    if(typeof jamiVaqtAlmashtirishUTC === 'number'){
         umumiyUTC += jamiVaqtAlmashtirishUTC
    }
    if(typeof boyoqlashUTC === 'number') 
        {
            umumiyUTC += boyoqlashUTC
    }
    if(tamirSums['sumTamir2'] > 0) 
        {
            umumiyUTC += tamirSums['sumTamir2']
    } 
    if(tamirSums['sumTamir3'] > 0) {
        umumiyUTC += tamirSums['sumTamir3']
    }
    // Serverga yuboriladigan ma'lumot
   function numberToWords(num) {
        num = parseInt(num)
        if (num === 0) return "нол";

        const belowTwenty = ["", "бир", "икки", "уч", "тўрт", "беш", "олти", "етти", "саккиз", "тўққиз", "ўн", "ўн бир", "ўн икки", "ўн уч", "ўн тўрт", "ўн беш", "ўн олти", "ўн етти", "ўн саккиз", "ўн тўққиз"];
        const tens = ["", "", "йигирма", "ўттиз", "қирқ", "эллик", "олтмиш", "етмиш", "саксон", "тўқсон"];
        const thousands = ["", "минг", "миллион", "миллиард"];

        function helper(n) {
            let str = "";
            if (n >= 100) {
                str += belowTwenty[Math.floor(n / 100)] + " юз ";
                n %= 100;
            }
            if (n >= 20) {
                str += tens[Math.floor(n / 10)] + " ";
                n %= 10;
            }
            if (n > 0) {
                str += belowTwenty[n] + " ";
            }
            return str.trim();
        }

        let result = "";
        let i = 0;
        while (num > 0) {
            let chunk = num % 1000;
            if (chunk > 0) {
                result = helper(chunk) + (thousands[i] ? " " + thousands[i] : "") + " " + result;
            }
            num = Math.floor(num / 1000);
            i++;
        }

        return result.trim();
    }

        if(!umumiyUTC){
            umumiyUTC = '-'
        }
        let umumiyNarxExtiyotQisimlar =  parseInt(document.querySelector("#umumiy-narx-extioytqisimlar").value).toFixed(2)
        if(!umumiyNarxExtiyotQisimlar){
            umumiyNarxExtiyotQisimlar = '-'
        }
        let UTCdanKeyingibozorBahosi = parseInt(document.querySelector(".bozor-bahosi")?.value) || 0 * umumiyUTC 
       
       
        let KGMK = document.querySelector('.geometrik-murakkablik-select').value
        let GeometrikMurakkablikCoefficienti
        async function getCoefficient(modelID, KGMK) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/kuzov-geometrik-murakkablik-coefitsienti/?car_model=${modelID}&geometrik_murakkablik=${KGMK}`);
                const data = await response.json();
                return data[0]?.coefficient; // data bo'lmasa undefined qaytaradi
            } catch (err) {
                console.error("Xato:", err);
                return null;
            }
        }
        let UTCdanKeyingiNarx =  (parseInt(document.querySelector(".bozor-bahosi")?.value) * umumiyUTC / 100).toFixed(2) 
        GeometrikMurakkablikCoefficienti = await getCoefficient(modelID, KGMK);
        let natijaviySumma = (parseInt(document.querySelector("#umumiy-narxi-usta-haqqi")?.value || 0) + parseInt(document.querySelector("#umumiy-narx-materiallar")?.value || 0) + parseInt(document.querySelector("#jismoniy-eskirishdan-keyingi-narx")?.value || 0)  + (Number(UTCdanKeyingiNarx) || 0)).toFixed(2)
        console.log('usta haqqi umumiy narx: ', parseInt(document.querySelector("#umumiy-narxi-usta-haqqi")?.value || 0))
        console.log('Umumiy narx materiallar: ', parseInt(document.querySelector("#umumiy-narx-materiallar")?.value || 0))
        console.log('Jismoniy eskirishdan keyingi narx: ', parseInt(document.querySelector("#jismoniy-eskirishdan-keyingi-narx")?.value || 0))
        console.log('UTCdan keyingi narx: ', (Number(UTCdanKeyingiNarx) || 0).toFixed(2))
        console.log('natijaviySumma', natijaviySumma)
        document.querySelector('#natijaviy-summa').value = natijaviySumma
        const natijaviySummaYozuvda = numberToWords(natijaviySumma)
        let carYear = parseInt(document.querySelector(".car-year-input-1").value)
        let ustama 

        if(xozirgiYil - carYear <= 5){
            ustama = 0
        } else if(xozirgiYil - carYear > 5 && xozirgiYil - carYear < 8){
            ustama = 10
        } else {
            ustama = 20
        }
        const slots = document.querySelectorAll('.img-upload-slot');
        const urls = Array.from(slots)
            .map(slot => slot.dataset.fileUrl)
            .filter(url => url); // faqat tanlanganlar
         async function getShablon() {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/shablonlar`);
                const data = await response.json();
                return data.map(item => item.fayl_nomi)
            } catch (err) {
                console.error("Xato:", err);
                return null;
            }
        }
    function selectStartWith(arr, son) {
        return arr.filter(f => f.startsWith(son))
    }
    let shablonlar = await getShablon()
    let yilKichik = (xozirgiYil - carYear) >= 5
    let odometrSozmi = document.querySelector('input[name="status"]:checked')?.value === "soz"
    let ishlabChiqarish = document.querySelector('input[name="production"]:checked')?.value === 'toxtamadi';
    let shablonNomi
    console.log('yilKichik', yilKichik)
    console.log('odometrSozmi', odometrSozmi)
    console.log('ishlabChiqarish', ishlabChiqarish)
    if(!yilKichik && !odometrSozmi && !ishlabChiqarish){
        shablonNomi = selectStartWith(shablonlar, '1')
        console.log(1)
    }else if(!yilKichik && !odometrSozmi && ishlabChiqarish){
        shablonNomi = selectStartWith(shablonlar, '5')
        console.log(5)
    }else if(!yilKichik && odometrSozmi && !ishlabChiqarish){
        shablonNomi = selectStartWith(shablonlar, '3')
        console.log(3)
    }else if(!yilKichik && odometrSozmi && ishlabChiqarish){
        shablonNomi = selectStartWith(shablonlar, '7')
        console.log(7)
    }else if(yilKichik && !odometrSozmi && !ishlabChiqarish){
        shablonNomi = selectStartWith(shablonlar, '2')
        console.log(2)
    }else if(yilKichik && !odometrSozmi && ishlabChiqarish){
        shablonNomi = selectStartWith(shablonlar, '6')
        console.log(6)
    }else if(yilKichik && odometrSozmi && !ishlabChiqarish){
        shablonNomi = selectStartWith(shablonlar, '4')
        console.log(4)
    }else{
        shablonNomi = selectStartWith(shablonlar, '8')
        console.log(8)
    }
    const texpasportBerilganligi = document.querySelector('.texpassport-box input[name="status-texpassport"]:checked')?.value === "taqqoslandi"
    let texpassportBerilganmi 
    if(texpasportBerilganligi){
        texpassportBerilganmi = "таққосланди"
    } else {
        texpassportBerilganmi = "таққосланмади"
    }
    console.log(shablonNomi)
    let data = {
        shablonNomi:shablonNomi[0], 
        rasm1: urls[0],
        rasm2: urls[1],
        rasm3: urls[2],
        rasm4: urls[3],
        rasm5: urls[4],
        rasm6: urls[5],
        ustama: ustama,
        UTCdanKeyingiNarx: UTCdanKeyingiNarx,
        GMC:parseFloat(GeometrikMurakkablikCoefficienti),
        UTCdanKeyingiBozorBahosi: UTCdanKeyingibozorBahosi,
        natijaviySummaYozuvda:natijaviySummaYozuvda,
        umumiyUTC:umumiyUTC.toFixed(2),
        boyoqlashUTC: boyoqlashUTC,
        sumTamir2: parseFloat(tamirSums.sumTamir2) ? tamirSums.sumTamir2.toFixed(2) : "-",
        sumTamir3: parseFloat(tamirSums.sumTamir3) ? tamirSums.sumTamir3.toFixed(2) : "-",
        UTCAlmashtirish: jamiVaqtAlmashtirishUTC,
        almashtirishGeometrikegrilik: umumiy_vaqt, 
        HJY: document.querySelector('.jismoniy-eskirish').dataset.hjy,
        FY: document.querySelector('.jismoniy-eskirish').dataset.fy,
        YY: document.querySelector('.jismoniy-eskirish').dataset.yy,
        materiallar: materials,
        almashadiganDetallar: almashadiganDetallar,
        umumiyTamir: umumiyTamir,
        tableTamirYechiladigan:tableTamirYechiladigan,
        tableTamirYechilmaydigan:tableTamirYechilmaydigan,
        tableIchki: tableIchki,
        tableKuzov: tableKuzov,
        davlatRaqami: document.querySelector("#car-number")?.value?.toUpperCase() || "",
        dvigatelRaqami: document.querySelector(".dvigatel-number-input")?.value || "",
        egasiningIsmi: document.querySelector("#full-name-input")?.value || "",
        expert: document.querySelector(".expert-select")?.selectedOptions[0].text || "",
        fotoaparatModeli: document.querySelector("#fotoaparat-rusumi")?.value || "",
        kuzovTuri: document.querySelector(".kuzov-select")?.selectedOptions[0].text || "",
        kMC: document.querySelector(".geometrik-murakkablik-select").selectedOptions[0].text || "",
        kMT: document.querySelector('.geometrik-murakkablik-select')?.value || "",
        kuzovRaqami: document.querySelector(".vin-code-input")?.value?.trim() || "",
        model: document.querySelector('input[name="model"]:checked')?.nextElementSibling?.textContent.trim() || "",
        rangi: document.getElementById("color-of-the-car")?.value || "",
        uzatmalarQutisi: document.querySelector(".uzatmalar-qutisi")?.selectedOptions[0].text || "",
        xulosaRaqami: document.querySelector("#xulosa-raqami")?.value || "",
        xulosaSanasi: document.querySelector("#xulosa-sanasi")?.value || "",
        arizaSanasi: document.querySelector("#ariza-sanasi")?.value || "",
        texpassportBerilganJoy: document.querySelector("#texpassport-berilgan-joy")?.value || "",

        // IntegerField (Number)
        hozirgiYil: xozirgiYil,
        arizaTushganKun: document.querySelector("#ariza-sanasi")?.value || "",
        ishlabChiqarilganYil: parseInt(document.querySelector(".car-year-input-1")?.value) || 0,
        odometrKorsatkichi: parseInt(document.getElementById("odometrKorsatkichi")?.value) || 0,
        odometrNorma: parseInt(document.getElementById("odometr-norma")?.value) || 0,
        ishlabChiqarishdanToxtaganYil: parseInt(document.querySelector(".car-year-input-2")?.value) || 0,
        savdolashishcoefficienti: document.getElementById("scoreSelect")?.value || "",

        // BooleanField
        ishlabChiqarish,
        odometrSozmi,
        texpassportBerilganmi,

        // FloatField (Number)
        texpasportBerilganligi: taqqoslandimiJavobi,
        chiqishToxtaganYil: xozirgiYil - parseInt(document.querySelector(".car-year-input-2")?.value) || 0,
        haqiqiyHizmatMuddati :  xozirgiYil - parseInt(document.querySelector(".car-year-input-1")?.value) || 0,
        tanlanganJismoniyEskirish: document.querySelector('.jismoniy-eskirish-manual').value || 0,
        jismoniyEskirishdanKeyingiSumma: document.getElementById("jismoniy-eskirishdan-keyingi-narx").value || 0,
        analog1OdometrKorsatkichi: parseInt(document.getElementById("analog1-odometr-korstkichi")?.value.replace(/\s/g, "")) || 0,
        analog2OdometrKorsatkichi: parseInt(document.getElementById("analog2-odometr-korstkichi")?.value.replace(/\s/g, "")) || 0,
        analog3OdometrKorsatkichi: parseInt(document.getElementById("analog3-odometr-korstkichi")?.value.replace(/\s/g, "")) || 0,
        analogNarxi1: parseInt(document.getElementById("analog1-tan-narxi")?.value.replace(/\s/g, "")) || 0,
        analogNarxi2: parseInt(document.getElementById("analog2-tan-narxi")?.value.replace(/\s/g, "")) || 0,
        analogNarxi3: parseInt(document.getElementById("analog3-tan-narxi")?.value.replace(/\s/g, "")) || 0,
        boyoqlashVaqti: parseFloat(document.querySelector(".boyoqlash-input")?.value) || 0,
        silliqlashVaqti: parseFloat(document.querySelector(".silliqlash-input")?.value) || 0,
        soatigaTolanadiganIshHaqqi: parseInt(document.querySelector(".usta-haqqi")?.value) || 0,
        umumiyUstaHaqqi: parseInt(document.querySelector("#umumiy-narxi-usta-haqqi").value).toFixed(2) || 0,
        yangisiningNarxi: parseInt(document.querySelector(".yangisining-narxi").value.replace(/\s/g, "")).toFixed(2) || 0,
        ortachaNarx:  parseInt(document.querySelector(".ortacha-narx")?.value) || 0,
        jismoniyEskirish:  parseFloat(document.querySelector(".jismoniy-eskirish")?.value) || 0,
        bozorBahosi:  parseInt(document.querySelector(".bozor-bahosi")?.value) || 0,
        umumiyNarxExtiyotQisimlar: umumiyNarxExtiyotQisimlar || 0,
        jismoniyEskirishdanKeyingiNarx: parseInt(document.querySelector("#jismoniy-eskirishdan-keyingi-narx")?.value).toFixed(2) || 0,
        umumiyNarxMateriallar: parseInt(document.querySelector("#umumiy-narx-materiallar")?.value).toFixed(2) || 0,
        natijaviySumma: natijaviySumma
    };
   
    // So‘rov yuborish
    fetch("http://127.0.0.1:8000/generate-word/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            let downloadBtn = document.querySelector(".btn-download");
            downloadBtn.disabled = false;
            downloadBtn.dataset.url = resp.url;
            downloadBtn.dataset.filename = resp.filename;
        } else {
            alert("Xatolik: " + resp.error);
        }
    })
    .catch(err => console.error("Xatolik:", err));
    // fetch("http://127.0.0.1:8000/save-car/", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    // })
    // .then(res => res.json())
    // .then(resp => {
    //     if (resp.success) {
    //         alert("Ma’lumot saqlandi! ID: " + resp.id);
    //     } else {
    //         alert("Xatolik: " + resp.error);
    //     }
    // })
    // .catch(err => console.error("Xatolik:", err));
});



// Word faylni yuklab olish
document.querySelector(".btn-download").addEventListener("click", e => {
    let btn = e.currentTarget;  
    let fileUrl = btn.dataset.url;
    let filename = btn.dataset.filename;

    if (!fileUrl) {
        alert("Fayl mavjud emas!");
        return;
    }

    let a = document.createElement("a");
    a.href = fileUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
});


