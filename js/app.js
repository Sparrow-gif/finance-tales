// Load stories.json
async function loadStories() {
  const res = await fetch("stories.json");
  const data = await res.json();

  // If index.html page
  if (document.getElementById("storyList")) {
    const container = document.getElementById("storyList");
    data.categories.forEach(cat => {
      cat.stories.forEach(story => {
        container.innerHTML += `
          <div class="col-md-4">
            <div class="card h-100 shadow-sm">
              <img src="${story.image}" class="card-img-top" alt="${story.title}">
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
  }

  // If story.html page
  if (document.getElementById("storyContent")) {
    const params = new URLSearchParams(window.location.search);
    const storyId = params.get("id");
    let storyData;
    data.categories.forEach(cat => {
      cat.stories.forEach(story => {
        if (story.id === storyId) {
          storyData = story;
        }
      });
    });

    if (storyData) {
      document.getElementById("storyContent").innerHTML = `
        <h3>${storyData.title}</h3>
        <img src="${storyData.image}" class="img-fluid rounded mb-3">
        <p>${storyData.content}</p>
        <div class="alert alert-success"><strong>Lesson:</strong> ${storyData.lesson}</div>
      `;
    }
  }
}
loadStories();
