
const topics = [
  "Pengertian Integral",
  "Integral Tak Tentu",
  "Rumus Dasar Integral",
  "Sifat-Sifat Integral",
  "Integral Substitusi",
  "Integral Parsial",
  "Integral Tentu",
  "Luas Daerah dan Aplikasi Integral"
];

// ISI MATERI PEMBELAJARAN
const topicMaterials = [
  {
    content: `Suatu fungsi f (x) disebut sebagai turunan dari suatu fungsi F (x). Jadi F (x) disebut anti turunan dari f (x) pada suatu interval I  jika untuk setiap nilai x di dalam I  berlaku F' (x) = f (x). Secara sederhana, integral digunakan untuk menghitung luas daerah, volume benda, jarak, dan berbagai permasalahan matematika lainnya. Integral memiliki dua jenis utama, yaitu integral tak tentu dan integral tentu.`
  },
  { content: "" },
  { content: "" },
  { content: "" },
  { content: "" },
  { content: "" },
  { content: "" },
  { content: "" }
];

let selectedRole = "siswa";
let currentRole = "siswa";
let currentPage = "Beranda";

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

// PILIH JENIS AKUN
document.querySelectorAll(".role-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedRole = btn.dataset.role;

    document.querySelectorAll(".role-btn").forEach(item => {
      item.classList.toggle("active", item === btn);
    });

    loginError.textContent = "";
  });
});

// PROSES LOGIN
loginForm.addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const valid =
    (selectedRole === "siswa" && username === "siswa" && password === "12345") ||
    (selectedRole === "guru" && username === "guru" && password === "12345");

  if (!valid) {
    loginError.textContent = "Username, password, atau jenis akun tidak sesuai.";
    return;
  }

  currentRole = selectedRole;
  sessionStorage.setItem("integralearnRole", currentRole);

  showApp();
});

// MENAMPILKAN HALAMAN UTAMA
function showApp() {
  loginPage.classList.add("hidden");
  appPage.classList.remove("hidden");

  const isTeacher = currentRole === "guru";

  document.getElementById("profileName").textContent = isTeacher ? "Guru" : "Siswa";
  document.getElementById("avatar").textContent = isTeacher ? "G" : "S";

  document.getElementById("studentStats").classList.toggle("hidden", isTeacher);
  document.getElementById("teacherStats").classList.toggle("hidden", !isTeacher);

  document.getElementById("lowerTitle").textContent =
    isTeacher ? "Kelola pembelajaran" : "Lanjutkan pembelajaran";

  document.getElementById("lowerSubtitle").textContent =
    isTeacher ? "Akses cepat untuk mengelola kelas" : "Materi yang bisa kamu pelajari hari ini";

  document.getElementById("progressTitle").textContent =
    isTeacher ? "Ringkasan kelas" : "Progres belajar";

  document.getElementById("progressCaption").textContent =
    isTeacher ? "Data ringkasan contoh kelas" : "Belum ada materi yang ditandai selesai";

  buildNav();
  renderTopicPreview();
  updateProgress();
  showPage("Beranda");
}

// MENU SISWA DAN GURU
const studentNav = [
  ["Beranda","▦"],
  ["Materi Integral","▤"],
  ["Kuis & Latihan","✓"],
  ["Tugas","▣"],
  ["Nilai","▥"],
  ["Absensi","◷"],
  ["Diskusi Kelas","☏"],
  ["Pengaturan","⚙"]
];

const teacherNav = [
  ["Beranda","▦"],
  ["Materi Integral","▤"],
  ["Kuis & Latihan","✓"],
  ["Kelola Tugas","▣"],
  ["Nilai Siswa","▥"],
  ["Absensi Siswa","◷"],
  ["Diskusi Kelas","☏"],
  ["Pengaturan","⚙"]
];

// MEMBUAT MENU SAMPING
function buildNav() {
  const nav = document.getElementById("sideNav");

  nav.innerHTML = "";

  (currentRole === "guru" ? teacherNav : studentNav).forEach(([name, icon]) => {
    const button = document.createElement("button");

    button.className = "nav-link";
    button.innerHTML = `<span class="nav-icon">${icon}</span>${name}`;

    button.addEventListener("click", () => showPage(name));

    nav.appendChild(button);
  });
}

// MENAMPILKAN PREVIEW MATERI DI BERANDA
function renderTopicPreview() {
  const holder = document.getElementById("topicPreview");

  holder.innerHTML = "";

  topics.slice(0, 3).forEach((topic, index) => {
    const row = document.createElement("div");

    row.className = "topic-row";

    row.innerHTML = `
      <div>
        <strong>Topik ${index + 1}</strong><br>
        <small>${topic}</small>
      </div>
      <button type="button">Buka materi</button>
    `;

    row.querySelector("button").addEventListener("click", () => {
      showPage("Materi Integral");
      renderTopicDetail(index);
    });

    holder.appendChild(row);
  });
}

// MENGATUR PERPINDAHAN HALAMAN
function showPage(page) {
  currentPage = page;

  document.getElementById("crumbTitle").textContent = page;

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle(
      "active",
      link.textContent.trim().slice(1) === page ||
      link.textContent.trim() === page
    );
  });

  const dashboard = document.getElementById("dashboardView");
  const pageView = document.getElementById("pageView");

  if (page === "Beranda") {
    dashboard.classList.remove("hidden");
    pageView.classList.add("hidden");
    return;
  }

  dashboard.classList.add("hidden");
  pageView.classList.remove("hidden");

  pageView.innerHTML = pageContent(page);

  // TOMBOL BUKA MATERI
  pageView.querySelectorAll("[data-topic]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.topic);
      renderTopicDetail(index);
    });
  });

  // TOMBOL FITUR LAINNYA
  pageView.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      handleAction(btn.dataset.action);
    });
  });
}

// MENAMPILKAN ISI MATERI SESUAI TOPIK
function renderTopicDetail(index) {
  const title = topics[index];
  const material = topicMaterials[index];

  if (!title) return;

  const pageView = document.getElementById("pageView");

  const content = material && material.content
    ? material.content
    : "Materi untuk topik ini sedang disiapkan.";

  pageView.innerHTML = `
    <button id="backToTopics" type="button">
      ← Kembali ke daftar materi
    </button>

    <h2>${title}</h2>

    <div class="page-item">
      <h3>${title}</h3>
      <p style="white-space: pre-line; line-height: 1.8;">
        ${content}
      </p>
    </div>
  `;

  // TOMBOL KEMBALI
  document.getElementById("backToTopics").addEventListener("click", () => {
    showPage("Materi Integral");
  });
}

// ISI HALAMAN WEBSITE
function pageContent(page) {

  if (page === "Materi Integral") {
    return `
      <h2>Materi Integral</h2>

      <p>Pelajari materi integral melalui delapan topik berikut.</p>

      <div class="page-list">
        ${topics.map((t, i) => `
          <div class="page-item">
            <div>
              <h4>Topik ${i + 1} · ${t}</h4>
              <p>Materi pembelajaran matematika</p>
            </div>

            <button data-topic="${i}">
              Buka materi
            </button>
          </div>
        `).join("")}
      </div>
    `;
  }

  const map = {
    "Kuis & Latihan": [
      "Kuis dan Latihan",
      "Kerjakan latihan untuk mengukur pemahamanmu.",
      "Mulai kuis"
    ],

    "Tugas": [
      "Daftar Tugas",
      "Lihat tugas yang diberikan oleh guru.",
      "Lihat tugas"
    ],

    "Kelola Tugas": [
      "Kelola Tugas",
      "Buat dan pantau tugas untuk siswa.",
      "Tambah tugas"
    ],

    "Nilai": [
      "Nilai Saya",
      "Ringkasan hasil kuis dan tugas yang telah dikerjakan.",
      "Lihat nilai"
    ],

    "Nilai Siswa": [
      "Nilai Siswa",
      "Pantau hasil belajar dan perkembangan siswa.",
      "Lihat rekap nilai"
    ],

    "Absensi": [
      "Absensi Kehadiran",
      "Catat kehadiranmu pada pertemuan pembelajaran.",
      "Absen sekarang"
    ],

    "Absensi Siswa": [
      "Absensi Siswa",
      "Pantau kehadiran siswa di kelas.",
      "Lihat rekap absensi"
    ],

    "Diskusi Kelas": [
      "Diskusi Kelas",
      "Ruang diskusi antara guru dan siswa.",
      "Tulis diskusi"
    ],

    "Pengaturan": [
      "Pengaturan Akun",
      "Pengaturan akun IntegraLearn.",
      "Simpan pengaturan"
    ]
  };

  const item = map[page] || [page, "Halaman pembelajaran.", "Buka"];

  return `
    <h2>${item[0]}</h2>
    <p>${item[1]}</p>

    <div class="page-list">
      <div class="page-item">
        <div>
          <h4>${currentRole === "guru" ? "Area pengelolaan guru" : "Area belajar siswa"}</h4>
          <p>Bagian ini dapat dikembangkan sesuai kebutuhan kelas.</p>
        </div>

        <button data-action="${page}">
          ${item[2]}
        </button>
      </div>
    </div>
  `;
}

// MENGATUR TOMBOL FITUR
function handleAction(action) {

  if (action === "Absensi") {
    const count =
      Number(localStorage.getItem("integralearnAttendance") || 0) + 1;

    localStorage.setItem("integralearnAttendance", count);

    document.getElementById("attendanceCount").textContent = `${count} kali`;

    alert("Absensi contoh berhasil dicatat pada browser ini.");

  } else if (action === "Kuis & Latihan") {
    const score = Math.floor(Math.random() * 21) + 80;

    localStorage.setItem("integralearnScore", score);

    document.getElementById("lastScore").textContent = score;
    document.getElementById("scoreCaption").textContent =
      "Nilai percobaan terakhir";

    alert(`Simulasi kuis selesai. Nilai contoh: ${score}`);

  } else {
    alert("Tombol ini masih berupa contoh tampilan. Fitur dapat dihubungkan ke database dan formulir berikutnya.");
  }

  updateProgress();
}

// MEMPERBARUI PROGRES BELAJAR
function updateProgress() {
  const attendance =
    Number(localStorage.getItem("integralearnAttendance") || 0);

  const score = localStorage.getItem("integralearnScore");

  document.getElementById("attendanceCount").textContent =
    `${attendance} kali`;

  if (score) {
    document.getElementById("lastScore").textContent = score;
    document.getElementById("scoreCaption").textContent =
      "Nilai percobaan terakhir";
  }

  const percent = score ? 25 : 0;

  document.getElementById("progressPercent").textContent =
    `${percent}%`;

  document.getElementById("progressCaption").textContent =
    score ? "Kuis telah dicoba" : "Belum ada materi yang ditandai selesai";
}

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("integralearnRole");

  appPage.classList.add("hidden");
  loginPage.classList.remove("hidden");

  loginForm.reset();
  loginError.textContent = "";
});

// TOMBOL NAVIGASI TAMBAHAN
document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.go);
  });
});
