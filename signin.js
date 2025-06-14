//fix lại chỉ sài auth và firestore

import {
  db,
  ref,
  set,
  get,
  child,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "./config.js";

const username = document.querySelector("#inputUser");
const password = document.querySelector("#inputPassword");
const confirm = document.querySelector("#inputConfirm");
const gmail = document.querySelector("#inputGmail");
const userCheck = /^[a-zA-Z]+$/;
const gmailCheck = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    return window.location.replace("../html/mainpage.html");
  }
});
document.querySelector("#submit").addEventListener("click", async (event) => {
  event.preventDefault();
  if (!username.value || !password.value || !confirm.value || !gmail.value) {
    alert("Vui lòng điền đầy đủ thông tin !");
    return;
  }
  if (!userCheck.test(username.value) || !gmailCheck.test(gmail.value)) {
    alert("Vui lòng điền đúng cú pháp !");
    return;
  }
  if (confirm.value !== password.value) {
    alert("Vui lòng điền đúng mật khẩu !");
    return;
  }
  // const dbRef = ref(db);
  // const gmailRef = child(dbRef, "users/" + btoa(gmail.value)); //btoa để mã hóa để mấy ký tự đặc biệt sẽ đọc được và sẽ không bị lỗi
  // sử dụng atob() để mã hóa ngược lại bản gốc

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      gmail.value,
      password.value
    );
    const uid = userCredential.user.uid; //tự động tạo id xong gắn id bên bên firestore

    // const gmailsnapshot = await get(gmailRef);
    // if (gmailsnapshot.exists()) {
    //   alert("Tài khoản đã tồn tại !");
    //   return;
    // }

    //realtime
    // await set(gmailRef, {
    //   db_gmail: gmail.value,
    //   db_username: username.value,
    //   db_password: password.value,
    // });

    //firestore
    await setDoc(doc(getFirestore(), "users", uid), {
      disname: username.value,
      password: password.value,
      gmail: gmail.value,
      createAt: serverTimestamp(),
      avatarUrl: "",
      like_count: 0,
      comment_count: 0,
      post_count: 0,
    });
    alert("Đăng kí thành công");
    window.location.href = "../html/login.html";
  } catch (error) {
    alert(error.message);
  }
  // get(gmailRef).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     alert("Tài khoản đã tồn tại !");
  //   } else {
  //     //tạo dữ liệu trong firestore
  //     addDoc(collection(ft, "user"), {
  //       disname: username.value,
  //       createAt: serverTimestamp(),
  //     })
  //       //tạo dữ liệu trong database(realtime)
  //       .then(() => {
  //         set(gmailRef, {
  //           db_gmail: gmail.value,
  //           db_username: username.value,
  //           db_password: password.value,
  //         })
  //           .then(() => {
  //             alert("Đăng kí thành công");
  //             window.location.href = "../html/login.html";
  //           })
  //           .catch((error) => {
  //             alert(error.message);
  //           });
  //       });
  //   }
  // });
});

//code tự viết

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

document.getElementById("confirmEye").addEventListener("click", function () {
  if (confirm.type === "password") {
    confirm.type = "text";
    document.getElementById("confirmEye").classList.remove("fa-eye");
    document.getElementById("confirmEye").classList.add("fa-eye-slash");
  } else {
    confirm.type = "password";
    document.getElementById("confirmEye").classList.remove("fa-eye-slash");
    document.getElementById("confirmEye").classList.add("fa-eye");
  }
});

//code chatgpt
// const passwordEye = document.querySelector("#passwordEye");
// const confirmEye = document.querySelector("#confirmEye");

// passwordEye.addEventListener("click", function () {
//   const isHidden = password.type === "password";
//   password.type = isHidden ? "text" : "password";
//   //chỗ dấu hỏi chấm này là theo cấu trúc : "cho giá trị để so sánh" ? "giá trị nếu đúng" : "giá trị nếu sai"
//   //thì nếu giá trị để so sánh mà đúng như yêu cầu thì nó sẽ trả về giá trị nếu đúng và ngược lại
//   passwordEye.classList.toggle("fa-eye");
//   passwordEye.classList.toggle("fa-eye-slash");
//   //phần này khi có hàm toggle thì nó chỉ dành cho có 2 sự lựa chọn
//   //nó sẽ thay đổi theo cách có - > chưa có, chưa có -> có
//   //nếu có trên 3 toggle thì nó sẽ bị loạn thì nó sẽ thành 1 có 2 không hoặc 1 không 2 có
// });

// confirmEye.addEventListener("click", function () {
//   const isHidden = confirm.type === "password";
//   confirm.type = isHidden ? "text" : "password";

//   confirmEye.classList.toggle("fa-eye");
//   confirmEye.classList.toggle("fa-eye-slash");
// });

//phần này là thay thế cho trường hợp có 3 toggle

// let passwordState = 0; // 0: hiện, 1: ẩn, 2: ẩn đặc biệt

// passwordEye.addEventListener("click", function () {
//   // Xoay vòng trạng thái
//   passwordState = (passwordState + 1) % 3; //phần này nó lấy số dư thì thành 1 2 0 và như thế tạo ra được con số để chọn trạng thái

//   // Reset tất cả icon class
//   passwordEye.classList.remove("fa-eye", "fa-eye-slash", "fa-eye-x");

//   // Cập nhật theo trạng thái
//   if (passwordState === 0) {
//     passwordInput.type = "text";
//     passwordEye.classList.add("fa-eye");
//   } else if (passwordState === 1) {
//     passwordInput.type = "password";
//     passwordEye.classList.add("fa-eye-slash");
//   } else {
//     passwordInput.type = "password";
//     passwordEye.classList.add("fa-eye-x");
//   }
// });
