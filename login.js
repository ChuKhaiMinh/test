import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
} from "./config.js";
const gmail = document.querySelector("#inputGmail");
const password = document.querySelector("#inputPassword");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    return window.location.replace("../html/mainpage.html");
  }
});

document.querySelector("#submit").addEventListener("click", async (event) => {
  event.preventDefault();
  if (!gmail.value || !password.value) {
    alert("Vui lòng điền đầy đủ thông tin !");
    return;
  }

  // realtime
  // const dbRef = ref(db);
  // const gmailRef = child(dbRef, "users/" + btoa(gmail.value));

  // get(gmailRef)
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       const data = snapshot.val();
  //       if (data.db_password === password.value) {
  //         alert("Đăng nhập thành công !");
  //         window.location.href = "../html/mainpage.html";
  //       } else {
  //         alert("Sai mật khẩu !");
  //       }
  //     } else {
  //       alert("Tài khoản không tồn tại !");
  //     }
  //   })
  //   .catch((error) => {
  //     alert(error.message);
  //   });

  //auth
  try {
    await signInWithEmailAndPassword(auth, gmail.value, password.value);
    alert("Đăng nhập thành công !");
    window.location.href = "../html/mainpage.html";
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("passwordEye").addEventListener("click", function () {
  if (password.type === "password") {
    password.type = "text";
    document.getElementById("passwordEye").classList.remove("fa-eye");
    document.getElementById("passwordEye").classList.add("fa-eye-slash");
  } else {
    password.type = "password";
    document.getElementById("passwordEye").classList.remove("fa-eye-slash");
    document.getElementById("passwordEye").classList.add("fa-eye");
  }
});
