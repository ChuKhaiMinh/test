import {
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
  signInWithEmailAndPassword,
  auth,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  get,
} from "./config.js";

const avatarManager = document.querySelector("#avatar_manager");
const chatBox = document.querySelector("#chat_box");
const hotNews = document.querySelector("#hot_news");
const newsContainer = document.querySelector(".news_container");
const thoughtCreate = document.querySelector("#thought");
const createContainer = document.querySelector(".create_container");
const userName = document.querySelector("#user_name");
const userAvatar = document.querySelector("#user_avatar");
const randomAvatar = document.querySelector("#random_profile");
const profileContainer = document.querySelector(".profile_container");
const profileClose = document.querySelector("#profile_close");
//dự án tương lai

// const like = document.querySelector("#like");
// const likeCount = document.querySelector("#like_count");
// const dislike = document.querySelector("#dislike");
// const dislikeCount = document.querySelector("#dislike_count");
// const reactionInput = document.querySelector("#reaction");
// const reactionSubmit = document.querySelector("#reaction_submit");
// const comment1 = document.querySelector("comment_1");
// const comment2 = document.querySelector("comment_2");
// const comment3 = document.querySelector("comment_3");
// const like1 = document.querySelector("#like_1");
// const like2 = document.querySelector("#like_2");
// const like3 = document.querySelector("#like_3");
// const post1 = document.querySelector("#post_1");
// const post2 = document.querySelector("#post_2");
// const post3 = document.querySelector("#post_3");

const createInput = document.querySelector("#create_input");
const createButton = document.querySelector("#create_button");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    return (window.location.replace = "../html/signin.html");
  }
  const uid = user.uid;
  //show infor
  try {
    const fieldAll = (await getDoc(doc(getFirestore(), "users", uid))).data();
    userName.textContent = fieldAll.disname;
    if (!fieldAll.avatarUrl) {
      userAvatar.src = "../src/img/avatar.png";
    } else {
      userAvatar.src = fieldAll.avatarUrl;
    }
  } catch (error) {
    alert(error.message);
  }
  //mở các trang khác
  avatarManager.addEventListener("click", function (event) {
    window.location.href = "../html/accountmanager.html";
  });
  chatBox.addEventListener("click", function (event) {
    window.location.href = "../html/messagebox.html";
  });
  hotNews.addEventListener("click", function (event) {
    event.preventDefault();
    //   newsContainer.style.display = "block";
    if (
      newsContainer.style.display == "none" ||
      newsContainer.style.display == ""
    ) {
      newsContainer.style.display = "block";
    } else {
      newsContainer.style.display = "none";
    }
  });
  thoughtCreate.addEventListener("click", function (event) {
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
      await addDoc(collection(getFirestore(), "post"), {
        content: createInput.value,
        user_id: uid,
        postAt: serverTimestamp(),
      });
      alert("Đăng bài thành công !");
      createContainer.style.display = "none";
      window.location.href = "../html/mainpage.html";
    } catch (error) {
      console.log(error.message);
    }
  });
  randomAvatar.addEventListener("click", function (event) {
    event.preventDefault();
    if (
      profileContainer.style.display == "none" ||
      profileContainer.style.display == ""
    ) {
      profileContainer.style.display = "block";
    } else {
      profileContainer.style.display = "none";
    }
  });
  profileClose.addEventListener("click", function (event) {
    event.preventDefault();
    profileContainer.style.display = "none";
  });
});
