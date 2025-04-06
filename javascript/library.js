import { db, dbRef, get, child, update, onValue, ref } from './firebase.js';

const modal = document.getElementById("licenseModal");
const closeModalButton = document.getElementById("closeModal");
const totalPriceText = document.getElementById("total");
const buy_button = document.getElementById("buy_button");

const termCopies = document.getElementById("termCopies");
const termStreams = document.getElementById("termStreams");
const termProfit = document.getElementById("termProfit");



// Закрытие модального окна
document.getElementById("closeModal").addEventListener("click", () => {
  licenseModal.style.display = "none";
});

// Контейнер для отображения треков
const libraryContainer = document.querySelector('.library__container');

// Глобальная переменная для хранения текущего трека
let currentTrackPrices = {};
let currentTrackId = null;

// Функция для создания элемента audio-block
function createAudioBlock(track) {
  const audioBlock = document.createElement('div');
  audioBlock.className = 'audio-block';


  audioBlock.innerHTML = `
    <div class="image-container">
      <img src="${track.imageURL}" alt="Track Cover" class="cover-image">
      <i class="fa fa-play" aria-hidden="true"></i>
    </div>
    <h2 class="track-title">${track.name}</h2>
    <p class="author">${track.username}</p>
    <button class="buy-button" data-track-id="${track.id}">Buy now</button>
  `;

  libraryContainer.appendChild(audioBlock);

  const playButton = audioBlock.querySelector('.fa-play');
  const audioplayer = document.getElementById("audio-player");
  

  playButton.addEventListener('click', () => {
    const audio = document.getElementById('audio');
    const playPauseButton = document.getElementById('play-pause');
    const playPauseIcon = playPauseButton.querySelector('i');
    audioplayer.style.visibility = "visible";

    if (audio.src === track.previewURL) {
      if (audio.paused) {
        audio.play();
        playButton.classList.remove('fa-play');
        playButton.classList.add('fa-pause');
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
      } else {
        audio.pause();
        playButton.classList.remove('fa-pause');
        playButton.classList.add('fa-play');
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
      }
    } else {
      audio.src = track.previewURL;
      audio.play();
      playButton.classList.remove('fa-play');
      playButton.classList.add('fa-pause');
      playPauseIcon.classList.remove('fa-play');
      playPauseIcon.classList.add('fa-pause');
    }
  });

  // Обработчик кнопки "Buy License"
  const buyButton = audioBlock.querySelector('.buy-button');
  buyButton.addEventListener('click', () => {
    currentTrackId = track.id; // Устанавливаем ID текущего трека
    loadTrackPrices(track.id); // Загружаем цены из базы
    updateLicenseTerms(track.id);

    // Сбрасываем данные в модульном окне
    licenseBlocks.forEach(block => block.classList.remove('selected'));
    totalPriceText.textContent = 'Total: $0';
    termCopies.textContent = 'Distribute up to 0 copies';
    termStreams.textContent = '0 Online Audio Streams';
    termProfit.textContent = 'Non-profit Live Performances';
    
    modal.style.display = "block"; // Открыть модальное окно
  });


  

}

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY; // Текущее положение скролла
  const bgImage = document.querySelector('.library_bg_img');
  bgImage.style.transform = `translateY(${scrollPosition * 0.5}px)`; // Чем меньше множитель, тем медленнее эффект
});

// Функция для загрузки цен из Firebase
async function loadTrackPrices(trackId) {
  try {
    const pricesSnapshot = await get(child(dbRef(db), `tracks/${trackId}/prices`));
    if (pricesSnapshot.exists()) {
      currentTrackPrices = pricesSnapshot.val();

      // Обновляем цены в модальном окне
      document.getElementById("mp3Lease").setAttribute("data-price", currentTrackPrices.mp3 || "15");
      document.getElementById("mp3Lease").querySelector("p").textContent = `$${currentTrackPrices.mp3 || "15"}`;

      document.getElementById("wavLease").setAttribute("data-price", currentTrackPrices.wav || "30");
      document.getElementById("wavLease").querySelector("p").textContent = `$${currentTrackPrices.wav || "30"}`;

      document.getElementById("exclusive").setAttribute("data-price", currentTrackPrices.exclusive || "160");
      document.getElementById("exclusive").querySelector("p").textContent = `$${currentTrackPrices.exclusive || "160"}`;
    } else {
      console.error(`Prices not found for track ${trackId}`);
    }
  } catch (error) {
    console.error('Error loading track prices:', error);
  }
}

async function updateLicenseTerms(trackId) {
  try {
    // Получаем данные лицензий из Firebase
    const termsSnapshot = await get(child(dbRef(db), `tracks/${trackId}/licenseTerms`));

    if (termsSnapshot.exists()) {
      const licenseTerms = termsSnapshot.val();

      // Обработчики кликов на блоки лицензий
      const mp3Button = document.getElementById("mp3Lease");
      const wavButton = document.getElementById("wavLease");
      const exclusiveButton = document.getElementById("exclusive");

      if (mp3Button) {
        mp3Button.addEventListener("click", () => updateTerms("mp3", licenseTerms));
      }
      if (wavButton) {
        wavButton.addEventListener("click", () => updateTerms("wav", licenseTerms));
      }
      if (exclusiveButton) {
        exclusiveButton.addEventListener("click", () => updateTerms("exclusive", licenseTerms));
      }
    } else {
      console.error(`License terms not found for track ${trackId}`);
    }
  } catch (error) {
    console.error('Error loading license terms:', error);
  }
}

function updateTerms(licenseType, licenseTerms) {
  // Получаем условия для выбранного типа лицензии
  const terms = licenseTerms[licenseType] || {};

  // Обновляем данные на странице
  document.getElementById("termCopies").textContent = `Distribute up to ${terms.maxCopies || '0'} copies`;
  document.getElementById("termStreams").textContent = `${terms.maxStreams || '0'} Online Audio Streams`;
  document.getElementById("termProfit").textContent = terms.commercialUse ? 'Commercial Use Allowed' : 'Non-profit Live Performances';

  // Сохраняем данные в localStorage
  const termCopiesText = `${terms.maxCopies}`;
  const termStreamsText = `${terms.maxStreams}`;
  const termProfitText = terms.commercialUse ? 'Commercial Use Allowed' : 'Non-profit Live Performances';
  localStorage.setItem("termCopies", termCopiesText);
  localStorage.setItem("termStreams", termStreamsText);
  localStorage.setItem("termProfit", termProfitText);
}


// Функция загрузки треков из Firebase
async function loadTracks() {
  try {
    const tracksSnapshot = await get(child(dbRef(db), 'tracks/'));
    if (tracksSnapshot.exists()) {
      const tracks = tracksSnapshot.val();

      Object.entries(tracks).forEach(([id, track]) => {
        track.id = id; // Добавляем ID трека
        createAudioBlock(track);
      });
    } else {
      libraryContainer.innerHTML = '<p>No tracks found in the library.</p>';
    }
  } catch (error) {
    console.error('Error loading tracks:', error);
    libraryContainer.innerHTML = '<p>Error loading tracks. Please try again later.</p>';
  }
}

// Закрытие модального окна
closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Закрытие модального окна при нажатии вне его области
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Добавление событий для выбора лицензии
const licenseBlocks = document.querySelectorAll(".single__license");
licenseBlocks.forEach(block => {
  block.addEventListener("click", () => {
    licenseBlocks.forEach(b => b.classList.remove("selected"));
    block.classList.add("selected");

    const price = block.getAttribute("data-price");
    totalPriceText.textContent = `Total: $${price}`;

  });
});

// Обработчик кнопки "Buy"
buy_button.addEventListener("click", async () => {
  const selectedLicense = document.querySelector(".single__license.selected");
  if (!selectedLicense) {
    alert("Please select a license type.");
    return;
  }

  const licenseType = selectedLicense.id; // Тип лицензии (mp3Lease, wavLease, exclusiveLease)
  const price = selectedLicense.getAttribute("data-price");
  
  
  console.log('Лицензия: ' + licenseType + ' Цена: ' + price);
  console.log('ID: ' + currentTrackId );

  // Обновление данных трека в Firebase
  try {
    const trackRef = child(dbRef(db), `tracks/${currentTrackId}`);

    // Получение текущих данных трека
    const trackSnapshot = await get(trackRef);
    if (trackSnapshot.exists()) {
      const trackData = trackSnapshot.val();
      const author = await getArtistName(currentTrackId);

      
      localStorage.setItem("licenseType", licenseType);
      localStorage.setItem("price", price);
      localStorage.setItem("currentTrackId", currentTrackId);
      localStorage.setItem("artistname", author);

      // alert(`License purchased successfully! Total: $${price}`);
      window.location.href = '/checkout.html';
      modal.style.display = "none";
    } else {
      console.error(`Track ${currentTrackId} not found.`);
    }
  } catch (error) {
    console.error('Error updating track data:', error);
  }
});

async function getArtistName(trackId) {
  try {
    const trackSnapshot = await get(child(dbRef(db), `tracks/${trackId}/username`));
    if (trackSnapshot.exists()) {
      const artistName = trackSnapshot.val();
      console.log('Artist Name:', artistName);
      return artistName; // Возвращает имя артиста
    } else {
      console.error(`Username not found for track ${trackId}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching artist name:', error);
    return null;
  }
}

// Загрузка треков при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTracks);
