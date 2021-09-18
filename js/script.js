"use strict";

window.addEventListener("DOMContentLoaded", start);

//object prototype
const Student = {
  _id: undefined,
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  imgUrl: undefined,
  gender: undefined,
  house: undefined,
  bloodType: undefined,
  prefect: false,
  quidditchPlayer: false,
  inquisitor: false,
  expelled: false,
};

//the houses colors
const houseColors = {
  gryffindor: { color1: "#660d10", color2: "#e19f27" },
  hufflepuff: { color1: "#201e19", color2: "#f99e30" },
  ravenclaw: { color1: "#193755", color2: "#8e5223" },
  slytherin: { color1: "#31733a", color2: "#cccccb" },
};

//settings
const settings = {
  filterBy1: "house",
  valueToFilter1: "all",
  filterBy2: "bloodType",
  valueToFilter2: "all",
  filterBy3: "responsibility",
  valueToFilter3: "all",
  sortBy: "name",
  sortDir: "asc",
  SearchBarStr: "",
  isExpelledList: false,
  isModalInfo: false,
  isHackedTheSystem: false,
};

let arrayOfStudentObject = [];
let listsOfFamilies;

function start() {
  const headerHeight = document.querySelector("header").offsetHeight;
  document.documentElement.style.setProperty("--headerheight", `${headerHeight}px`);
  document.querySelector("#listTitle").style.top = `${headerHeight - 7}px)`;
  document.querySelector("main").style.marginTop = `calc(${headerHeight}px + 2rem)`;
  document.querySelectorAll(".filtersWrapper select").forEach((select) => {
    select.addEventListener("change", setFilter);
  });
  document.querySelector("#resetFilters").addEventListener("click", resetFilters);
  document.querySelector("#search-names").addEventListener("input", setSearchBar);
  document.querySelector("#sort-by").addEventListener("change", setSort);
  document.querySelector("#direction").addEventListener("click", setDirection);
  document.querySelector("#theOtherList").addEventListener("click", displayTheOtherList);
  fetchLists();
}

function fetchLists() {
  let urlStudents = "https://petlatkea.dk/2021/hogwarts/students.json";
  let urlFamilyArrays = "https://petlatkea.dk/2021/hogwarts/families.json";

  //last names by type of blood
  fetch(urlFamilyArrays)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      listsOfFamilies = data;
      //list of student obj
      fetch(urlStudents)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          convertJSONData(data);
        });
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
    student.middleName = getMiddleName(fullNameClean);
    student.nickName = getNickName(fullNameClean);
    student.house = getHouse(houseClean);
    student.bloodType = bloodStatus(student.lastName);
    student.imgUrl = getImgUrl(student.lastName, student.firstName);

    //--- push the object in the array of students
    arrayOfStudentObject.push(student);
  });

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
    let secondWordWithUpperCase = capitalizeString(word2);
    // let secondWordWithUpperCase = word2.replace(word2[0], word2[0].toUpperCase());
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
    lastName = "";
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
      middleName = "";
    }
  } else {
    middleName = "";
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
    nickName = "";
  }
  // console.log(nickName);
  return nickName;
}

//--------------------------------
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

//--------------------------------
function getHouse(houseClean) {
  const house = capitalizeString(houseClean);
  return house;
}

//---------------------------------
function getImgUrl(lastName, firstName) {
  let firstPart;
  let secondPart;
  let imgUrl;
  const prevStudent = arrayOfStudentObject.find((student) => student.lastName === lastName);
  //if has last name start
  if (lastName) {
    //check if last name has " - "
    if (lastName.includes("-")) {
      firstPart = lastName.split("-")[1];
    } else {
      firstPart = lastName;
    }

    //check if last name is duplicate
    if (prevStudent) {
      prevStudent.imgUrl = changeImgUrl(prevStudent.imgUrl, prevStudent.firstName);
      secondPart = firstName;
    } else {
      secondPart = firstName[0];
    }
    //get values and lower case
    const urlUpperCase = `${firstPart}_${secondPart}.png`;
    const urlLowCase = urlUpperCase.toLowerCase();
    imgUrl = urlLowCase;
  } else {
    imgUrl = undefined;
  }
  // console.log(e.imgUrl);
  return imgUrl;
}

function changeImgUrl(imgUrl, firstName) {
  firstName = firstName.toLowerCase();
  imgUrl = `${imgUrl.split("_")[0]}_${firstName}.png`;
  return imgUrl;
}

//-----------------------------------
function bloodStatus(lastName) {
  let bloodType;
  if (lastName) {
    bloodType = "muggle";
    if (listsOfFamilies.pure.includes(lastName)) {
      bloodType = "pure";
    }
    if (listsOfFamilies.half.includes(lastName)) {
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
  //declare condition for flag
  let condition;

  //grab parent
  const studentUL = document.getElementById("student-list");

  //cleaning list
  studentUL.querySelectorAll("li").forEach((li) => li.remove());

  //displaying li
  list.forEach((student) => {
    //flag expelled students list
    if (settings.isExpelledList) {
      condition = student.expelled;
    } else {
      condition = !student.expelled;
    }

    //create li
    let xLi = document.createElement("LI");
    //reconstruct full name string
    const fullName = fullNameConstructor(student);

    //add info in the li element
    xLi.dataset.id = student._id;

    const template = document.querySelector("#studentLI").content;

    //clone it
    const copy = template.cloneNode(true);

    copy.querySelector(".name").textContent = fullName;

    if (student.inquisitor) {
      copy.querySelector(".mini-inquisitor p").innerHTML += " &#9772;";
      // xLi.innerHTML += " &#9772;";
    }

    if (student.quidditchPlayer) {
      copy.querySelector(".mini-quidditch p").innerHTML += "&#8881;&#8859;&#8880;";
      // xLi.innerHTML += " &#9854;";
    }

    if (student.prefect) {
      copy.querySelector(".mini-prefect p").innerHTML += " &#8471;";
      // xLi.innerHTML += " &#128737;";
    }

    //grab parent

    //append
    xLi.appendChild(copy);

    xLi.classList.add(`${student.house.toLowerCase()}`);
    xLi.addEventListener("click", getStudentId);

    if (condition) {
      studentUL.appendChild(xLi);
    }
  });

  displayNumbers();
}

function displayNumbers() {
  if (settings.isExpelledList) {
    const numberOfStudentsGryffindor = arrayOfStudentObject.filter((student) => student.house === "Gryffindor" && student.expelled).length;
    document.querySelector("#no-gryffindor").textContent = numberOfStudentsGryffindor;
    const numberOfStudentsHufflepuff = arrayOfStudentObject.filter((student) => student.house === "Hufflepuff" && student.expelled).length;
    document.querySelector("#no-hufflepuff").textContent = numberOfStudentsHufflepuff;
    const numberOfStudentsRavenclaw = arrayOfStudentObject.filter((student) => student.house === "Ravenclaw" && student.expelled).length;
    document.querySelector("#no-ravenclaw").textContent = numberOfStudentsRavenclaw;
    const numberOfStudentsSlytherin = arrayOfStudentObject.filter((student) => student.house === "Slytherin" && student.expelled).length;
    document.querySelector("#no-slytherin").textContent = numberOfStudentsSlytherin;
  } else {
    const numberOfStudentsGryffindor = arrayOfStudentObject.filter((student) => student.house === "Gryffindor" && !student.expelled).length;
    document.querySelector("#no-gryffindor").textContent = numberOfStudentsGryffindor;
    const numberOfStudentsHufflepuff = arrayOfStudentObject.filter((student) => student.house === "Hufflepuff" && !student.expelled).length;
    document.querySelector("#no-hufflepuff").textContent = numberOfStudentsHufflepuff;
    const numberOfStudentsRavenclaw = arrayOfStudentObject.filter((student) => student.house === "Ravenclaw" && !student.expelled).length;
    document.querySelector("#no-ravenclaw").textContent = numberOfStudentsRavenclaw;
    const numberOfStudentsSlytherin = arrayOfStudentObject.filter((student) => student.house === "Slytherin" && !student.expelled).length;
    document.querySelector("#no-slytherin").textContent = numberOfStudentsSlytherin;
  }

  const numberOfStudentsActive = arrayOfStudentObject.filter((student) => !student.expelled).length;
  document.querySelector("#no-active").textContent = numberOfStudentsActive;
  const numberOfStudentsExpelled = arrayOfStudentObject.filter((student) => student.expelled).length;
  document.querySelector("#no-expelled").textContent = numberOfStudentsExpelled;
  const numberOfStudentsDisplayed = document.querySelectorAll("#student-list li").length;
  document.querySelector("#no-displayed").textContent = numberOfStudentsDisplayed;
}

function getStudentId(e) {
  const studentID = e.target.dataset.id;
  displayModalInfo(studentID);
}

function displayModalInfo(studentID) {
  //
  const studentObj = arrayOfStudentObject.find((student) => student._id === studentID);

  //setting the color of the house
  const house = studentObj.house.toLowerCase();
  document.documentElement.style.setProperty("--houseColor1", `${houseColors[house].color1}`);
  document.documentElement.style.setProperty("--houseColor2", `${houseColors[house].color2}`);

  //grab the template
  const template = document.querySelector("#studentModalTemplate").content;

  //clone it
  const copy = template.cloneNode(true);

  //add animation
  if (!settings.isModalInfo) {
    copy.querySelector(".studentcardwrappersprit").classList.add("apear");
    copy.querySelector(".studentcardwrappersprit").addEventListener("animationend", removeApear);
  }

  ////////////change content/////////////////
  copy.querySelector("#studentmodal").addEventListener("click", removeModal);

  //styling the card
  copy.querySelector(".crest").style.backgroundImage = `url(./assets/${house}_crest_monoChrom.png)`;
  copy.querySelector(".housename h1").innerHTML = `<span class="firstLetter">${studentObj.house[0]}</span>${studentObj.house.substring(1)}</h1>`;

  //changing picture
  if (studentObj.imgUrl) {
    copy.querySelector(".studentpic").style.backgroundImage = `url(./assets/students/${studentObj.imgUrl})`;
  }

  //general info
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

  //inquisitorial filter
  if (studentObj.house === "Slytherin" || studentObj.bloodType === "pure") {
    copy.querySelector(".inquisitorial").style.backgroundImage = `url(./assets/inquisitorial_badge.png)`;
    copy.querySelector(".inquisitorial").style.pointerEvents = "all";
    copy.querySelector(".inquisitorial").addEventListener("click", function () {
      studentObj.inquisitor = !studentObj.inquisitor;
      refreshModal(studentID);
      if (settings.isHackedTheSystem) {
        setTimeout(() => {
          studentObj.inquisitor = false;
          buildList();
          document.querySelector(".inquisitorial").style.transition = `1s`;
          document.querySelector(".inquisitorial").style.filter = `saturate(0) opacity(0)`;
          document.querySelector(".inquisitorial").style.transform = `translate(-25vw,-10vw) rotate(190deg) scale(0.1)`;
        }, 500);
      }
    });
  }

  //display prefect shield
  if (studentObj.prefect) {
    copy.querySelector(".prefect").style.filter = `saturate(1) opacity(1)`;
  }

  //select a prefect
  copy.querySelector(".prefect").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (studentObj.prefect === true) {
      studentObj.prefect = false;
    } else {
      tryToMakeAPrefect(studentObj);
    }

    refreshModal(studentID);
  }

  //diplay quidditch logo
  if (studentObj.quidditchPlayer) {
    copy.querySelector(".quidditch").style.filter = `saturate(1) opacity(1)`;
  }

  //select a quidditch player
  copy.querySelector(".quidditch").addEventListener("click", function () {
    studentObj.quidditchPlayer = !studentObj.quidditchPlayer;
    refreshModal(studentID);
  });

  //display expelled
  if (studentObj.expelled) {
    copy.querySelector(".iconswrapper").style.pointerEvents = "none";
    copy.querySelector(".inquisitorial").style.pointerEvents = "none";
    copy.querySelector(".expelledStamp").classList.add("stamped");
  }
  //expelled
  copy.querySelector(".expelled").addEventListener("click", function () {
    studentObj.expelled = true;
    if (studentID !== "007") {
      studentObj.inquisitor = false;
      studentObj.prefect = false;
      studentObj.quidditchPlayer = false;
    }
    refreshModal(studentID);
    setTimeout(removeModal, 600);
    if (studentID === "007") {
      document.querySelector(".studentpic").style.backgroundImage = `url(./assets/students/gonzalez_m2.png)`;
      setTimeout(() => {
        studentObj.expelled = false;
        displayModalInfo(studentID);
        alert(`${studentObj.firstName} can't be expelled!`); //to do a message!!
      }, 1700);
    }
  });

  //grab parent
  const parent = document.querySelector("main");
  //append
  parent.appendChild(copy);
}

function tryToMakeAPrefect(studentSelected) {
  const studentsInHouse = arrayOfStudentObject.filter((student) => student.house === studentSelected.house);
  const prefectsInHouse = studentsInHouse.filter((student) => student.prefect);
  const numberOfprefects = prefectsInHouse.length;

  if (numberOfprefects < 2) {
    studentSelected.prefect = true;
  } else {
    const studentA = arrayOfStudentObject.find((student) => student._id === prefectsInHouse[0]._id);
    const studentB = arrayOfStudentObject.find((student) => student._id === prefectsInHouse[1]._id);
    displayWarningPrefects(studentSelected, studentA, studentB);
  }
}

function studentSelectedToPrefect(theOtherStudent, studentSelected) {
  theOtherStudent.prefect = false;
  studentSelected.prefect = true;
  refreshModal(studentSelected._id);
  document.querySelector(".alert").remove();
  document.querySelector(".smsboxwrapper").remove();
}

function displayWarningPrefects(studentSelected, studentA, studentB) {
  //grab the template
  const template = document.querySelector("#warningprefects").content;

  //clone it
  const copy = template.cloneNode(true);

  //change content
  copy.querySelector(".alert").addEventListener("click", () => {
    document.querySelector(".alert").remove();
    document.querySelector(".smsboxwrapper").remove();
  });
  copy.querySelector("#studentA img").src = `assets/students/${studentA.imgUrl}`;
  copy.querySelector("#studentA h2").textContent = fullNameConstructor(studentA);
  copy.querySelector("#btn-studentA").addEventListener("click", () => {
    studentSelectedToPrefect(studentA, studentSelected);
  });
  copy.querySelector("#studentB img").src = `assets/students/${studentB.imgUrl}`;
  copy.querySelector("#studentB h2").textContent = fullNameConstructor(studentB);
  copy.querySelector("#btn-studentB").addEventListener("click", () => {
    studentSelectedToPrefect(studentB, studentSelected);
  });

  //grab parent
  const parent = document.querySelector("main");
  //append
  parent.appendChild(copy);
}

function displayTheOtherList() {
  settings.isExpelledList = !settings.isExpelledList;
  const button = document.querySelector("#theOtherList");
  const listH1 = document.querySelector("#listTitle");
  if (settings.isExpelledList) {
    button.innerHTML = "Active Studentes";
    listH1.textContent = "Expelled Studentes";
  } else {
    button.innerHTML = "Expelled Studentes";
    listH1.textContent = "Active Studentes";
  }
  resetFilters();
  buildList();
}

function refreshModal(studentID) {
  buildList();
  document.querySelector(".studentcardwrapper").remove();
  document.querySelector("#studentmodal").remove();
  displayModalInfo(studentID);
}

function removeModal() {
  const card = document.querySelector(".studentcardwrappersprit");
  card.addEventListener("animationend", () => {
    document.querySelector(".studentcardwrapper").remove();
    setTimeout(() => {
      document.querySelector("#studentmodal").remove();
    }, 300);
  });
  card.classList.add("disapear");
  settings.isModalInfo = false;
}

function removeApear(e) {
  e.target.removeEventListener("animationend", removeApear);
  e.target.classList.remove("apear");
  settings.isModalInfo = true;
}

////////////////search bar////////////////////////////////////////////////
function setSearchBar(e) {
  let word = e.target.value.toLowerCase();
  settings.SearchBarStr = word;

  if (word === "strawgoh" && settings.isHackedTheSystem === false) {
    e.target.value = "";
    settings.SearchBarStr = "";
    hackTheSystem();
    return;
  }
  buildList();
}
function SearchBar(newList) {
  // let newList = buildList();
  let searchList = newList.filter((student) => student.firstName.toLowerCase().includes(settings.SearchBarStr) || student.lastName.toLowerCase().includes(settings.SearchBarStr) || student.middleName.toLowerCase().includes(settings.SearchBarStr));
  // displayList(searchList);
  return searchList;
}

////////////////////////filter & sort///////////////////////////////
function setFilter() {
  document.querySelectorAll(".filtersWrapper select").forEach((select, i) => {
    settings[`valueToFilter${i + 1}`] = select.value;
    settings[`filterBy${i + 1}`] = select.dataset.filter;
  });
  buildList();
}

function filterList(allStudentsList) {
  let list1 = allStudentsList;
  let list2;

  //repeat the filtering for each value of the filters
  for (let i = 1; i <= 3; i++) {
    let valueToFilter = settings[`valueToFilter${i}`];
    const filterBy = settings[`filterBy${i}`];
    if (filterBy !== "responsibility") {
      // console.log(filterBy);
      if (filterBy === "house") {
        valueToFilter = capitalizeString(valueToFilter);
      }
      // console.log(valueF);
      list2 = list1.filter((student) => student[filterBy] === valueToFilter);
    } else {
      list2 = list1.filter((student) => student[valueToFilter]);
    }

    if (valueToFilter.toLowerCase() === "all") {
      list2 = list1;
    }

    list1 = list2;
  }

  const filteredList = list1;
  // console.log(filteredList);
  return filteredList;
}

function resetFilters() {
  const filters = document.querySelectorAll(".filtersWrapper select");
  filters.forEach((select) => {
    select.value = "all";
  });
  setFilter();
}

function setSort(e) {
  settings.sortBy = e.target.value;
  buildList();
}

function sortList(currentList) {
  let direction = 1;
  const sortBy = settings.sortBy;
  if (settings.sortDir === "desc") {
    direction = -1;
  }

  const sortedList = currentList.sort(sortByProperty);

  function sortByProperty(animalA, animalB) {
    if (animalA[sortBy] < animalB[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  // return sortedList;
  return sortedList;
}

function setDirection(e) {
  settings.sortDir = e.target.dataset.sortDirection;
  //toggle direction

  if (settings.sortDir === "asc") {
    e.target.dataset.sortDirection = "desc";
    e.target.innerHTML = "&#11015;";
  } else {
    e.target.dataset.sortDirection = "asc";
    e.target.innerHTML = "&#11014;";
  }
  buildList();
}

function buildList() {
  if (settings.isHackedTheSystem) {
    recalculateBloodStatus();
  }
  const currentList = filterList(arrayOfStudentObject);
  const searchedList = SearchBar(currentList);
  const sortedList = sortList(searchedList);
  displayList(sortedList);
  // return sortedList;
}

/////////////////////////////hack the system//////////////////

function hackTheSystem() {
  if (!settings.isHackedTheSystem) {
    document.querySelector(".blackscreen").addEventListener("animationend", () => {
      document.querySelector(".blackscreen").remove();
    });
    document.querySelector(".blackscreen").classList.add("active");
    settings.isHackedTheSystem = true;
    const fullname = 'Miguel German "Mich" Gonzalez';
    const house = "Ravenclaw";

    PushMyOwnStudentObject(fullname, house);
    recalculateBloodStatus();
  }
}

function PushMyOwnStudentObject(fullname, house) {
  const fullNameClean = cleanString(fullname);
  const houseClean = cleanString(house);
  //----take object prototype and copy---
  const student = Object.create(Student);
  //----insert data in the new object--

  student._id = "007";
  student.firstName = getFirstName(fullNameClean);
  student.lastName = getLastName(fullNameClean);
  student.middleName = getMiddleName(fullNameClean);
  student.nickName = getNickName(fullNameClean);
  student.house = getHouse(houseClean);
  student.bloodType = bloodStatus(student.lastName);
  student.imgUrl = getImgUrl(student.lastName, student.firstName);

  //--- push the object in the array of students
  arrayOfStudentObject.push(student);
  buildList();
}

function recalculateBloodStatus() {
  arrayOfStudentObject.forEach((student) => {
    student.bloodType = bloodStatus(student.lastName);
    if (student.bloodType === "pure") {
      const types = ["muggle", "half", "pure", "half", "muggle", "pure"];
      const randomNumber = Math.floor(Math.random() * 6);
      student.bloodType = types[randomNumber];
    } else {
      student.bloodType = "pure";
    }
  });
}
