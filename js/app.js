async function loadStories() {
  const res = await fetch("stories.json");
  const data = await res.json();

  // ---------- Home Page ----------
  if (document.getElementById("storyList")) {
    const container = document.getElementById("storyList");
    data.categories.forEach(cat => {
      cat.stories.forEach(story => {
        container.innerHTML += `
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <img src="${story.image}" class="card-img-top">
              <div class="card-body">
                <h5>${story.title.en}</h5>
                <a href="story.html?id=${story.id}" class="btn btn-primary btn-sm">Read</a>
              </div>
            </div>
          </div>
        `;
      });
    });
  }

  // ---------- Saved Page ----------
  if (document.getElementById("savedList")) {
    const saved = JSON.parse(localStorage.getItem("savedStories") || "[]");
    const container = document.getElementById("savedList");

    if (saved.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No saved stories yet.</p>`;
    } else {
      saved.forEach(story => {
        container.innerHTML += `
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <img src="${story.image}" class="card-img-top">
              <div class="card-body">
                <h5>${story.title}</h5>
                <a href="story.html?id=${story.id}" class="btn btn-primary btn-sm">Read</a>
              </div>
            </div>
          </div>
        `;
      });
    }
  }

  // ---------- Story Page ----------
  if (document.getElementById("storyContent")) {
    const params = new URLSearchParams(window.location.search);
    const storyId = params.get("id");
    let storyData;

    data.categories.forEach(cat => {
      cat.stories.forEach(story => {
        if (story.id === storyId) storyData = story;
      });
    });

    if (!storyData) return;

    const storyContent = document.getElementById("storyContent");
    const progressBar = document.getElementById("progressBar");
    const langSwitcher = document.getElementById("langSwitcher");
    const saveBtn = document.getElementById("saveBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    let currentLang = "en";
    let currentPart = 0;

    function renderPart() {
      const parts = storyData.parts[currentLang];
      storyContent.innerHTML = `
        <h4 class="fw-bold mb-3">${storyData.title[currentLang]}</h4>
        <img src="${storyData.image}" class="img-fluid rounded mb-3">
        <p>${parts[currentPart]}</p>
      `;
      const progress = ((currentPart + 1) / parts.length) * 100;
      progressBar.style.width = progress + "%";

      prevBtn.disabled = currentPart === 0;
      nextBtn.innerText = currentPart === parts.length - 1 ? "Finish 🎉" : "Next ➡";
    }

    // Language switch
    langSwitcher.addEventListener("change", () => {
      currentLang = langSwitcher.value;
      currentPart = 0;
      renderPart();
    });

    // Navigation
    nextBtn.addEventListener("click", () => {
      const parts = storyData.parts[currentLang];
      if (currentPart < parts.length - 1) {
        currentPart++;
        renderPart();
      } else {
        // Show Congratulations Popup
        const modal = new bootstrap.Modal(document.getElementById("congratsModal"));
        modal.show();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentPart > 0) {
        currentPart--;
        renderPart();
      }
    });

    // Save story
    saveBtn.addEventListener("click", () => {
      let saved = JSON.parse(localStorage.getItem("savedStories") || "[]");
      if (!saved.find(s => s.id === storyData.id)) {
        saved.push({ id: storyData.id, title: storyData.title.en, image: storyData.image });
        localStorage.setItem("savedStories", JSON.stringify(saved));
        saveBtn.innerText = "✅ Saved";
      }
    });

    renderPart();
  }
}
loadStories();


