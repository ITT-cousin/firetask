// ===========================
// 🔹 元素抓取
// ===========================
const fireImage = document.getElementById("fireImage");
const wood1 = document.getElementById("wood_1");
const smoke = document.getElementById("smoke");
const fireDialog = document.getElementById("fireDialog");
const shadow = document.querySelector(".shadow");
const bottomMessage = document.getElementById("bottomMessage");
const goRiverBtn = document.getElementById("goRiverBtn");
const returnCampBtn = document.getElementById("returnCampBtn");
const goTentBtn = document.getElementById("goTentBtn");
const tentContainer = document.getElementById("tentContainer");

// ===========================
// 🔹 柴火狀態
// ===========================
const states = {
  wood: "img/wood.png",
  fireFrames: ["img/fire1.png","img/fire2.png","img/fire3.png","img/fire4.png"],
  burnt: "img/burnt.png"
};
let state = "wood";
let clickCount = 0;
let fireIndex = 0;
let fireInterval = null;

// ===========================
// 🔹 背景
// ===========================
const campBackgrounds = ["img/day1.png","img/day2.png","img/day3.png","img/day4.png"];
const riverBackgrounds = ["img/river_day.png","img/river_evening.png","img/river_night.png"];
let currentScene = "camp"; 
let currentCampIndex = 0; 
let currentRiverIndex = 0; 

// ===========================
// 🔹 打字機效果
// ===========================
function typeWriter(element, text, speed=50) {
  element.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if(i >= text.length) clearInterval(interval);
  }, speed);
  element.style.opacity = 1;
  setTimeout(() => element.style.opacity = 0, text.length * speed + 1500);
}

// ===========================
// 🔹 柴火點擊事件
// ===========================
fireImage.addEventListener("click", () => {
  clickCount++;

  if(clickCount === 1) typeWriter(fireDialog,'嗨！');
  else if(clickCount === 5) typeWriter(fireDialog,'觀者無聲，心自明');
  else if(clickCount === 10) typeWriter(fireDialog,'我感覺不太對勁…');

  if(state === "wood") {
    state = "fire";
    fireImage.src = states.fireFrames[0];
    wood1.style.display = "block";
    fireIndex = 0;

    fireInterval = setInterval(() => {
      fireIndex = (fireIndex + 1) % states.fireFrames.length;
      fireImage.src = states.fireFrames[fireIndex];
      updateBackground(); 
    }, 2500);

    bottomMessage.textContent = '你點燃了柴火，使你充滿了決心🔥';
    smoke.classList.add("smoke-active");

  } else if(state === "fire") {
    if(clickCount === 14) bottomMessage.textContent = '火焰即將達到巔峰！🌟';
    else if(clickCount >= 15) {
      clearInterval(fireInterval);
      fireInterval = null;
      fireImage.src = states.burnt;
      wood1.style.display = "none";
      bottomMessage.textContent = '火焰熄滅，周圍安靜了下來';
      smoke.classList.remove("smoke-active");
      state = "burnt";
    } else {
      bottomMessage.textContent = '柴火溫暖的燃燒著...';
    }
  } else if(state === "burnt") {
    fireImage.src = states.wood;
    bottomMessage.textContent = '柴火重新堆好';
    state = "wood";
    clickCount = 0;
  }

  updateBackground();
});

// ===========================
// 🔹 自動背景切換
// ===========================
setInterval(() => {
  if(currentScene === "camp" || currentScene === "tent") currentCampIndex = (currentCampIndex + 1) % campBackgrounds.length;
  else if(currentScene === "river") currentRiverIndex = (currentRiverIndex + 1) % riverBackgrounds.length;
  updateBackground();
}, 5000);

// ===========================
// 🔹 背景更新函式
// ===========================
function updateBackground() {
  if(currentScene === "camp") {
    const isNight = (currentCampIndex === 2 || currentCampIndex === 3);
    const fireSrc = fireImage.getAttribute("src");

    if(isNight) {
      if(fireSrc.includes("fire")) document.body.style.backgroundImage = `url(${campBackgrounds[2]})`;
      else document.body.style.backgroundImage = `url(${campBackgrounds[3]})`;
      fireImage.classList.toggle("night-dark", !fireSrc.includes("fire"));
    } else {
      document.body.style.backgroundImage = `url(${campBackgrounds[currentCampIndex]})`;
      fireImage.classList.remove("night-dark");
    }

    shadow.style.display = isNight ? "none" : "block";
    fireImage.style.display = "block";
    wood1.style.display = (state === "fire") ? "block" : "none";
    smoke.style.display = (state === "fire") ? "block" : "none";

    goRiverBtn.style.display = "block";
    goTentBtn.style.display = "block";
    returnCampBtn.style.display = "none";
    bottomMessage.style.display = "block";

  } else if(currentScene === "river") {
    document.body.style.backgroundImage = `url(${riverBackgrounds[currentRiverIndex]})`;
    fireImage.style.display = "none";
    wood1.style.display = "none";
    smoke.style.display = "none";
    shadow.style.display = "none";

    goRiverBtn.style.display = "none";
    goTentBtn.style.display = "none";
    returnCampBtn.style.display = "block";

    if(currentRiverIndex === 0) bottomMessage.textContent = "屋呼有小河，欸幹有魚欸";
    else if(currentRiverIndex === 1) bottomMessage.textContent = "奇怪，遠處的山是不是怪怪的";
    else bottomMessage.textContent = "你沒看錯，這作者也太懶了";

  } else if(currentScene === "tent") {
    tentContainer.style.display = "block";
  }
}

// ===========================
// 🔹 場景切換
// ===========================
function goToRiver() {
  currentScene = "river";
  currentRiverIndex = currentCampIndex >= 2 ? 2 : currentCampIndex; // 保持與營地同步
  updateBackground();
}

function returnToCamp() {
  currentScene = "camp";
  updateBackground();
}

function goToTent() {
  currentScene = "tent";

  tentContainer.style.display = "block";
  tentContainer.style.opacity = "0";
  setTimeout(() => tentContainer.style.opacity = "1", 50);

  // 🔹 淡出營地元素
  fireImage.style.transition = "opacity 0.8s ease";
  wood1.style.transition = "opacity 0.8s ease";
  smoke.style.transition = "opacity 0.8s ease";
  shadow.style.transition = "opacity 0.8s ease";

  fireImage.style.opacity = "0";
  wood1.style.opacity = "0";
  smoke.style.opacity = "0";
  shadow.style.opacity = "0";

  setTimeout(() => {
    fireImage.style.display = "none";
    wood1.style.display = "none";
    smoke.style.display = "none";
    shadow.style.display = "none";
    goRiverBtn.style.display = "none";
    goTentBtn.style.display = "none";
    returnCampBtn.style.display = "block";
  }, 800);
}

// ===========================
// 🔹 帳篷返回營地
// ===========================
returnCampBtn.addEventListener("click", () => {
  if(currentScene === "tent") {
    tentContainer.style.opacity = "0";
    setTimeout(() => {
      tentContainer.style.display = "none";
      currentScene = "camp";

      // 🔹 顯示營地元素
      fireImage.style.display = "block";
      wood1.style.display = (state === "fire") ? "block" : "none";
      smoke.style.display = (state === "fire") ? "block" : "none";
      shadow.style.display = (currentCampIndex === 2 || currentCampIndex === 3) ? "none" : "block";

      goRiverBtn.style.display = "block";
      goTentBtn.style.display = "block";
      returnCampBtn.style.display = "none";

      // 🔹 淡入動畫
      fireImage.style.opacity = "0";
      wood1.style.opacity = "0";
      smoke.style.opacity = "0";
      shadow.style.opacity = "0";

      setTimeout(() => {
        fireImage.style.transition = "opacity 0.8s ease";
        wood1.style.transition = "opacity 0.8s ease";
        smoke.style.transition = "opacity 0.8s ease";
        shadow.style.transition = "opacity 0.8s ease";

        fireImage.style.opacity = "1";
        wood1.style.opacity = "1";
        smoke.style.opacity = "1";
        shadow.style.opacity = "1";

      }, 10);

      updateBackground();
    }, 300);
  } else {
    returnToCamp();
  }
});

// ===========================
// 🔹 事件綁定
// ===========================
goRiverBtn.addEventListener("click", goToRiver);
goTentBtn.addEventListener("click", goToTent);

// ===========================
// 🔹 初始化背景
// ===========================
updateBackground();
