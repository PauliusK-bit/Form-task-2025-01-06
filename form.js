// PIRMA DALIS:
// Sukurti kontaktų formą.
// 1. Kontaktų formoje turi būti šie laukeliai:
//     1. Tekstinis laukelis vardui (privalomas).
//     2. Tekstinis laukelis pavardei (privalomas).
//     3. Skaičiaus laukelis amžiui (privalomas).
//     4. Laukelis įvesti telefono numerį (neprivalomas).
//     5. Laukelis įvesti el. paštą (privalomas).
//     6. Range tipo laukelis, kuris skirtas įvertinti savo IT žinias nuo 1 iki 10. Galimas vertinimas tik sveikiems skaičiams.
//     7. Radio tipo laukeliai, kuriuose pasirenkamas grupės numeris. Turi būti galimybė pasirinkti grupes nuo TYPE 20gr. iki TYPE 25gr.
//     8. Checkbox tipo laukeliai, kuriuose galima pasirinkti dominančias programavimo kalbas (bent 4 skirtingi checkbox elementai).
//     9. Šalia kiekvieno įvesties (input) elemento, pridėti label elementą, kuris žymi laukelio pavadinimą.

// ANTRA DALIS:
// 1. Sukurti div elementą, kuris turės id „students-list".
// 2. Kiekvieną kartą pridavus formą (submit), turi būti sukurtas naujas div elementas su klase „student-item" ir pridedamas į „students-list" elemento pradžią.
// 3. Duomenys apie studentą turi būti įdėti į „student-item" elementą.

// 4. Sukūrus studentą, turi iššokti <span> elementas, kuris informuoja apie studento sukūrimą: „Sukurtas studentas (Vardas Pavardė)". Šis span elementas dingsta po 5 sekundžių.
// 5. Šalia range tipo laukelio, sukurti span (arba output) elementą ir jame atvaizduoti range laukelio reikšmę jam keičiantis.

// TREČIA DALIS:
// 1. Vietoje el. pašto ir tel. numerio rodyti tik žvaigždutes „****".
// 2. Kiekviename „student-item" elemente sukurti mygtuką „Rodyti asmens duomenis".
// 3. Paspaudus šį mygtuką:
//     3.1. Parodyti to studento el. paštą ir tel. numerį.
//     3.2. Pakeist mygtuko tekstą į „Slėpti asmens duomenis".
// 4. Jeigu asmens duomenys yra rodomi, tai paspaudus mygtuką:
//     4.1. Paslėpti asmens el. paštą ir tel. numerį.
//     4.2. Mygtuko tekstą pakeisti į „Rodyti asmens duomenis".

// KETVIRTA DALIS (studento ištrynimas):
// 1. Prie kiekvieno sukurti studento elemento pridėti mygtuką „Ištrinti studentą".
// 2. Paspaudus šį mygtuką, studento elementas yra ištrinamas.
// 3. Ištrynus studentą, turi iššokti <span> elementas, kuris informuoja apie studento ištrynimą: „Studentas (Vardas Pavardė) sėkmingai ištrintas.". Šis span elementas dingsta po 5 sekundžių.

function init() {
  const studentForm = document.querySelector("#student-form");
  const studentsList = document.querySelector("#students-list");
  const localStorageKey = "students";

  restoreInputValues();

  restoreStudents();

  itKnowledgeChange();

  studentForm.addEventListener("input", function () {
    saveInputValues();
  });

  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;

    const name = document.querySelector("#name").value;
    const surname = studentForm.querySelector("#surname").value;
    const age = form.querySelector("#age").value;

    const phone = form.phone.value;
    const email = form.email.value;
    const itKnowledge = form["it-knowledge"].value;

    const group = form.group.value;
    const interests = form.querySelectorAll('input[name="interest"]:checked');

    const studentItem = document.createElement("div");
    studentItem.classList.add("student-item");

    const nameElement = document.createElement("h2");
    nameElement.textContent = `${name} ${surname}`;

    const ageElement = document.createElement("p");
    ageElement.textContent = `Age: ${age}`;

    const phoneElement = document.createElement("p");
    phoneElement.textContent = `Phone: ****`;

    const emailElement = document.createElement("p");
    emailElement.textContent = `Email: ****`;

    const itKnowledgeElement = document.createElement("p");
    itKnowledgeElement.textContent = `IT Knowledge: ${itKnowledge}`;

    const groupElement = document.createElement("p");
    groupElement.textContent = `Group: ${group} gr.`;

    const interestsWrapper = document.createElement("div");
    interestsWrapper.classList.add("interests-wrapper");

    const interestsTitle = document.createElement("h3");
    interestsTitle.textContent = "Interests:";

    const interestsList = document.createElement("ul");

    for (let i = 0; i < interests.length; i++) {
      const interestItem = document.createElement("li");
      interestItem.textContent = interests[i].value;
      interestsList.append(interestItem);
    }

    interestsWrapper.append(interestsTitle, interestsList);

    const privateInfoButton = document.createElement("button");
    privateInfoButton.textContent = "Show private info";

    let showPrivateInfo = false;

    privateInfoButton.addEventListener("click", function () {
      showPrivateInfo = !showPrivateInfo;

      if (showPrivateInfo) {
        privateInfoButton.textContent = "Hide private info";
        phoneElement.textContent = `Phone: ${phone}`;
        emailElement.textContent = `Email: ${email}`;
      } else {
        privateInfoButton.textContent = "Show private info";
        phoneElement.textContent = `Phone: ****`;
        emailElement.textContent = `Email: ****`;
      }
    });

    const removeStudentButton = document.createElement("button");
    removeStudentButton.textContent = "Remove Student";

    removeStudentButton.addEventListener("click", function () {
      studentItem.remove();
      removeStudentFromLocalStorage({ name, surname });
      alertMessage(`Student (${name} ${surname}) was removed!`);
    });

    studentItem.append(
      nameElement,
      ageElement,
      phoneElement,
      emailElement,
      itKnowledgeElement,
      groupElement,
      interestsWrapper,
      privateInfoButton,
      removeStudentButton
    );

    studentsList.prepend(studentItem);

    saveStudentToLocalStorage({
      name,
      surname,
      age,
      phone,
      email,
      itKnowledge,
      group,
      interests: Array.from(interests).map((interest) => interest.value),
    });

    form.reset();
    clearInputValues();

    const createStudentText = `Student (${name} ${surname}) was created!`;
    alertMessage(createStudentText);
  });

  function saveInputValues() {
    const inputs = studentForm.querySelectorAll("input, select");
    const inputValues = {};

    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        inputValues[input.name] = input.checked;
      } else {
        inputValues[input.name] = input.value;
      }
    });

    localStorage.setItem("formInputValues", JSON.stringify(inputValues));
  }

  function restoreInputValues() {
    const savedValues = JSON.parse(localStorage.getItem("formInputValues"));

    if (!savedValues) return;

    const inputs = studentForm.querySelectorAll("input, select");

    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        input.checked = savedValues[input.name] || false;
      } else {
        input.value = savedValues[input.name] || "";
      }
    });
  }

  function clearInputValues() {
    localStorage.removeItem("formInputValues");
  }

  function saveStudentToLocalStorage(student) {
    const students = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    students.push(student);
    localStorage.setItem(localStorageKey, JSON.stringify(students));
  }

  function restoreStudents() {
    const students = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    students.forEach((student) => {
      const studentItem = document.createElement("div");
      studentItem.classList.add("student-item");

      const nameElement = document.createElement("h2");
      nameElement.textContent = `${student.name} ${student.surname}`;

      const ageElement = document.createElement("p");
      ageElement.textContent = `Age: ${student.age}`;

      const phoneElement = document.createElement("p");
      phoneElement.textContent = `Phone: ****`;

      const emailElement = document.createElement("p");
      emailElement.textContent = `Email: ****`;

      const itKnowledgeElement = document.createElement("p");
      itKnowledgeElement.textContent = `IT Knowledge: ${student.itKnowledge}`;

      const groupElement = document.createElement("p");
      groupElement.textContent = `Group: ${student.group} gr.`;

      const interestsWrapper = document.createElement("div");
      interestsWrapper.classList.add("interests-wrapper");

      const interestsTitle = document.createElement("h3");
      interestsTitle.textContent = "Interests:";

      const interestsList = document.createElement("ul");

      student.interests.forEach((interest) => {
        const interestItem = document.createElement("li");
        interestItem.textContent = interest;
        interestsList.append(interestItem);
      });

      interestsWrapper.append(interestsTitle, interestsList);

      const privateInfoButton = document.createElement("button");
      privateInfoButton.textContent = "Show private info";

      let showPrivateInfo = false;

      privateInfoButton.addEventListener("click", function () {
        showPrivateInfo = !showPrivateInfo;

        if (showPrivateInfo) {
          privateInfoButton.textContent = "Hide private info";
          phoneElement.textContent = `Phone: ${student.phone}`;
          emailElement.textContent = `Email: ${student.email}`;
        } else {
          privateInfoButton.textContent = "Show private info";
          phoneElement.textContent = `Phone: ****`;
          emailElement.textContent = `Email: ****`;
        }
      });

      const removeStudentButton = document.createElement("button");
      removeStudentButton.textContent = "Remove Student";

      removeStudentButton.addEventListener("click", function () {
        studentItem.remove();
        removeStudentFromLocalStorage(student);
        alertMessage(
          `Student (${student.name} ${student.surname}) was removed!`
        );
      });

      studentItem.append(
        nameElement,
        ageElement,
        phoneElement,
        emailElement,
        itKnowledgeElement,
        groupElement,
        interestsWrapper,
        privateInfoButton,
        removeStudentButton
      );

      studentsList.prepend(studentItem);
    });
  }

  function removeStudentFromLocalStorage(studentToRemove) {
    let students = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    students = students.filter(
      (student) =>
        student.name !== studentToRemove.name ||
        student.surname !== studentToRemove.surname
    );
    localStorage.setItem(localStorageKey, JSON.stringify(students));
  }
}

init();

function itKnowledgeChange() {
  const itKnowledgeInput = document.querySelector("#it-knowledge");
  const itKnowledgeOutput = document.querySelector("#it-knowledge-output");

  itKnowledgeInput.addEventListener("input", function () {
    itKnowledgeOutput.textContent = itKnowledgeInput.value;
  });
}

function alertMessage(text) {
  const alertMessage = document.querySelector("#alert");
  alertMessage.textContent = text;

  setTimeout(function () {
    alertMessage.textContent = "";
  }, 5000);
}
