const modal = document.getElementById("licenseModal");
const closeModalButton = document.getElementById("closeModal");
const audioBlocks = document.querySelectorAll(".buy-button");
const licenseBlocks = document.querySelectorAll(".single__license");
const totalPriceText = document.getElementById("total");

const termCopies = document.getElementById("termCopies");
const termStreams = document.getElementById("termStreams");
const termProfit = document.getElementById("termProfit");




// Функция для открытия модального окна
audioBlocks.forEach(block => {
    block.addEventListener("click", () => {
        modal.style.display = "block"; // Открыть модальное окно

    });
});

// Закрытие модального окна
closeModalButton.addEventListener("click", () => {
    modal.style.display = "none"; // Закрыть модальное окно

});

// Закрытие модального окна при нажатии вне его области
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none"; // Закрыть модальное окно

    }
});

// Добавление события клика на каждый блок лицензии
licenseBlocks.forEach(block => {
    block.addEventListener("click", () => {
        // Убираем класс 'selected' у всех блоков
        licenseBlocks.forEach(b => b.classList.remove("selected"));
        // Добавляем класс 'selected' на выбранный блок
        block.classList.add("selected");
        // Получаем цену из атрибута data-price
        const price = block.getAttribute("data-price");
        const copies = block.getAttribute("data-copies");
        const streams = block.getAttribute("data-streams");
        const profit = block.getAttribute("data-profit");

        // Обновляем текст с общей суммой
        totalPriceText.textContent = `Total: $${price}`;
        termCopies.textContent = `Distribute up to ${copies} copies`;
        termStreams.textContent = `${streams} Online Audio Streams`;
        termProfit.textContent = `${profit} Live Performances`;
    });
});
