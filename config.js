// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

//database
import {
  getFirestore, //nếu ko sài await thì cho .then(()=>{}) ở phía sau để đợi code chạy
  collection, //đường dẫn collection ->document ->field (là thuộc tính của document đó)
  //code : collection(firestore, "tên")
  addDoc, //id tự động
  //code : await addDoc(collection(firestore,"tên"),{field})
  //await là để đợi này hoạt động xong mới chạy tiếp hoặc sài .then()=> phía sau nó
  serverTimestamp,
  //time lúc gửi
  getDocs, // đọc 1 collection
  //code : await getDocs(doc(firestore,"tên collection"))
  getDoc, // đọc 1 document
  //code : await getDoc(doc(firestore,"collection",id))
  doc, //truy cập vào 1 document để sài đc delete
  //code : doc(firestore,"tên collection","tên document")
  deleteDoc,
  //code : await deleteDoc(doc(firestore, "tên collection", "tên document"))
  setDoc, //ghi đè lên
  //code : await setDoc(doc(firestore, "tên","id"),{...})
  //nếu có ,{merge : true} ở đằng sau field thì nó sẽ chỉ tìm field nào có key và thay đổi value, còn bth false thì nó sẽ ko giữ lại value cũ (nói chung là update nhưng mà = set)
  updateDoc,
  //code : await updateDoc(doc(firestore,"tên","id"),{"key" : "value cần thay đổi"})
  query, //(lọc, sắp xếp, phân trang)
  //code : query(collection,where(...),orderBy(...),startAfter(...),limit(...)
  where, //so sánh để giống getDocs nhưng cùng 1 đối tượng (lọc)
  //code : where(field,giá trị so sánh,value)
  orderBy, //sắp xếp
  //code : orderBy(field,so sánh như thế nào [tăng hay giảm])
  startAfter,
  startAt,
  endBefore,
  endAt, //(giúp phân trang)
  //code : startAfter(document bạn muốn), tương tự 3 cái còn lại
  limit, //giới hạn
  //code : limit(số lượng) giống hàm for giới hạn ở đâu để dừng
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

//realtime
import {
  getDatabase,
  ref, //đường dẫn để vào thao tác, vd: a(1,2,3) thì ref(db,"a")
  set, //là để gắn hoặc thay đổi giá trị vào dữ liệu, vd a(1,2,3) thì set(ref(db,"a"),{x,y,z})
  get, //lấy ra từ ref để đọc, vd get(ref(db,"a")).then((biến : như snapshot để tìm tài khoản trùng lặp)=>{code..})
  child, //để truy cập từ mảng 2 chiều trở lên thông qua ref
  //từ hàm set get child thì lấy gián tiếp thông qua ref, ref là nơi bắt nguồn set,get,child(ref(db,"nguồn"))
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

//auth
import {
  getAuth, // Khởi instance Auth từ Firebase app
  // code: const auth = getAuth(app);
  createUserWithEmailAndPassword, // Tạo user mới (email + password)
  // code: await createUserWithEmailAndPassword(auth, email, pw)
  signInWithEmailAndPassword, // Đăng nhập (email + password)
  // code: await signInWithEmailAndPassword(auth, email, pw)
  signOut, // Đăng xuất user hiện tại
  // code: await signOut(auth)
  onAuthStateChanged, // Lắng nghe thay đổi trạng thái auth
  // code: onAuthStateChanged(auth, user => { … })
  sendPasswordResetEmail, // Gửi email đặt lại mật khẩu
  // code: await sendPasswordResetEmail(auth, email)
  updateProfile, // Cập nhật displayName / photoURL
  // code: await updateProfile(auth.currentUser, { displayName, photoURL })
  updatePassword, // Đổi password cho user hiện tại
  // (user phải mới vừa đăng nhập lại nếu token cũ hết hạn)
  // code: await updatePassword(auth.currentUser, newPassword)
  setPersistence, // Chọn cách lưu session: 'local' | 'session' | 'none'
  // code: await setPersistence(auth, browserSessionPersistence)
  deleteUser, //delete
  //code: await deleteUser(auth.currentUser) sài uid sẽ ok hơn
  EmailAuthProvider, //Dùng credential đó để tái xác thực user để xác thực trước khi thay đổi những thông tin nhạy cảm như xóa tài khoản, đổi password
  //code : const credential= EmailAuthProvider.credential(user.email, enteredPassword);
  reauthenticateWithCredential, //Tạo credential từ email và mật khẩu người dùng nhập lại
  //code : await reauthenticateWithCredential(user, credential); sài credential từ phía trên
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpgHVTT6gulnt0_l_qhln3FK7Qj5jEeHc",
  authDomain: "jsi-final-ad7e0.firebaseapp.com",
  projectId: "jsi-final-ad7e0",
  storageBucket: "jsi-final-ad7e0.firebasestorage.app",
  messagingSenderId: "72625096379",
  appId: "1:72625096379:web:be1da02b130bc38f250b9e",
  measurementId: "G-WK30G8502Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
// const fs = getFirestore(app);

export { db, ref, set, get, child };
export {
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
  query,
  where,
};
export {
  signInWithEmailAndPassword,
  auth,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
};
