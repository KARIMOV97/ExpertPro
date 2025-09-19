const checkedTamirBoxes = document.querySelectorAll('.last-checbox[name="tamir"]:checked');

// Checked bo'lgan detail id larini arrayga olamiz
const detailIds = Array.from(checkedTamirBoxes).map(box => box.value);