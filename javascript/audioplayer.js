const audio = document.getElementById('audio');
const playPauseButton = document.getElementById('play-pause');
const seekBar = document.getElementById('seek-bar');
const volumeBar = document.getElementById('volume-bar');
const playPauseIcon = playPauseButton.querySelector('i');

// Инициализация начальной иконки (Play)
playPauseIcon.classList.add('fa-play');

// Воспроизведение/пауза
playPauseButton.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseIcon.classList.remove('fa-play'); // Убираем класс play
    playPauseIcon.classList.add('fa-pause'); // Добавляем класс pause
  } else {
    audio.pause();
    playPauseIcon.classList.remove('fa-pause'); // Убираем класс pause
    playPauseIcon.classList.add('fa-play'); // Добавляем класс play
  }
});

// Перемотка
audio.addEventListener('timeupdate', () => {
  seekBar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

seekBar.addEventListener('input', () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// Громкость
volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value;
});