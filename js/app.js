async function loadStories() {
  const res = await fetch("stories.json");
  const data = await res.json();

  // Home Page (index.html)
  if (document.getElementById("storyList")) {
    const container = document.getElementById("storyList");

    data.categories.forEach(cat => {
      cat.stories.forEach(story => {
        container.innerHTML += `
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <div class="skeleton" data-img="${story.image}" data-alt="${story.title}"></div>
              <div class="card-body">
                <h5 class="card-title">${story.title}</h5>
                <p class="card-text">${story.summary}</p>
                <a href="story.html?id=${story.id}" class="btn btn-primary btn-sm">Read More</a>
              </div>
            </div>
          </div>
        `;
      });
    });

    // Load images after skeleton
    document.querySelectorAll('.skeleton').forEach(skel => {
      const img = new Image();
      img.src = skel.dataset.img;
      img.alt = skel.dataset.alt;
      img.onload = () => {
        skel.replaceWith(img);
        img.classList.add("card-img-top");
      };
    });
  }

  // Story Page (story.html)
  if (document.getElementById("storyContent")) {
    const params = new URLSearchParams(window.location.search);
    const storyId = params.get("id");
    let storyData;

    data.categories.forEach(cat => {
      cat.stories.forEach(story => {
        if (story.id === storyId) storyData = story;
      });
    });

    if (storyData) {
      document.getElementById("storyContent").innerHTML = `
        <h3 class="fw-bold">${storyData.title}</h3>
        <div class="skeleton" data-img="${storyData.image}" data-alt="${storyData.title}"></div>
        <p class="mt-3">${storyData.content}</p>
        <div class="alert alert-success rounded-3"><strong>Lesson:</strong> ${storyData.lesson}</div>
      `;

      // Replace story image skeleton
      const skel = document.querySelector('#storyContent .skeleton');
      const img = new Image();
      img.src = skel.dataset.img;
      img.alt = skel.dataset.alt;
      img.classList.add("img-fluid","rounded","mb-3");
      img.onload = () => skel.replaceWith(img);
    }
  }
}
loadStories();
