import { db, dbRef, set, get, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase.js';

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const tologin = document.getElementById("tologin");
const toregister = document.getElementById("toregister");

function logintab(e) {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "inline";
    tologin.style.display = "none";
    toregister.style.display = "inline";
}

function registertab(e) {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "inline";
    tologin.style.display = "inline";
    toregister.style.display = "none";
}

tologin.addEventListener('click', logintab);
toregister.addEventListener('click', registertab);


// Регистрация пользователя
document.getElementById("submitrg").addEventListener('click', function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("registerPassword").value;
  const login = document.getElementById("registerUsername").value; // Имя пользователя для сайта

  if (!email || !password || !login) {
    alert("All fields are required.");
    return;
  }

  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // После успешной регистрации сохраняем дополнительные данные (login) в базе данных
      set(dbRef(db, 'users/' + user.uid), { // Используем uid пользователя как уникальный идентификатор
        email: email,
        login: login
      })
      .then(() => {
        alert("Registration successful!");
        document.getElementById("registerForm").reset();
      })
      .catch((error) => {
        console.error("Error writing user data to the database:", error);
        alert("Registration error. Try again.");
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Registration error:", errorCode, errorMessage);
      alert("Registration error. Try again.");
    });
});
  


//Логин
document.getElementById("submitsn").addEventListener('click', async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim(); // Убираем пробелы в начале и конце
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("All fields are required.");
    return;
  }

  // Упростим регулярное выражение для проверки email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email)) {
    alert("Enter a valid email.");
    return;
  }

  try {
    // Попытка входа через Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Получение дополнительных данных о пользователе
    const userRef = dbRef(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      alert(`Welcome back, ${userData.login}!`);
      localStorage.setItem('username', userData.login);
      window.location.href = "upload.html";
    } else {
      alert("The user is not found in the database.");
    }
  } catch (error) {
    // Обработка ошибок Firebase
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error("Ошибка входа:", errorCode, errorMessage);

    switch (errorCode) {
      case 'auth/invalid-email':
        alert("Incorrect email format.");
        break;
      case 'auth/user-not-found':
        alert("No user with this email was found.");
        break;
      case 'auth/wrong-password':
        alert("Wrong password.");
        break;
      case 'auth/too-many-requests':
        alert("Too many failed login attempts. Try again later.");
        break;
      default:
        alert("Login error. Try again.");
    }
  }
});

const username = localStorage.getItem("username");
if (username) {
  window.location.href = '/upload.html';
}


