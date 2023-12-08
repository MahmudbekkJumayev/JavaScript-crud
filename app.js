"use strict";
//   Elements
const tbody = document.querySelector("tbody");
//   FORMS
const updateForm = document.querySelector(".update-form");
const createForm = document.querySelector(".create-user-form");
//   BUTTONS
const updateBtn = document.querySelector(".update-btn");
const updateCancelBtn = document.querySelector(".update-cancel-btn");
const createBtn = document.querySelector(".create-btn");
//   INPUTS
const firstNameInput = document.querySelector(".update-firstName-input");
const lastNameInput = document.querySelector(".update-lastName-input");
let users = null;
let userId = null;
// GET USERS
const getUsers = async () => {
  tbody.innerHTML = "";
  let data = null;
  try {
    const response = await fetch(
      "https://qarz-daftar.onrender.com/api/v1/users"
    );
    data = await response.json();
    if (
      response.status.toString()[0] === "4" ||
      response.status.toString()[0] === "5"
    ) {
      const data = await response.json();
      throw data.message;
    }

    data?.data?.content?.forEach((user, i) => {
      const trEl = `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${user.firstName + " " + user.lastName}</td>
                    <td>${user.username}</td>
                    <td class="actions"><button class="edit-btn btn" data-id="${
                      user.id
                    }">Edit</button>
                    <button class="delete-btn btn" data-id="${
                      user.id
                    }">Delete</button></td>
                  </tr>`;
      tbody.insertAdjacentHTML("beforeend", trEl);
    });
    users = data.data.content;
  } catch (error) {
    console.log(error);
  }
};

// UPDATE USER
const updateUser = () => {
  updateBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const user = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
    };
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(user),
    };
    try {
      const response = await fetch(
        `https://qarz-daftar.onrender.com/api/v1/users/${userId}`,
        options
      );
      if (
        response.status.toString()[0] === "4" ||
        response.status.toString()[0] === "5"
      ) {
        const data = await response.json();
        throw data.message;
      }
      getUsers();
    } catch (error) {
      console.log(error);
    }

    firstNameInput.value = "";
    lastNameInput.value = "";
    updateForm.classList.add("display-none");
  });
  updateCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    firstNameInput.value = "";
    lastNameInput.value = "";
    updateForm.classList.add("display-none");
  });
};

// DELETE USER
const deleteUser = async (userId) => {
  try {
    const response = await fetch(
      `https://qarz-daftar.onrender.com/api/v1/users/${userId}`,
      { method: "DELETE" }
    );
    if (
      response.status.toString()[0] === "4" ||
      response.status.toString()[0] === "5"
    ) {
      const data = await response.json();
      throw data.message;
    }
    getUsers();
  } catch (error) {
    console.log(error);
  }
};
// CREATE USER
const createUser = () => {
  createForm.addEventListener("click", async (e) => {
    e.preventDefault();
    const classlistBtn = e.target.classList;
    if (!classlistBtn.contains("button")) return;
    if (classlistBtn.contains("create-user-btn")) {
      const infos = [];
      const inputLength = createForm.children.length - 1;
      for (let i = 0; i < inputLength; i++) {
        infos.push(createForm.children[i].value);
      }
      const [
        firstName,
        lastName,
        passportNumber,
        phoneNumber,
        storeName,
        password,
        username,
      ] = infos;
      const user = {
        firstName,
        lastName,
        passportNumber,
        phoneNumber,
        storeName,
        password,
        username,
        userRole: "STORE_OWNER",
        userRoleUz: "DOKON",
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(user),
      };
      try {
        const response = await fetch(
          "https://qarz-daftar.onrender.com/api/v1/users",
          options
        );
        if (
          response.status.toString()[0] === "4" ||
          response.status.toString()[0] === "5"
        ) {
          const data = await response.json();
          throw data.message;
        }
        getUsers();
        for (let i = 0; i < inputLength; i++) {
          createForm.children[i].value = "";
        }
        createForm.classList.add("display-none");
        createBtn.classList.remove("display-none");
      } catch (error) {
        console.log(error);
      }
    } else {
      createForm.classList.add("display-none");
      createBtn.classList.remove("display-none");
    }
  });
};
// click events
tbody.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn")) return;
  const id = +e.target.dataset.id;
  userId = id;
  if (e.target.classList.contains("edit-btn")) {
    updateForm.classList.remove("display-none");
    users.forEach((user) => {
      if (+user.id === id) {
        firstNameInput.value = user.firstName;
        lastNameInput.value = user.lastName;
      }
    });
    updateUser();
  } else if (e.target.classList.contains("delete-btn")) {
    deleteUser(userId);
  }
});

createBtn.addEventListener("click", () => {
  createForm.classList.remove("display-none");
  createBtn.classList.add("display-none");
  createUser();
});
(() => {
  getUsers();
})();
