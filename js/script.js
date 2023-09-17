// Function to load content based on the URL hash (routing)
function loadContent() {
  const content = document.getElementById("page");
  const hash = window.location.hash.substring(2); // Remove the '#/'
  const validPages = ["login", "register", "forgot-password"];

  if (validPages.includes(hash)) {
    // Construct the correct path to the HTML file based on the folder structure
    const pagePath = `pages/userAuth/${hash}.html`;

    // Load the corresponding HTML page
    fetch(pagePath)
      .then((response) => response.text())
      .then((html) => {
        content.innerHTML = html;
      });
  } else {
    // Handle invalid routes (e.g., show a 404 page)
    content.innerHTML = "<h2>404 - Page Not Found</h2>";
  }
}

// Add an event listener to call loadContent when the page loads or the hash changes
window.addEventListener("load", loadContent);
window.addEventListener("hashchange", loadContent);

// Call loadContent initially to load the default content
loadContent();
