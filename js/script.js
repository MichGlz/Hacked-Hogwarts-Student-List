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
  if (valueF === "all") {
    filteredList = arrayOfStudentObject;
  } else {
    // console.log(filterBy);
    if (filterBy === "house") {
      valueF = capitalizeString(valueF);
    }
    // console.log(valueF);
    filteredList = arrayOfStudentObject.filter((student) => student[filterBy] === valueF);
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
  console.log(studentObj);
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
