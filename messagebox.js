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
} from "./config.js";
const avatarUser = document.querySelector("#avatar");
const disnameUser = document.querySelector("#disname");
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    return window.location.replace("../html/signin.html");
  }
  const uid = user.uid;
  try {
    const fieldAll = (await getDoc(doc(getFirestore(), "users", uid))).data();
    disnameUser.textContent = fieldAll.disname;
    if (!fieldAll.avatarUrl) {
      avatarUser.src = "../src/img/avatar.png";
    } else {
      avatarUser.src = fieldAll.avatarUrl;
    }
  } catch (error) {
    alert(error.message);
  }
});
