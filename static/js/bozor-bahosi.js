'use strict'
document.addEventListener('DOMContentLoaded', function() {
    let carYearChoose2Select = document.querySelector('.car-year-input-2')
    let ishlabChiqarishToxtatilganInputs = document.querySelectorAll('.ishlab-chiqarish-toxtatilgan-inputs')
    let jismoniyEskirishInputManual = document.querySelector('.jismoniy-eskirish-manual')
     let jismoniyEskirishOutput = document.querySelector('.jismoniy-eskirish')
    let bozorBahosiOutput = document.querySelector('.bozor-bahosi')
    let ishlabChiqarilganganYil = document.querySelector('.car-year-input-1')
    let analog1Input = document.querySelector('.analog1')
    let analog2Input = document.querySelector('.analog2')
    let analog3Input = document.querySelector('.analog3')   
    let ortachaNarxInput = document.querySelector('.ortacha-narx')
    let yangisiningNarxiInput = document.querySelector('.yangisining-narxi')
    let savdolashishKoefitsientiChoose = document.querySelector('.savdolashish-koefitsienti')
    let ishlabChiqarishdanToxtaganYil = document.querySelector('.car-year-input-2')
    let calculateButton = document.querySelector('.hisoblash')
    let bozorInputs = document.querySelectorAll('.bozor-bahosi-section input[type="number"]')
    let isEmpty = 0;
    let star
    // Parent elementni olish
    const manufacturingWrapper = document.querySelector('.is-manufacturing-stoped');
    const manufacturingRadioButtons = document.querySelectorAll('.is-manufacturing-stoped input[type="radio"]');
    //  -------------------------VARIABLES FOR AVTO-----------------------------------------------------
    let ortachaNarxValue 
    let jismoniyEskirishValue 
    let savdolashishKoefitsientiValue
    let yangisiningNarxiValue
    let analog1Value
    let analog2Value
    let analog3Value
    let ustaHaqqiValue
    let bozorBahosi
    //  ------------------------BOZOR BAHOSI VALIDATION-----------------------------------------------
    ishlabChiqarishdanToxtaganYil.setAttribute('disabled', 'disabled')
    manufacturingRadioButtons.forEach(radio => {
        radio.addEventListener("change", function() {
            if (this.value === "toxtadi") {
                carYearChoose2Select.removeAttribute("disabled"); // disabled atributini olib tashlash
                analog1Input.value = ""
                analog2Input.value = ""
                analog3Input.value = ""
                bozorBahosiOutput.value = ""
                ortachaNarxInput.value = ""
                ishlabChiqarishToxtatilganInputs.forEach(radio => {
                    radio.setAttribute('disabled','disabled')
                    radio.value = ""
                })
            }else{
                carYearChoose2Select.setAttribute('disabled', 'disabled')
                ishlabChiqarishToxtatilganInputs.forEach(radio => {
                    radio.removeAttribute('disabled')
                })
            }
        });
    });
    calculateButton.addEventListener('click',async function (e) {
        let kuzovSelect = document.querySelector('.kuzov-select')
        analog1Value = parseInt(analog1Input.value.replace(/\s/g, ""))
        analog2Value = parseInt(analog2Input.value.replace(/\s/g, ""))
        analog3Value = parseInt(analog3Input.value.replace(/\s/g, ""))
        savdolashishKoefitsientiValue = parseInt(savdolashishKoefitsientiChoose.value)
        e.preventDefault(); // Forma yuborilmasin
        isEmpty = 0;
        bozorInputs.forEach(field =>  {
            let value = field.value.trim();
            if(field.hasAttribute('disabled') || !(value === '')){
                field.style.border = '';
                star = field.closest('label')?.querySelector('pre');
                star.classList.remove('show-star');
                return
            }
            if (value === '') {
                star = field.previousElementSibling?.querySelector('pre');
                star.classList.add('show-star');
                field.style.border = '2px solid red';
                isEmpty++ ; 
            } else {
                isEmpty --
            }
            });
        
        if (isEmpty) {
       
        } else {
        // Validatsiyadan o'tdi
        ortachaNarxValue =  ((analog1Value + analog2Value + analog3Value)/3).toFixed(0)
        if(!ortachaNarxValue){
            ortachaNarxValue = 0
        }
        if(!ortachaNarxInput.value){
            ortachaNarxInput.value = ortachaNarxValue + ` so'm`
        }
        yangisiningNarxiValue = (parseInt(yangisiningNarxiInput.value.replace(/\s/g, "")))
        bozorBahosi = ortachaNarxValue * savdolashishKoefitsientiValue / 100
        if(!bozorBahosi){
            bozorBahosi = 0
        }
        bozorBahosiOutput.value = bozorBahosi             
                // faqat radio button bo'lsa ishlasin
            if (manufacturingRadioButtons[0].checked){
                jismoniyEskirishValue = (100*(yangisiningNarxiValue - bozorBahosi ) / yangisiningNarxiValue).toFixed(2)
                if(jismoniyEskirishValue >= 50){
                    jismoniyEskirishInputManual.removeAttribute('disabled','disabled')
                    
                }               
                jismoniyEskirishOutput.value = jismoniyEskirishValue + ` %`  

            } else if (manufacturingRadioButtons[1].checked) {
                
                let kuzovCoefficient 
                let kuzovId =  kuzovSelect.value
                let hozirgiYil = new Date().getFullYear();
                let manufacturingStopedYear = parseInt(ishlabChiqarishdanToxtaganYil.value)
                let haqiqiyHizmatMuddati = hozirgiYil - ishlabChiqarilganganYil.value
                let tabiiyJismoniyYemirilish
                let natijaviyJismoniyEskirish
                let functionalYemirilish = (hozirgiYil - manufacturingStopedYear) * 2
                if(functionalYemirilish > 20){
                    functionalYemirilish = 20
                }
                try {
                    const response = await fetch(`/api/kuzov-turi-yemirilish/?kuzov_id=${kuzovId}`);
                    const data = await response.json();
                    kuzovCoefficient = data[0].coefficient
                } catch (error) {
                    console.error('API xatolik:', error);
                }
                tabiiyJismoniyYemirilish = haqiqiyHizmatMuddati * kuzovCoefficient * 1.05 
                natijaviyJismoniyEskirish = (1 - (1 - functionalYemirilish / 100) * (1 - tabiiyJismoniyYemirilish / 100)) * 100
                if(natijaviyJismoniyEskirish >= 50){
                    jismoniyEskirishInputManual.removeAttribute('disabled','disabled')
                } 
                jismoniyEskirishOutput.value = natijaviyJismoniyEskirish + ` %`  
                jismoniyEskirishOutput.setAttribute('data-HJY', tabiiyJismoniyYemirilish)
                jismoniyEskirishOutput.setAttribute('data-FY', functionalYemirilish)
                jismoniyEskirishOutput.setAttribute('data-YY', kuzovCoefficient)
            }
        
        
        
        }
        isEmpty = 0
    })

})

