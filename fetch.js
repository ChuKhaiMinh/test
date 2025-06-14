//chatgpt
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "./config.js";
const db = getFirestore();

// DOM elements
const randomAvatar = document.querySelector("#random_avatar");
const randomName = document.querySelector("#random_name");
const mindNote = document.querySelector("#mind_note");
const profileAvatar = document.querySelector("#profile_avatar");
const profileName = document.querySelector("#profile_name");
const profilePostcount = document.querySelector("#profile_postcount");
const profileLikecount = document.querySelector("#profile_likecount");
const profileCommentcount = document.querySelector("#profile_commentcount");
const aboutUser = document.querySelector("#about_user");
const post1 = document.querySelector("#post_1");
const post2 = document.querySelector("#post_2");
const post3 = document.querySelector("#post_3");
// 2 mảng/obj để lưu data tạm
let allPostDocs = []; // Array chứa array [doc.id, doc.data()]
// Ví dụ: [ ["abc123", {content: "...", user_id: "uid1", …}], ["xyz456", {…}], … ]

//top 3 comment
async function top3Comment() {
  try {
    const countMap = {};
    const postSnap = await getDocs(collection(getFirestore(), "post"));
    postSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const uid = data.user_id;
      if (!countMap[uid]) {
        countMap[uid] = 1;
      } else {
        countMap[uid] += 1;
      }
    });
    const arr = Object.entries(countMap); //chuyển sang dạng object
    //[[uid,postcount],[...],[...]]
    arr.sort((a, b) => b[1] - a[1]).slice(0, 3); //giảm dần và chỉ lấy 3 cái đầu
    if (!arr[0]) {
      post1.textContent = "—";
      post2.textContent = "—";
      post3.textContent = "—";
      return;
    } else {
      const [uid1] = arr[0]; // arr[0] = ["uidA", sốBài]
      const userSnap1 = await getDoc(doc(db, "users", uid1));
      if (userSnap1.exists()) {
        post1.textContent = userSnap1.data().disname || "[Chưa đặt tên]";
      } else {
        post1.textContent = "[User không tồn tại]";
      }
    }

    // Top 2
    if (!arr[1]) {
      post2.textContent = "—";
      post3.textContent = "—";
      return;
    } else {
      const [uid2] = arr[1];
      const userSnap2 = await getDoc(doc(db, "users", uid2));
      if (userSnap2.exists()) {
        post2.textContent = userSnap2.data().disname || "[Chưa đặt tên]";
      } else {
        post2.textContent = "[User không tồn tại]";
      }
    }

    // Top 3
    if (!arr[2]) {
      post3.textContent = "—";
      return;
    } else {
      const [uid3] = arr[2];
      const userSnap3 = await getDoc(doc(db, "users", uid3));
      if (userSnap3.exists()) {
        post3.textContent = userSnap3.data().disname || "[Chưa đặt tên]";
      } else {
        post3.textContent = "[User không tồn tại]";
      }
    }
  } catch (error) {
    console.warn(error.message);
  }
}

/**
 * 1. Hàm load tất cả post từ Firestore vào allPostDocs
 */
async function loadAllPosts() {
  try {
    const querySnap = await getDocs(collection(db, "post"));
    allPostDocs = []; // reset trước khi fill
    querySnap.forEach((docSnap) => {
      allPostDocs.push([docSnap.id, docSnap.data()]);
    });
  } catch (err) {
    console.error("Lỗi khi load collection post:", err);
  }
}

/**
 * 2. Hàm pick ngẫu nhiên một post từ allPostDocs
 *    → lấy ra postId và postData, rồi fetch thêm user info từ collection "users"
 *    → update UI, và ghi ?user=<uid> lên URL mà không reload page.
 */
async function pickRandomPostAndShow() {
  if (allPostDocs.length === 0) {
    console.warn("Chưa có post nào để random.");
    return;
  }

  // Chọn index ngẫu nhiên
  const randIndex = Math.floor(Math.random() * allPostDocs.length);
  const [postId, postData] = allPostDocs[randIndex];
  // 2.1. Từ postData.user_id, fetch collection "users"
  const userId = postData.user_id; // hoặc postData.uid tuỳ bạn đặt field
  if (!userId) {
    console.warn(`Document post ${postId} không có field user_id.`);
    return;
  }
  try {
    // Lấy document users/userId
    const userDocSnap = await getDoc(doc(db, "users", userId));
    if (!userDocSnap.exists()) {
      console.warn(`User ${userId} không tồn tại trong collection "users".`);
      return;
    }

    const userData = userDocSnap.data();
    const disname = userData.disname || "Tên";
    const avatarUrl = userData.avatarUrl || "../src/img/avatar.png";

    // 2.2. Update UI
    randomAvatar.src = avatarUrl;
    randomName.textContent = disname;
    mindNote.textContent = postData.content || "[Không có nội dung]";

    // 2.3. Ghi query param lên URL: ?user=<userId>  (không reload page)
    // Nếu URL hiện tại đã có param user, ta replace thôi; còn nếu chưa có, ta append.
    const newURL = new URL(window.location.href);
    newURL.searchParams.set("user", userId);
    window.history.replaceState(null, "", newURL.toString());

    //tự viết
    //profile
    const queryUser = query(
      collection(getFirestore(), "post"),
      where("user_id", "==", postData.user_id)
    );
    const querySnap = await getDocs(queryUser);
    let count = 0;
    querySnap.forEach((docSnap) => {
      count++;
    });
    profileAvatar.src = avatarUrl;
    profileName.textContent = disname;
    aboutUser.textContent = userData.about_user || "Không có tiểu sử";
    profilePostcount.textContent = "Số bài đăng : " + count;
    top3Comment();
    //
  } catch (err) {
    console.error("Lỗi khi fetch user info:", err);
  }
}
window.addEventListener("DOMContentLoaded", async () => {
  await loadAllPosts(); // <— Bắt buộc chờ cho Firestore trả về
  pickRandomPostAndShow(); // <— Sau khi data đã nạp, mới random
});

document
  .querySelector("#next_button")
  .addEventListener("click", pickRandomPostAndShow);
