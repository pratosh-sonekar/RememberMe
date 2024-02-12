const strRegex = /^[a-zA-Z\s]*$/; // contains only letters
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const phoneRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/;

// ---------------------------------------
const countryList = document.getElementById("country-list");
const fullscreenDiv = document.getElementById("bg-overlay");
const modal = document.getElementById("modal");
const addBtn = document.getElementById("add-btn");
const closeBtn = document.getElementById("close-btn");
const modalBtns = document.getElementById("modal-btns");
const form = document.getElementById("modal");
const addrBookList = document.querySelector("#addr-book-list tbody");
// --------------------------------------------

let addrName =
  (firstName =
  lastName =
  email =
  phone =
  streetAddr =
  postCode =
  city =
  country =
  labels =
    "");

// --------------------------
// UI CLASS
class UI {
  static showAddressList() {
    const addresses = Addresses.getAddresses();
    addresses.forEach((address) => UI.addToAdrressList(address));
  }

  static addToAdrressList(address) {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("data-id", address.id);
    tableRow.innerHTML = `
    <td>${address.id}</td>
    <td>
      <span class="addressing-name">${address.addrName}</span><br /><span
        class="address"
        >${address.streetAddr} ${address.postCode} ${address.city} ${
      address.country
    }</span
      >
    </td>
    <td><span>${address.labels}</span></td>
    <td>${address.firstName + " " + address.lastName}</td>
    <td>${address.phone}</td>
    `;
    addrBookList.appendChild(tableRow);
  }

  static showModalData(id) {
    const addresses = Addresses.getAddresses();
    addresses.forEach((address) => {
      if (address.id == id) {
        form.addr_ing_name.value = address.addrName;
        form.first_name.value = address.firstName;
        form.last_name.value = address.lastName;
        form.email.value = address.email;
        form.phone.value = address.phone;
        form.street_addr.value = address.streetAddr;
        form.postal_code.value = address.postCode;
        form.city.value = address.city;
        form.country.value = address.country;
        form.labels.value = address.labels;
        document.getElementById("modal-title").innerHTML =
          "Change Address Details";

        document.getElementById("modal-btns").innerHTML = `
            <button type = "submit" id = "update-btn" data-id = "${id}">Update </button>
            <button type = "button" id = "delete-btn" data-id = "${id}">Delete </button>
        `;
      }
    });
  }

  static showModal() {
    modal.style.display = "block";
    fullscreenDiv.style.display = "block";
  }

  static closeModal() {
    modal.style.display = "none";
    fullscreenDiv.style.display = "none";
  }
}

//Address Class
class Addresses {
  constructor(
    id,
    addrName,
    firstName,
    lastName,
    email,
    phone,
    streetAddr,
    postCode,
    city,
    country,
    labels
  ) {
    this.id = id;
    this.addrName = addrName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.streetAddr = streetAddr;
    this.postCode = postCode;
    this.city = city;
    this.country = country;
    this.labels = labels;
  }

  static getAddresses() {
    // from locslStaorage
    let addresses;
    if (localStorage.getItem("addresses") == null) {
      addresses = [];
    } else {
      addresses = JSON.parse(localStorage.getItem("addresses"));
    }
    return addresses;
  }

  static addAddress(address) {
    const addresses = Addresses.getAddresses();
    addresses.push(address);
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }

  static deleteAddress(id) {
    const addresses = Addresses.getAddresses();
    addresses.forEach((address, index) => {
      if (address.id == id) {
        addresses.splice(index, 1);
      }
    });
    localStorage.setItem("addresses", JSON.stringify(addresses));
    form.reset();
    UI.closeModal();
    addrBookList.innerHTML = "";
    UI.showAddressList();
  }

  static updateAddress(item) {
    const addresses = Addresses.getAddresses();
    addresses.forEach((address) => {
      if (address.id == item.id) {
        address.addrName = item.addrName;
        address.firstName = item.firstName;
        address.lastName = item.lastName;
        address.email = item.email;
        address.phone = item.phone;
        address.streetAddr = item.streetAddr;
        address.postCode = item.postCode;
        address.city = item.city;
        address.country = item.country;
        address.labels = item.labels;
      }
    });
    localStorage.setItem("addresses", JSON.stringify(addresses));
    addrBookList.innerHTML = "";
    UI.showAddressList();
  }
}

// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
  loadJson(); //loading the countirs json
  eventListener();
  UI.showAddressList();
});

//loading countries list
function loadJson() {
  fetch("countries.json")
    .then((res) => res.json())
    .then((data) => {
      //   console.table(data);
      let html = "";
      data.forEach((country) => {
        // console.log(country.country);
        html += `<option>${country.country}</option>`;
      });
      countryList.innerHTML = html;
    });
}

function eventListener() {
  //shoe modal

  addBtn.addEventListener("click", () => {
    // console.log("click");
    form.reset();
    document.getElementById("modal-title").innerHTML = "Add Address";
    UI.showModal();
    document.getElementById(
      "modal-btns"
    ).innerHTML = `<button type = "submit" id="save-btn">Save</button>`;
  });

  //closeModal
  closeBtn.addEventListener("click", UI.closeModal);

  //add an addres item
  modalBtns.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.id == "save-btn") {
      let isFormValid = getFormData();
      if (!isFormValid) {
        form.querySelectorAll("input").forEach((input) => {
          setTimeout(() => {
            input.classList.remove("errorMsg");
          }, 1500);
        });
      } else {
        let allItem = Addresses.getAddresses(); //this will create an empty array
        console.log(allItem);
        let lastItemId =
          allItem.length > 0 ? allItem[allItem.length - 1].id : 0;
        lastItemId++;

        const addressItem = new Addresses(
          lastItemId,
          addrName,
          firstName,
          lastName,
          email,
          phone,
          streetAddr,
          postCode,
          city,
          country,
          labels
        );
        Addresses.addAddress(addressItem);
        UI.closeModal();
        UI.addToAdrressList(addressItem);
        form.reset();
      }
    }
  });

  //Table row items
  addrBookList.addEventListener("click", (e) => {
    UI.showModal();
    // console.log(e.target);
    let trElement;
    if (e.target.parentElement.tagName == "TD") {
      trElement = e.target.parentElement.parentElement;
    }
    if (e.target.parentElement.tagName == "TR") {
      trElement = e.target.parentElement;
    }
    let viewID = trElement.dataset.id;
    // console.log(viewID);
    UI.showModalData(viewID);
  });

  //delete an address item
  modalBtns.addEventListener("click", (e) => {
    if (e.target.id == "delete-btn") {
      Addresses.deleteAddress(e.target.dataset.id);
    }
  });

  //update amn address item
  modalBtns.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.id == "update-btn") {
      let id = event.target.dataset.id;
      let isFormValid = getFormData();
      if (!isFormValid) {
        form.querySelectorAll("input").forEach((input) => {
          setTimeout(() => {
            input.classList.remove("errorMsg");
          }, 1500);
        });
      } else {
        const addressItem = new Addresses(
          id,
          addrName,
          firstName,
          lastName,
          email,
          phone,
          streetAddr,
          postCode,
          city,
          country,
          labels
        );
        Addresses.updateAddress(addressItem);
        UI.closeModal();
        form.reset();
      }
    }
  });
}

// Get form data
function getFormData() {
  let inputValidStatus = [];
  // console.log(
  //   form.addr_ing_name.value,
  //   form.first_name.value,
  //   form.last_name.value,
  //   form.email.value,
  //   form.phone.value,
  //   form.street_addr.value,
  //   form.postal_code.value,
  //   form.city.value,
  //   form.country.value
  // );
  if (
    !strRegex.test(form.addr_ing_name.value) ||
    form.addr_ing_name.value.trim().length == 0
  ) {
    errMsg(form.addr_ing_name);
    inputValidStatus[0] = false;
  } else {
    addrName = form.addr_ing_name.value;
    inputValidStatus[0] = true;
  }

  if (
    !strRegex.test(form.first_name.value) ||
    form.first_name.value.trim().length == 0
  ) {
    errMsg(form.first_name);
    inputValidStatus[1] = false;
  } else {
    firstName = form.first_name.value;
    inputValidStatus[1] = true;
  }

  if (
    !strRegex.test(form.last_name.value) ||
    form.last_name.value.trim().length == 0
  ) {
    errMsg(form.last_name);
    inputValidStatus[2] = false;
  } else {
    lastName = form.last_name.value;
    inputValidStatus[2] = true;
  }

  if (!emailRegex.test(form.email.value)) {
    errMsg(form.email);
    inputValidStatus[3] = false;
  } else {
    email = form.email.value;
    inputValidStatus[3] = true;
  }

  if (!phoneRegex.test(form.phone.value)) {
    errMsg(form.phone);
    inputValidStatus[4] = false;
  } else {
    phone = form.phone.value;
    inputValidStatus[4] = true;
  }

  if (!(form.street_addr.value.trim().length > 0)) {
    errMsg(form.street_addr);
    inputValidStatus[5] = false;
  } else {
    streetAddr = form.street_addr.value;
    inputValidStatus[5] = true;
  }

  if (!digitRegex.test(form.postal_code.value)) {
    errMsg(form.postal_code);
    inputValidStatus[6] = false;
  } else {
    postCode = form.postal_code.value;
    inputValidStatus[6] = true;
  }

  if (!strRegex.test(form.city.value) || form.city.value.trim().length == 0) {
    errMsg(form.city);
    inputValidStatus[7] = false;
  } else {
    city = form.city.value;
    inputValidStatus[7] = true;
  }

  // console.table(
  //   addrName,
  //   firstName,
  //   lastName,
  //   email,
  //   phone,
  //   streetAddr,
  //   postCode,
  //   city,
  //   country,
  //   labels
  // );
  country = form.country.value;
  labels = form.labels.value;
  return inputValidStatus.includes(false) ? false : true;
}

function errMsg(inputBox) {
  inputBox.classList.add("errorMsg");
}
