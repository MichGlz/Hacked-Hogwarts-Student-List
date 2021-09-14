"use strict";

window.addEventListener("DOMContentLoaded", start);

const Student = {
  _id: undefined,
  firstName: undefined,
  lastName: undefined,
  middleName: undefined,
  nickName: undefined,
  imgUrl: undefined,
  gender: undefined,
  house: undefined,
  bloodType: undefined,
  prefect: false,
  quidditchPlayer: false,
  inquisitor: false,
  expelled: false,
};

const houseColors = {
  gryffindor: { color1: "#660d10", color2: "#e19f27" },
  hufflepuff: { color1: "#201e19", color2: "#f99e30" },
  ravenclaw: { color1: "#193755", color2: "#8e5223" },
  slytherin: { color1: "#31733a", color2: "#cccccb" },
};

let arrayOfStudentObject = [];
let arrayOfExpelledStudents = [];
let arrayLastNames = [];
let familiesList;

function start() {
  init();
  document.querySelectorAll(".filtersWrapper select").forEach((select) => {
    select.addEventListener("change", filterList);
  });
  document.querySelector("#search-names").addEventListener("input", searchBar);
}

function filterList(e) {
  let filteredList;
  let valueF = e.target.value;
  const filterBy = e.target.dataset.filter;
  if (filterBy !== "responsibility") {
    // console.log(filterBy);
    if (filterBy === "house") {
      valueF = capitalizeString(valueF);
    }
    // console.log(valueF);
    filteredList = arrayOfStudentObject.filter((student) => student[filterBy] === valueF);
  } else {
    filteredList = arrayOfStudentObject.filter((student) => student[valueF]);
  }

  if (valueF === "all") {
    filteredList = arrayOfStudentObject;
  }
  // console.log(filteredList);
  displayList(filteredList);
}

function init() {
  let urlStudents = "https://petlatkea.dk/2021/hogwarts/students.json";
  let urlFamilyArrays = "https://petlatkea.dk/2021/hogwarts/families.json";

  //last names by type of blood
  fetch(urlFamilyArrays)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      familiesList = data;
    });

  //list of student obj
  fetch(urlStudents)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      convertJSONData(data);
    });
}

function convertJSONData(studentsData) {
  studentsData.forEach((element, n) => {
    //------clean full name----------

    const fullNameClean = cleanString(element.fullname);
    const houseClean = cleanString(element.house);
    //----take object prototype and copy---
    const student = Object.create(Student);
    //----insert data in the new object--

    student._id = createID(n);
    student.firstName = getFirstName(fullNameClean);
    student.lastName = getLastName(fullNameClean);
    arrayLastNames.push(student.lastName);
    student.middleName = getMiddleName(fullNameClean);
    student.nickName = getNickName(fullNameClean);
    student.house = getHouse(houseClean);
    student.bloodType = bloodStatus(student.lastName);
    ///blood status

    // student.imgUrl = getImgUrl(fullNameClean);

    //--- push the object in the array of students
    arrayOfStudentObject.push(student);
  });

  //-----------get the url of images
  getImgUrl();
  //-----------
  console.table(arrayOfStudentObject);
  displayList(arrayOfStudentObject);
}

function cleanString(element) {
  const str = element;
  const elementTrimed = str.trim();
  const elementLowerCase = elementTrimed.toLowerCase();
  const elementClean = elementLowerCase;
  // console.log(elementClean);
  return elementClean;
}

function capitalizeString(word) {
  let wordWithUpperCase;
  let word2;
  wordWithUpperCase = word.replace(word[0], word[0].toUpperCase());
  if (wordWithUpperCase.includes("-")) {
    word2 = word.split("-")[1];
    let secondWordWithUpperCase = word2.replace(word2[0], word2[0].toUpperCase());
    wordWithUpperCase = `${wordWithUpperCase.split("-")[0]}-${secondWordWithUpperCase}`;
  }
  // console.log(wordWithUpperCase);
  return wordWithUpperCase;
}

function getFirstName(fullName) {
  let firstNameLowerCase;
  if (fullName.split(" ").length > 1) {
    firstNameLowerCase = fullName.substring(0, fullName.indexOf(" "));
  } else {
    firstNameLowerCase = fullName;
  }
  const firstName = capitalizeString(firstNameLowerCase);
  // console.log(firstName);
  return firstName;
}

function getLastName(fullName) {
  let lastNameLowerCase;
  let lastName;
  if (fullName.split(" ").length > 1) {
    lastNameLowerCase = fullName.substring(fullName.lastIndexOf(" ") + 1);
    lastName = capitalizeString(lastNameLowerCase);
  } else {
    lastName = undefined;
  }
  // console.log(lastName);
  return lastName;
}

//-----------------------------------
function getMiddleName(fullName) {
  let middleNameLowerCase;
  let middleName;
  if (fullName.split(" ").length > 2) {
    middleNameLowerCase = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "));
    middleName = capitalizeString(middleNameLowerCase);
    if (middleName.includes(`"`)) {
      middleName = undefined;
    }
  } else {
    middleName = undefined;
  }
  // console.log(middleName);
  return middleName;
}

//----------------------------------
function getNickName(fullName) {
  let nickNameLowerCase;
  let nickName;
  if (fullName.includes(`"`)) {
    nickNameLowerCase = fullName.substring(fullName.indexOf('"') + 1, fullName.lastIndexOf('"'));
    nickName = capitalizeString(nickNameLowerCase);
  } else {
    nickName = undefined;
  }
  // console.log(nickName);
  return nickName;
}

//--------------------------------
function getHouse(houseClean) {
  const house = capitalizeString(houseClean);
  return house;
}

//---------------------------------

function getImgUrl() {
  arrayOfStudentObject.forEach((e) => {
    let firstPart;
    let secondPart;

    //------if has last name start
    if (e.lastName) {
      //--------- check if last name has " - "----
      if (e.lastName.includes("-")) {
        firstPart = e.lastName.split("-")[1];
      } else {
        firstPart = e.lastName;
      }
      //-----------check if last name is duplicate-------------
      if (arrayLastNames.indexOf(e.lastName) === arrayLastNames.lastIndexOf(e.lastName)) {
        secondPart = e.firstName[0];
      } else {
        secondPart = e.firstName;
      }
      //------------get values and lower case
      const urlUpperCase = `${firstPart}_${secondPart}.png`;
      const urlLowCase = urlUpperCase.toLowerCase();
      e.imgUrl = urlLowCase;
    } else {
      e.imgUrl = undefined;
    }
    // console.log(e.imgUrl);
  });
}

function bloodStatus(lastName) {
  let bloodType;
  if (lastName) {
    bloodType = "muggle";
    if (familiesList.pure.includes(lastName)) {
      bloodType = "pure";
    }
    if (familiesList.half.includes(lastName)) {
      bloodType = "half";
    }
  } else {
    bloodType = undefined;
  }

  return bloodType;
}

function createID(n) {
  if (n < 9) {
    return `9100${n + 1}`;
  } else {
    return `910${n + 1}`;
  }
}

////////////////////////////////display/////////////////////////////

function displayList(list) {
  const studentUL = document.getElementById("student-list");
  //cleaning list
  studentUL.querySelectorAll("li").forEach((li) => li.remove());
  //displaying li
  list.forEach((student) => {
    let xLi = document.createElement("LI");
    const fullName = fullNameConstructor(student);
    xLi.dataset.id = student._id;
    xLi.textContent = fullName;
    xLi.classList.add(`${student.house.toLowerCase()}`);
    xLi.addEventListener("click", displayModalInfo);
    studentUL.appendChild(xLi);
  });
}

function fullNameConstructor(student) {
  let studentFullName;
  if (student.lastName) {
    studentFullName = `${student.firstName} ${student.lastName}`;
  } else {
    studentFullName = student.firstName;
  }

  if (student.middleName) {
    studentFullName = `${student.firstName} ${student.middleName} ${student.lastName}`;
  }
  if (student.nickName) {
    studentFullName = `${student.firstName} "${student.nickName}" ${student.lastName}`;
  }
  return studentFullName;
}

function displayModalInfo(e) {
  const studentID = e.target.dataset.id;
  const studentObj = arrayOfStudentObject.find((student) => student._id === studentID);
  const house = studentObj.house.toLowerCase();
  //setting the color of the house
  document.documentElement.style.setProperty("--houseColor1", `${houseColors[house].color1}`);
  document.documentElement.style.setProperty("--houseColor2", `${houseColors[house].color2}`);

  //grab the template
  const template = document.querySelector("#studentModalTemplate").content;

  //clone it
  const copy = template.cloneNode(true);

  //change content
  copy.querySelector("#studentmodal").addEventListener("click", removeModal);
  copy.querySelector(".crest").style.backgroundImage = `url(../assets/${house}_crest_monoChrom.png)`;
  copy.querySelector(".housename h1").innerHTML = `<span class="firstLetter">${studentObj.house[0]}</span>${studentObj.house.substring(1)}</h1>`;
  if (studentObj.imgUrl) {
    copy.querySelector(".studentpic").style.backgroundImage = `url(../assets/students/${studentObj.imgUrl})`;
  }
  copy.querySelector(".firstname").textContent = studentObj.firstName;
  copy.querySelector(".lastname").textContent = studentObj.lastName;
  copy.querySelector(".middlename").textContent = studentObj.middleName;
  copy.querySelector(".nickname").textContent = studentObj.nickName;
  //display blood type
  if (studentObj.bloodType) {
    copy.querySelector(`#${studentObj.bloodType}`).checked = true;
  }

  //display inquisitor badge
  if (studentObj.inquisitor) {
    copy.querySelector(".inquisitorial").style.filter = `saturate(1) opacity(1)`;
  }
  //inquisitorial electables
  if (studentObj.house === "Slytherin" || studentObj.bloodType === "pure") {
    copy.querySelector(".inquisitorial").style.backgroundImage = `url(../assets/inquisitorial_badge.png)`;
    copy.querySelector(".inquisitorial").style.pointerEvents = "all";
    copy.querySelector(".inquisitorial").addEventListener("click", function () {
      studentObj.inquisitor = !studentObj.inquisitor;
      removeModal();
      displayModalInfo(e);
    });
  }

  //display prefect shild
  if (studentObj.prefect) {
    copy.querySelector(".prefect").style.filter = `saturate(1) opacity(1)`;
  }

  //diplay quidditch logo
  if (studentObj.quidditchPlayer) {
    copy.querySelector(".quidditch").style.filter = `saturate(1) opacity(1)`;
  }
  //select a quidditch player
  copy.querySelector(".quidditch").addEventListener("click", function () {
    studentObj.quidditchPlayer = !studentObj.quidditchPlayer;
    removeModal();
    displayModalInfo(e);
  });

  //grab parent
  const parent = document.querySelector("main");
  //append
  parent.appendChild(copy);

  console.log(studentObj);
}

function removeModal() {
  document.querySelector(".studentcardwrapper").remove();
  document.querySelector("#studentmodal").remove();
}

function searchBar(e) {
  console.log(e.target.value);
  const regex = e.target.value;
  let searchList = arrayOfStudentObject.filter((student) => student.firstName.match(regex));
  console.log(searchList);
}
///////////////////////////posible search bar/////////////////////
// const paragraph = 'The quick brown fox jumped over the lazy dog. It barked.';
// const regex = "ed";
// const found = [];
// const words=paragraph.split(" ");
// words.forEach(word=>{
// if(word.match(regex)){
//   found.push(word);
// }
// });
// console.log(found);

// console.log(found);
// expected output: Array ["T", "I"]
///////////////////////////////////////////////////////////////////////
