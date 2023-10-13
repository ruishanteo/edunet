class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="/css/styles.css" />
    <link rel="stylesheet" href="/css/navbar.css" />
    <nav>
      <ul class="topnav" id="topnav">
        <div class="nav-item">
          <div class="bar">
            <button class="home-button bar" id="home-button">
              <img src="/assets/icon.png" alt="eddy" width="60" height="60" />
              <a1>Edu</a1>
              <b1>Net</b1>
            </button>
            <a href="javascript:void(0);" class="nav-icon" id="nav-icon" onclick="myFunction()">
              <i class="fa fa-bars"></i>
            </a>  
          </div>
        </div>

        <div class="menu nav-item" id="header-links"></div>

        <button class="logout-button nav-item" id="logout-button">
          LOGOUT
        </button>

      </ul>
    </nav>
      `;
  }
}

customElements.define("header-navbar", Header);

const checkUser = setInterval(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    clearInterval(checkUser);
    setupHeader(JSON.parse(storedUser));
  }
}, 1000);

function setupHeader(user) {
  const menu = document.getElementById("header-links");
  if (user.type === "admin") {
    menu.innerHTML = `
    <li><a id="nav-classes" href="/pages/admin/classes.html">Classes</a></li>
    <li><a id="nav-students" href="/pages/admin/students.html">Students</a></li>
    <li><a id="nav-tutors" href="/pages/admin/tutors.html">Tutors</a></li>`;

    const currLocation = window.location.href.toLowerCase();
    const navClasses = document.getElementById("nav-classes");
    const navStudents = document.getElementById("nav-students");
    const navTutors = document.getElementById("nav-tutors");
    if (currLocation.includes("classes")) {
      navClasses.classList.add("menu-selected");
    } else if (currLocation.includes("students")) {
      navStudents.classList.add("menu-selected");
    } else if (currLocation.includes("tutors")) {
      navTutors.classList.add("menu-selected");
    }
  } else {
    menu.innerHTML = "";
  }

  const homeButton = document.getElementById("home-button");
  homeButton.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = getHomePage(user);
  });

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  });

  const hamburgerButton = document.getElementById("nav-icon");
  hamburgerButton.onclick = (event) => {
    event.preventDefault();
    var topnav = document.getElementById("topnav");
    if (topnav.className === "topnav") {
      topnav.classList.add("responsive");
    } else {
      topnav.classList.remove("responsive");
    }
  };
}
