import { db, dbRef, get, set, storage, storageRef, uploadBytes, getDownloadURL, remove, auth, signOut, deleteObject } from './firebase.js';

// Элементы страницы
const dropZone = document.getElementById('drop-zone');
const trackInput = document.getElementById('trackInput');
const uploadForm = document.getElementById('uploadForm');
const trackNameInput = document.getElementById('trackName');
const trackPriceInput = document.getElementById('trackPrice');
const trackPriceInput2 = document.getElementById('trackPrice2');
const trackPriceInput3 = document.getElementById('trackPrice3');
const trackPreview = document.getElementById('previewAudio');
const trackImageInput = document.getElementById('trackImage');
const username = localStorage.getItem("username");
const usernamedisp = document.getElementById('usernameDisplay');
const signoutbtn = document.getElementById('signout');
const profile_edit_btn = document.getElementById('profile_edit_btn');

const uploadModal = document.getElementById('uploadModal');
const closeModal = document.getElementById('closeModal');
let isEditing = false;

console.log('Юзернейм: ' + username);
usernamedisp.textContent = username;


if (!username) {
  // Если пользователь не вошел, перенаправляем на страницу регистрации
  window.location.href = '/signup.html';
}

// Элемент для отображения списка треков
const trackList = document.getElementById('trackList');

// Функция для загрузки треков из Firebase
async function loadTracks() {
  try {
    const tracksSnapshot = await get(dbRef(db, 'tracks'));
    const tracks = tracksSnapshot.val();

    // Очищаем текущий список
    trackList.innerHTML = '';

    if (tracks) {
      // Фильтруем треки, принадлежащие текущему пользователю
      const userTracks = Object.values(tracks).filter(track => track.username === username);

      if (userTracks.length > 0) {
        userTracks.forEach(track => {
          // Создаем элементы для отображения трека
          const trackItem = document.createElement('li');
          trackItem.classList.add('track-item');
       

          const trackImage = document.createElement('img');
          trackImage.src = track.imageURL;
          trackImage.alt = track.name;
          trackImage.classList.add('track-thumbnail');

          const trackInfo = document.createElement('div');
          trackInfo.classList.add('track-info');
          trackInfo.style.display = 'flex';  // Добавляем flexbox

          const trackName = document.createElement('p');
          trackName.textContent = track.name;
          trackName.classList.add('track-name');

// Создаем элемент иконки Font Awesome
const deleteIcon = document.createElement('i');
deleteIcon.classList.add('fa', 'fa-ban', 'delete-icon');
const editIcon = document.createElement('i');
editIcon.classList.add('fa', 'fa-cog', 'edit-icon');


// Обработчик события для иконки редактирования
editIcon.addEventListener('click', () => {
  let editingTrackId = Object.keys(tracks).find(key => tracks[key].name === track.name && tracks[key].username === track.username);
  console.log("editIcon");
  uploadModal.style.display = 'block'; // Показываем модальное окно
  isEditing = true;

  const trackRef = dbRef(db, 'tracks/' + editingTrackId);
  get(trackRef).then((snapshot) => {
    if (snapshot.exists()) {
      const trackData = snapshot.val();

      // Заполняем поля модального окна
      trackNameInput.value = trackData.name;
      trackPriceInput.value = trackData.prices.mp3;
      trackPriceInput2.value = trackData.prices.wav;
      trackPriceInput3.value = trackData.prices.exclusive;

      // Заполняем значения лицензий
      document.getElementById('pi_input').value = trackData.licenseTerms.mp3.maxCopies;
      document.getElementById('pi_input1').value = trackData.licenseTerms.mp3.maxStreams;
      document.getElementById('commercialUseToggle').checked = trackData.licenseTerms.mp3.commercialUse;

      document.getElementById('pi_input2').value = trackData.licenseTerms.wav.maxCopies;
      document.getElementById('pi_input3').value = trackData.licenseTerms.wav.maxStreams;
      document.getElementById('commercialUseToggle2').checked = trackData.licenseTerms.wav.commercialUse;


    } else {
      alert('Track not found.');
    }

  });
});


 // Обработчик события для иконки редактирования (удаление трека)
 deleteIcon.addEventListener('click', async () => {
  const trackId = Object.keys(tracks).find(key => tracks[key].name === track.name && tracks[key].username === track.username);
  if (trackId) {
    try {
      // Получаем данные трека
      const trackData = tracks[trackId];

      // Удаление трека из Storage
      const audioRef = storageRef(storage, trackData.audioURL);
      const imageRef = storageRef(storage, trackData.imageURL);

      await deleteObject(audioRef); // Удаляем аудио файл
      await deleteObject(imageRef); // Удаляем обложку

      // Удаление трека из Realtime Database
      await remove(dbRef(db, 'tracks/' + trackId));
      
      alert('Track and associated files deleted successfully!');
      loadTracks(); // Перезагружаем список после удаления
    } catch (error) {
      console.error('Error deleting track or files:', error);
      alert('Error deleting track or files: ' + error.message);
    }
  }
});

          // Собираем структуру элемента трека
          trackInfo.appendChild(editIcon);
          trackInfo.appendChild(deleteIcon);
          trackInfo.appendChild(trackName);
          trackItem.appendChild(trackImage);
          trackItem.appendChild(trackInfo);

          // Добавляем элемент в список
          trackList.appendChild(trackItem);
        });
      } else {
        trackList.innerHTML = '<li>No tracks uploaded yet.</li>';
      }
    } else {
      trackList.innerHTML = '<li>No tracks uploaded yet.</li>';
    }
  } catch (error) {
    console.error('Error loading tracks:', error);
    trackList.innerHTML = '<li>Error loading tracks. Please try again later.</li>';
  }





}

// Вызываем функцию загрузки треков при загрузке страницы
loadTracks();

profile_edit_btn.addEventListener('click', () =>{
  console.log("profileedit");
})

// Функция открытия модального окна
trackInput.addEventListener('change', (event) => {
  if (event.target.files.length > 0) {
    uploadModal.style.display = 'block'; // Показываем модальное окно
    
  }
});





// Функция закрытия модального окна
closeModal.addEventListener('click', () => {
  uploadModal.style.display = 'none'; // Скрываем модальное окно

  
});



// Закрытие модального окна при клике за его пределами
window.addEventListener('click', (event) => {
  if (event.target === uploadModal) {
    uploadModal.style.display = 'none';
  }
});





// Обработка перетаскивания трека
dropZone.addEventListener('click', () => trackInput.click());

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  handleTrackFile(file);
});

// Обработка выбора файла через диалоговое окно
trackInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  handleTrackFile(file);
});

// Функция обработки файла трека
function handleTrackFile(file) {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (file && (file.type === 'audio/mpeg' || fileExtension === 'mp3' || fileExtension === 'wav')) {
    dropZone.style.display = 'none';
    // uploadForm.style.display = 'block';
  } else {
    alert('Please upload a valid MP3 or WAV file.');
  }
}



// Обработка отправки формы
uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const trackFile = trackInput.files[0];
  const trackName = trackNameInput.value;
  const trackPrice = trackPriceInput.value;
  const trackPrice2 = trackPriceInput2.value;
  const trackPrice3 = trackPriceInput3.value;
  const trackImage = trackImageInput.files[0];
  const previewFile = trackPreview.files[0];

  


  // Получаем значения ползунков и чекбоксов для каждой лицензии
  const mp3License = {
    maxCopies: document.getElementById('pi_input').value,
    maxStreams: document.getElementById('pi_input1').value,
    commercialUse: document.getElementById('commercialUseToggle').checked
  };

  const wavLicense = {
    maxCopies: document.getElementById('pi_input2').value,
    maxStreams: document.getElementById('pi_input3').value,
    commercialUse: document.getElementById('commercialUseToggle2').checked
  };

  const exclusiveLicense = {
    maxCopies: "unlimited",  
    maxStreams: "unlimited", 
    commercialUse: true     
  };

  // Создаем объект для лицензий
  const licenseTerms = {
    mp3: mp3License,
    wav: wavLicense,
    exclusive: exclusiveLicense
  };

  if (trackFile && trackName && trackPrice && trackPrice2 && trackPrice3 && trackImage && previewFile) {
    try {
      // Prześlij plik audio do Firebase Storage
      const audioRef = storageRef(storage, 'tracks/' + trackFile.name);
      await uploadBytes(audioRef, trackFile);
      const audioURL = await getDownloadURL(audioRef);

      // Prześlij plik preview audio do Firebase Storage
      const previewRef = storageRef(storage, 'previews/' + previewFile.name);
      await uploadBytes(previewRef, previewFile);
      const previewURL = await getDownloadURL(previewRef);

      // Prześlij okładkę do Firebase Storage
      const imageRef = storageRef(storage, 'images/' + trackImage.name);
      await uploadBytes(imageRef, trackImage);
      const imageURL = await getDownloadURL(imageRef);

      // Zapisz metadane w bazie danych Firebase Realtime Database
      const trackData = {
        name: trackName,
        prices: {
          mp3: trackPrice,
          wav: trackPrice2,
          exclusive: trackPrice3,
        },
        audioURL: audioURL, 
        previewURL: previewURL, 
        imageURL: imageURL, 
        uploadTime: new Date().toISOString(),
        username: username,
        licenseTerms: licenseTerms 
      };









        // Добавление нового трека
        const trackRef = dbRef(db, 'tracks/' + new Date().getTime());
        await set(trackRef, trackData);

      

      alert('Track uploaded successfully!');
      window.location.reload();
    } catch (error) {
      alert('Error uploading track: ' + error.message);
      console.error('Upload Error:', error);
    }
  } else {
    alert('Please fill in all fields and upload files.');
  }
});


// Обработчик события для кнопки выхода из аккаунта
signoutbtn.addEventListener('click', async () => {
  try {
    // Выход из Firebase Authentication
    await signOut(auth);
    // Удаление имени пользователя из localStorage
    localStorage.removeItem('username');
    alert("You've logged out!")
    // Перенаправление на страницу входа
    window.location.href = '/signup.html';
  } catch (error) {
    console.error('Error signing out:', error);
    alert('Error signing out: ' + error.message);
  }
});


const toggleBtn = document.querySelector('.toggle-btn');
const toggleContent = document.querySelector('.toggle-content');

const toggleElements = {
  mp3: document.querySelector('.toggle-content-element-mp3'),
  wav: document.querySelector('.toggle-content-element-wav'),

};

const toggleBtns = {
  mp3: document.querySelector('.toggle-btn-mp3'),
  wav: document.querySelector('.toggle-btn-wav')

};

const inputs = [
  { input: document.querySelector("#pi_input"), value: document.querySelector("#value") },
  { input: document.querySelector("#pi_input1"), value: document.querySelector("#value1") },
  { input: document.querySelector("#pi_input2"), value: document.querySelector("#value2") },
  { input: document.querySelector("#pi_input3"), value: document.querySelector("#value3") }

];

// Обработчик для кнопки переключения видимости основного контента
toggleBtn.addEventListener('click', (event) => {
  event.preventDefault();
  toggleContent.style.display = toggleContent.style.display === 'block' ? 'none' : 'block';
  toggleBtn.textContent = toggleBtn.textContent === ' ▼ ' ? ' ▲ ' : ' ▼ ';
});

// Универсальная функция для обработки кнопок переключения элементов
function toggleVisibility(element, button) {
  element.style.display = element.style.display === 'flex' ? 'none' : 'flex';
  button.textContent = button.textContent === ' ▼ ' ? ' ▲ ' : ' ▼ ';
}

// Обработчики для кнопок каждой лицензии
Object.keys(toggleElements).forEach(key => {
  toggleBtns[key].addEventListener('click', (event) => {
    event.preventDefault();
    toggleVisibility(toggleElements[key], toggleBtns[key]);
  });
});

// Обработчики для обновления значений ползунков
inputs.forEach(({ input, value }) => {
  input.addEventListener("input", (event) => {
    value.textContent = event.target.value;
  });
});



