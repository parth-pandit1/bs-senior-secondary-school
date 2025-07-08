 
  window.addEventListener("load", function () {
    const overlay = document.getElementById("welcome-overlay");

    if (!overlay) return;

    if (sessionStorage.getItem("welcomeShown")) {
      overlay.style.display = "none";
    } else {
      setTimeout(() => {
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
      }, 1000); // Hide after 2 seconds
      sessionStorage.setItem("welcomeShown", "yes");
    }
  });
 

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".read-more").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const moreText = this.parentElement.querySelector(".more-text");
        if (!moreText) return;

        if (moreText.style.display === "none" || moreText.style.display === "") {
          moreText.style.display = "inline";
          this.textContent = "Read Less";
        } else {
          moreText.style.display = "none";
          this.textContent = "Read More";
        }
      });
    });
  });
  function shiftAndFlip(card) {
  card.classList.toggle("flipped");
  card.classList.toggle("active");
}

  
  const form = document.getElementById("admissionForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent page reload

    const scriptURL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE'; // 👈 Replace this
    const formData = new FormData(form);

    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => {
        alert("🎉 Your form has been submitted!");
        form.reset(); // Optional: clear form
      })
      .catch(error => {
        alert("❌ There was an error. Please try again.");
        console.error("Error!", error.message);
      });
  });
 
  function flipCard(card) {
    card.classList.toggle('flipped');
  }
 


 