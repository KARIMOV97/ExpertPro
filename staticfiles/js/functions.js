// CSRF token olish funksiyasi
function getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

// --------------------------GET--------------------------
export async function apiGet(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Xatolik: ${res.status}`);
    return await res.json();
}

// --------------------------POST--------------------------
export async function apiPost(url, data) {
    const res = await fetch(url, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken()  // CSRF token qo'shildi
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Xatolik: ${res.status}`);
    return await res.json();
}

// --------------------------PUT--------------------------
export async function apiPut(url, data) {
    const res = await fetch(url, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "X-CSRFToken": getCsrfToken()  // CSRF token qo'shildi
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Xatolik: ${res.status}`);
    return await res.json();
}

// --------------------------DELETE--------------------------
export async function apiDelete(url) {
    const res = await fetch(url, { 
        method: "DELETE",
        headers: {
            "X-CSRFToken": getCsrfToken()  // CSRF token qo'shildi
        }
    });
    if (!res.ok) throw new Error(`Xatolik: ${res.status}`);
    return true;
}

// --------------------------ALERT--------------------------
export function showBootstrapAlert(message, type = 'danger') {
    const alertEl = document.getElementById('formAlert');
    alertEl.textContent = message || `Iltimos ma'lumot kiriting`;
    alertEl.className = `alert alert-${type}`;
    alertEl.classList.remove('d-none');
    setTimeout(() => {
        alertEl.classList.add('d-none');
    }, 1000);
}

// --------------------------CSRF-TOKEN--------------------------

// 
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const csrftoken = getCookie("csrftoken");

// --------------------------CALENDAR--------------------------

export function makeCalendar(box, chosenYear, id){
    const select = document.createElement("select");
    select.className = `car-year-input-${id} form-select mb-3`;
    select.setAttribute("required", "")
    for (let year = 1940; year <= 2040; year++) {
        let option = document.createElement('option');
        option.value = year;
        if(year == chosenYear){
            // option.setAttribut('selected', 'selected')
            option.setAttribute('selected', 'selected')
        }
        option.textContent = year;
        select.appendChild(option)
    }
    box.appendChild(select);
}