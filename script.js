const bgImg = document.querySelector('body');

const clock = document.querySelector('.clock');
const dateCal = document.querySelector('.date');

const greet = document.querySelector('.greet');
const userName = document.querySelector('.name');

const todoList = document.querySelector('.todoList');
const container = document.querySelector('.inputContainer');
const addBtn = document.querySelector('.addBtn');

const weatehr = document.querySelector('#weather');
const API_KEY = `d1d4386d132b4a0ff9fc60f5943c8172`;
const txt = document.querySelector('.temp');
const img = document.querySelector('.icon');

// 랜덤이미지
const images = [
  '1.jpg',
  '2.PNG',
  '3.jpg'
];

const randomImg = images[parseInt(Math.random() * images.length)];
bgImg.style.backgroundImage = `url(./img/${randomImg})`;

// 시계
function getTime() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const sec = String(date.getSeconds()).padStart(2, '0');
  clock.innerHTML = `${hours} : ${min} : ${sec}`;
}

function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dateNum = date.getDate();
  const day = date.getDay();
  const dayArr = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  let dayKor = dayArr.filter((item, index) => {
    return index === day;
  });
  dateCal.innerHTML = `${year}년 ${month}월 ${dateNum}일 ${dayKor}`;
}
getDate();

getTime();
setInterval(getTime, 1000);


// 인사
let userKey = '유저이름';
let logOutBtn;

userName.addEventListener('keyup', (e) => {
  if (!userName.value == '' && e.keyCode === 13) {
    let user = userName.value;
    e.preventDefault();
    localStorage.setItem(userKey, JSON.stringify(user));
    greet.innerHTML = `
      <p>반갑습니다! ${user}님!</p>
      <span class="material-symbols-outlined">logout</span>
    `;
    logOutBtn = document.querySelector('span');
    logOut();
  }
});

function init() {
  const loadedUser = localStorage.getItem(userKey);
  if (loadedUser !== null) {
    const parsedItem = JSON.parse(loadedUser);
    greet.innerHTML = `
      <p>반갑습니다! ${parsedItem}님!</p>
      <span class="material-symbols-outlined">logout</span>
      `;
    logOutBtn = document.querySelector('span');
    logOut();
  }
}
init();

// 투두리스트
let toDos = [];
let todoKey = '할 일';

container.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = e.target.task.value.trim(); // 입력값의 앞뒤 공백 제거

  if (task.length !== 0) {
    const listItem = createTodoItem(task); // 새로운 할 일 항목 생성
    todoList.appendChild(listItem); // 할 일 목록에 추가
    toDos.push(task);
    saveToDos();
  } else {
    e.target.task.focus();
  }

  e.target.task.value = '';
});

function createTodoItem(task) {
  const listItem = document.createElement('li');
  listItem.classList.add('todoItem');

  const taskText = document.createElement('p');
  taskText.classList.add('taskText');
  taskText.innerHTML = task;

  const checkedBtn = document.createElement('button');
  checkedBtn.classList.add('checkedBtn');
  checkedBtn.innerHTML = '완료';

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.innerHTML = '삭제';

  listItem.appendChild(taskText);
  listItem.appendChild(checkedBtn);
  listItem.appendChild(deleteBtn);

  // 할 일 삭제
  deleteBtn.addEventListener('click', () => {
    todoList.removeChild(listItem);
    const index = toDos.indexOf(task);
    if (index !== -1) {
      toDos.splice(index, 1);
      saveToDos();
    }
  });

  // 할 일 체크
  taskText.addEventListener('click', () => {
    taskText.classList.toggle('checked');
  });
  checkedBtn.addEventListener('click', () => {
    taskText.classList.toggle('checked');
  });
  return listItem;
}

function saveToDos() {
  // 로컬스토리지에 저장
  localStorage.setItem(todoKey, JSON.stringify(toDos));
}

let loadForm = () => {
  // 새로고침할 때 로컬스토리지에서 할 일 불러옴
  const loadedItem = localStorage.getItem(todoKey);
  if (loadedItem !== null) {
    const parsedItem = JSON.parse(loadedItem);
    toDos = parsedItem;
    parsedItem.forEach((item) => {
      const listItem = createTodoItem(item);
      todoList.appendChild(listItem);
    });
  }
};

loadForm();

// 로그아웃
function logOut() {
  logOutBtn.addEventListener('click', () => {
    localStorage.removeItem(userKey);
    localStorage.removeItem(todoKey);
    location.reload();
    greet.innerHTML = `
    <p>안녕하세요!</p><input type="text" class="name" placeholder='이름을 입력해주세요'></input>`;
  });
}

// 날씨API
function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let temp = parseInt(data.main.temp);
      let icon = data.weather[0].icon;
      txt.innerHTML = `${temp}℃`;
      img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    });
}

function handleGetSuccess(pos) {
  let lat = pos.coords.latitude;
  let lon = pos.coords.longitude;
  getWeather(lat, lon);
}

function handleGetError() {
  console.log('error');
}

function weatherInit() {
  navigator.geolocation.getCurrentPosition(handleGetSuccess, handleGetError);
}
weatherInit();