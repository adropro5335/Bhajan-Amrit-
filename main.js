let data = [];

// Load JSON
fetch("data/bhajans.json")
  .then(res => res.json())
  .then(d => {
    data = d;
    if (document.getElementById("bhajan-list")) renderAll();
    else renderSingle();
  })
  .catch(err => console.error("JSON error:", err));

// =====================
// Bhajan Card
// =====================
function createCardHTML(b) {
  return `
    <div class="card">
      <a href="${b.youtube}" target="_blank">
        <img src="${b.image}" alt="${b.title}">
      </a>
      <h3>${b.title}</h3>
      <a class="read-btn" href="bhajan.html?id=${b.id}">
        📖 पूरा भजन पढ़ें
      </a>
    </div>
  `;
}

// =====================
// Article Ad (Safe)
// =====================
function createArticleAd() {
  return `
    <div class="ad-container">
      <ins class="adsbygoogle"
        style="display:block; text-align:center"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-4338182050022914"
        data-ad-slot="3652664266"></ins>
    </div>
  `;
}

// =====================
// Render All Bhajans
// =====================
function renderAll() {
  const list = document.getElementById("bhajan-list");
  if (!list) return;

  let html = "";

  data.forEach((b, index) => {
    html += createCardHTML(b);

    // 👉 Do bhajan ke baad 1 article ad
    if ((index + 1) % 2 === 0) {
      html += createArticleAd();
    }
  });

  list.innerHTML = html;
  runAds();

  setupCategoryFilter();
}

// =====================
// Run Adsense safely
// =====================
function runAds() {
  const ads = document.querySelectorAll(".adsbygoogle");
  ads.forEach(ad => {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  });
}

// =====================
// Category Filter
// =====================
function setupCategoryFilter() {
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.dataset.cat;
      const filtered = data.filter(b => cat === "all" || b.category === cat);

      let html = "";
      filtered.forEach((b, index) => {
        html += createCardHTML(b);
        if ((index + 1) % 2 === 0) html += createArticleAd();
      });

      document.getElementById("bhajan-list").innerHTML =
        filtered.length ? html : "<p>कोई भजन उपलब्ध नहीं है</p>";

      runAds();
    });
  });
}

// =====================
// Single Bhajan Page
// =====================
function renderSingle() {
  const id = new URLSearchParams(window.location.search).get("id");
  const bhajan = data.find(b => b.id === id);
  if (!bhajan) return;

  document.getElementById("page-title").textContent = bhajan.title;
  document.getElementById("bhajan-title").textContent = bhajan.title;
  document.getElementById("bhajan-image").src = bhajan.image;
  document.getElementById("yt-link").href = bhajan.youtube;

  const lyricsEl = document.getElementById("bhajan-lyrics");
  lyricsEl.textContent = Array.isArray(bhajan.lyrics)
    ? bhajan.lyrics.flat().join("\n\n")
    : bhajan.lyrics;
}

// =====================
// Search
// =====================
const searchBox = document.getElementById("search-box");
if (searchBox) {
  searchBox.addEventListener("input", () => {
    const q = searchBox.value.toLowerCase().trim();
    const filtered = data.filter(b => b.title.toLowerCase().includes(q));

    let html = "";
    filtered.forEach((b, index) => {
      html += createCardHTML(b);
      if ((index + 1) % 2 === 0) html += createArticleAd();
    });

    document.getElementById("bhajan-list").innerHTML =
      filtered.length ? html : "<p>कोई भजन नहीं मिला</p>";

    runAds();
  });
}