const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')
const indexsignupbtn = document.getElementById('index__signup-btn');
const username = localStorage.getItem("username");
if (window.location.pathname === "/index.html") {
  if (username) {

    indexsignupbtn.textContent = "My Account";
  }
}

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});



