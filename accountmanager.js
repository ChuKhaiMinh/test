import {
  signInWithEmailAndPassword,
  auth,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "./config.js";
document.addEventListener("DOMContentLoaded", () => {
  const password = document.querySelector("#password");
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
});

const userCheck = /^[a-zA-Z]+$/;
const avatarImg = document.querySelector("#avatar");
const avatarButton = document.querySelector("#avatar_button");
const avatarDisname = document.querySelector("#avatar_disname");
const aboutUser = document.querySelector("#about_user");
const createContainer = document.querySelector(".create_container");
const createInput = document.querySelector("#create_input");
const createButton = document.querySelector("#create_button");
const showDisname = document.querySelector("#disname");
const showPassword = document.querySelector("#password");
const disnameButton = document.querySelector("#username_button");
const passwordButton = document.querySelector("#password_button");
const deleteButton = document.querySelector("#delete_button");
const logoutButton = document.querySelector("#logout_button");
const deleteContainer = document.querySelector(".delete_container");
const deleteSure = document.querySelector("#delete_sure");
const deleteCancel = document.querySelector("#delete_cancel");
const reauthPassword = document.querySelector("#reauth_password");
const changedisnameContainer = document.querySelector(
  ".changedisname_container"
);
const changeDisname = document.querySelector("#changedisname");
const changedisnameInput = document.querySelector("#changedisname_input");
const changedisnameButton = document.querySelector("#changedisname_button");
const changedisnameClose = document.querySelector("#changedisname_close");
const changepasswordContainer = document.querySelector(
  ".changepassword_container"
);
const changePassword = document.querySelector("#changepassword");
const changepasswordOldinput = document.querySelector(
  "#changepassword_oldinput"
);
const changepasswordNewinput = document.querySelector(
  "#changepassword_newinput"
);
const changepasswordButton = document.querySelector("#changepassword_button");
const changepasswordClose = document.querySelector("#changepassword_close");
const avatarContainer = document.querySelector(".avatar_container");
const avatarFile = document.querySelector("#avatar_file");
const avatarUpload = document.querySelector("#avatar_upload");
const avatarDelete = document.querySelector("#avatar_delete");
const avatarClose = document.querySelector("#avatar_close");
// Thông tin Cloudinary
const CLOUD_NAME = "djdzfh2td"; // đổi thành tên của bạn
const UPLOAD_PRESET = "JSI-final"; // preset tạo ở bước 1

//check đăng nhập tài khoản
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    return window.location.replace("signin.html");
  }
  const uid = user.uid;
  //show infor
  try {
    const fieldAll = (await getDoc(doc(getFirestore(), "users", uid))).data();
    showDisname.textContent = fieldAll.disname;
    avatarDisname.textContent = fieldAll.disname;
    showPassword.value = fieldAll.password;
    if (!fieldAll.avatarUrl) {
      avatarImg.src = "avatar.png";
    } else {
      avatarImg.src = fieldAll.avatarUrl;
    }
  } catch (error) {
    console.log(error.message);
  }

  //popup

  //changeavatar
  avatarButton.addEventListener("click", function (event) {
    event.preventDefault();
    avatarContainer.style.display =
      avatarContainer === "block" ? "none" : "block";
  });
  avatarClose.addEventListener("click", function (event) {
    event.preventDefault();
    avatarContainer.style.display = "none";
  });
  avatarDelete.addEventListener("click", async (event) => {
    event.preventDefault();
    await updateDoc(doc(getFirestore(), "users", uid), {
      avatarUrl: "",
    });
    alert("Đổi ảnh đại diện thành công !");
    avatarContainer.style.display = "none";
    window.location.href = "accountmanager.html";
  });
  avatarUpload.addEventListener("click", async (event) => {
    event.preventDefault();

    const file = avatarFile.files[0];
    if (!file) {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    // 3.2) Tạo FormData và đính kèm file + upload preset
    const formData = new FormData();
    formData.append("file", file); // trường "file" bắt buộc
    formData.append("upload_preset", UPLOAD_PRESET); // trường preset để Cloudinary xác thực unsigned

    try {
      // 3.3) Gửi POST tới Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json(); // Cloudinary trả về JSON chứa secure_url, public_id, v.v.

      if (!data.secure_url) {
        throw new Error("Upload thất bại");
      }

      const imageUrl = data.secure_url; // link đến file ảnh trên Cloudinary

      // 3.4) Cập nhật Firestore
      await updateDoc(doc(getFirestore(), "users", uid), {
        avatarUrl: imageUrl,
      });
      alert("Đổi ảnh đại diện thành công !");
      avatarContainer.style.display = "none";
      window.location.href = "accountmanager.html";
    } catch (error) {
      console.log(error.message);
    }
  });
  //aboutuser
  aboutUser.addEventListener("click", function (event) {
    event.preventDefault();
    if (
      createContainer.style.display == "none" ||
      createContainer.style.display == ""
    ) {
      createContainer.style.display = "block";
    } else {
      createContainer.style.display = "none";
    }
  });
  createButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!createInput.value) {
      alert("Vui lòng điền nội dung !");
    }
    try {
      await updateDoc(doc(getFirestore(), "users", uid), {
        about_user: createInput.value,
      });
      alert("Đăng tiểu sử thành công !");
      createContainer.style.display = "none";
      window.location.href = "accountmanager.html";
    } catch (error) {
      console.log(error.message);
    }
  });

  //changedisname
  disnameButton.addEventListener("click", function (event) {
    event.preventDefault();
    changedisnameContainer.style.display =
      changedisnameContainer === "block" ? "none" : "block";
  });
  changedisnameClose.addEventListener("click", function (event) {
    event.preventDefault();
    changedisnameContainer.style.display = "none";
  });
  changedisnameButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!userCheck.test(changedisnameInput.value)) {
      alert("Vui lòng điền đúng cú pháp");
      return;
    }
    await updateDoc(doc(getFirestore(), "users", uid), {
      disname: changedisnameInput.value,
    });
    alert("Đổi tên thành công");
    changedisnameContainer.style.display = "none";
    window.location.href = "accountmanager.html";
  });

  //password
  passwordButton.addEventListener("click", function (event) {
    event.preventDefault();
    changepasswordContainer.style.display =
      changepasswordContainer.style.display === "block" ? "none" : "block";
  });
  changepasswordClose.addEventListener("click", function (event) {
    event.preventDefault();
    changepasswordContainer.style.display = "none";
  });
  changepasswordButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!changepasswordOldinput.value || !changepasswordNewinput.value) {
      alert("Vui lòng điền đầy đủ thông tin !");
      return;
    }
    try {
      const passwordCredential = EmailAuthProvider.credential(
        user.email,
        changepasswordOldinput.value
      );
      await updateDoc(doc(getFirestore(), "users", uid), {
        password: changepasswordNewinput.value,
      });
      await reauthenticateWithCredential(user, passwordCredential);
      await updatePassword(user, changepasswordNewinput.value);
      alert("Đổi mật khẩu thành công !");
      changepasswordContainer.style.display = "none";
      window.location.href = "accountmanager.html";
    } catch (error) {
      console.log(error.message);
    }
  });

  //delete
  deleteContainer.style.display = "none";

  deleteButton.addEventListener("click", function (event) {
    event.preventDefault();
    deleteContainer.style.display =
      deleteContainer.style.display === "flex" ? "none" : "flex";
  });
  deleteCancel.addEventListener("click", function (event) {
    event.preventDefault();
    deleteContainer.style.display = "none";
  });
  deleteSure.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!reauthPassword.value) {
      alert("Vui lòng nhập mật khẩu !");
      return;
    }
    try {
      //Re-authenticate
      const deleteCredential = EmailAuthProvider.credential(
        user.email,
        reauthPassword.value
      );
      await reauthenticateWithCredential(user, deleteCredential);
      await deleteDoc(doc(getFirestore(), "users", uid));
      await deleteUser(user);
    } catch (error) {
      alert(error.message);
    }
  });

  //đăng xuất
  logoutButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message);
    }
  });
});
