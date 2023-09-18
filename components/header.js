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
        <div class="bar">
          <img src="/assets/icon.png" alt="eddy" width="80" height="80" />
          <a1>Edu</a1>
          <b1>Net</b1>
        </div>
        
        <div class="menu">
        <li><a href="/pages/userAuth/login.html">Classes</a></li>
        <li><a href="/pages/userAuth/register.html">Students</a></li>
        <li>
          <a href="/pages/userAuth/forgot-password.html">Tutors</a>
        </li>
        </div>

        <button class="logout-button">
          LOGOUT
        </button>
        

      
      </ul>
    </nav>
      `;
  }
}

customElements.define("header-navbar", Header);
