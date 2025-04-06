import { db, dbRef, get, child, update, onValue, ref } from './firebase.js';
import { initializePayPalButton } from './paypal.js';


const termCopies = localStorage.getItem("termCopies");
const termStreams = localStorage.getItem("termStreams");
const termProfit = localStorage.getItem("termProfit");

const artistName = localStorage.getItem("artistname");
const licenseType = localStorage.getItem("licenseType");
const price = localStorage.getItem("price");
const currentTrackId = localStorage.getItem("currentTrackId");
const agreereading = document.getElementById("agreereading");
const paymentmethodblock = document.getElementById("payment-method__block");

const closeModalButton = document.getElementById('closeModal');
const modal = document.getElementById('contractModal');
const agreeButton = document.getElementById('agreeButton');
const checkout__right = document.getElementById('checkout__right');
const payment_method = document.getElementById('payment_method');
let contractProcessing = true;


console.log(licenseType, price, currentTrackId, termCopies, termStreams, termProfit, artistName);

function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // День с ведущим нулем
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяц с ведущим нулем (январь = 0)
    const year = today.getFullYear(); // Год
    return `${day}.${month}.${year}`;
}

paymentmethodblock.addEventListener('focusin', () => {
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
})



checkout__right.addEventListener('click', () => {

if(contractProcessing === true) {
    alert('You need to sign a license contract before you pay!')
}

});


// Функция открытия модального окна
agreereading.addEventListener('click', () => {
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
});

// Функция закрытия модального окна
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
});

// Закрытие модального окна по клику на "Agree"
agreeButton.addEventListener('click', () => {

    const buyerFullName = document.getElementById('buyerFullName').value;
    const buyerSignature = document.getElementById('buyerSignature').value;
    const buyerEmail = document.getElementById('buyerEmail').value;

    if (!buyerFullName || !buyerSignature || !buyerEmail) {
        alert("All fields are required.");
        return;
      }

    else{
        alert('You have agreed to the contract!');
        console.log(buyerFullName, buyerEmail, buyerSignature)
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        contractProcessing = false;
        document.querySelector('.payment-method').style.pointerEvents = 'auto';
        document.querySelector('.checkout__right').style.cursor = 'auto';
    }

});

// Закрытие модального окна по клику вне его области
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
});



// Функция для получения данных трека из Firebase по ID
function getTrackData(trackId) {
    const trackRef = child(dbRef(db), 'tracks/' + trackId);
    return get(trackRef).then((snapshot) => {
        if (snapshot.exists()) {
            const trackData = snapshot.val(); // Получаем данные трека
            return trackData;
        } else {
            console.log("No data available");
            return null;
        }
    }).catch((error) => {
        console.error("Error getting track data: ", error);
        return null;
    });
}

function updateCheckoutPage(trackData) {
    if (trackData) {
        // Обновление названия трека
        const trackNameElement = document.querySelector('.element__name');
        trackNameElement.textContent = trackData.name;

        // Обновление лицензии
        const licenseNameElement = document.querySelector('.element__license__name');
        licenseNameElement.textContent = licenseType;

        // Обновление цены
        const priceElement = document.querySelector('.element__price__data');
        priceElement.textContent = `$${price}`;

        // Обновление изображения трека
        const trackImageElement = document.querySelector('.element__image');
        trackImageElement.src = trackData.imageURL;  // Предположим, что image содержит URL изображения

        // Обновление общей суммы в правой части
        const totalpricespan = document.querySelector('.total-price-span');
        totalpricespan.textContent = `Total: $${price}`;
    }
}

// Вызов функции для обновления информации на странице при загрузке
document.addEventListener('DOMContentLoaded', async () => {
    if (currentTrackId) {
        const trackData = await getTrackData(currentTrackId); // Получаем данные трека по ID
        updateCheckoutPage(trackData); // Обновляем страницу с данными
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializePayPalButton(price);
    const datePlaceholder = document.querySelector('#currentDate'); 
    const artistNameSign = document.querySelector('#artistName'); 
    const artistSingature = document.querySelector('#artistSingature'); 
    const licenseStreams = document.querySelector('#maxStreams'); 
    const licenseCopies = document.querySelector('#maxCopies');
    const licensecommericalUse = document.querySelector('#commericalUse');
    const licenseType1 = document.querySelector('#licenseType');
    const ownershipRightsElement = document.getElementById("ownership-rights");

    if (datePlaceholder) {
        datePlaceholder.textContent = getCurrentDate(); // Подставить текущую дату
        artistNameSign.textContent = artistName;
        artistSingature.textContent = artistName;
        licenseStreams.textContent = termStreams;
        licenseCopies.textContent = termCopies;
        licensecommericalUse.textContent = termProfit;
        if (licenseType === "exclusive") {
            ownershipRightsElement.innerHTML = `
                <strong>Ownership Rights</strong>: The Licensee will retain full ownership and copyright to the original music track upon purchase. The Licensor transfers all rights to the Track to the Licensee upon the completion of this Agreement.
            `;
        }
        else { licenseType1.textContent = licenseType;}
        
    }
});
export {currentTrackId};
