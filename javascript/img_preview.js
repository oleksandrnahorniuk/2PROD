const trackImageInput = document.getElementById('trackImage');
const imgPreview = document.getElementById('imgPreview');

trackImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  if (file) {
    const reader = new FileReader();

    // Считываем файл как URL
    reader.onload = function (e) {
      imgPreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
    };

    reader.readAsDataURL(file);
  } else {
    imgPreview.innerHTML = '<span>Upload Cover</span>'; // Если файл не выбран, отображаем текст
  }
});