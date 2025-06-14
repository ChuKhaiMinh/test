const newsContent1 = document.querySelector("#news_content1");
const newsContent2 = document.querySelector("#news_content2");
const newsContent3 = document.querySelector("#news_content3");
const newsContent4 = document.querySelector("#news_content4");
const getData = async () => {
  const response = await fetch("news.json");
  const data = await response.json();
  if (data) {
    newsContent1.textContent = data[0].content;
    newsContent2.textContent = data[1].content;
    newsContent3.textContent = data[2].content;
    newsContent4.textContent = data[3].content;
  }
};
getData();
