class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="/css/styles.css" />
    <link rel="stylesheet" href="/css/navbar.css" />
    <nav>
      <ul>
        <button class="home-button" id="home-button">
          <div class="bar">
            <img src="/assets/icon.png" alt="eddy" width="60" height="60" />
            <a1>Edu</a1>
            <b1>Net</b1>
          </div>
        </button>
        
        <div class="menu" id="header-links"></div>

        <button class="logout-button" id="logout-button">
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
    <li><a href="/pages/admin/classes.html">Classes</a></li>
    <li><a href="/pages/admin/students.html">Students</a></li>
    <li><a href="/pages/admin/tutors.html">Tutors</a></li>`;
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
}
