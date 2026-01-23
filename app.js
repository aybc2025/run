let runs = [];

// טעינת הנתונים מ־runs.json
fetch("runs.json")
  .then(function(response) {
    if (!response.ok) {
      throw new Error("לא ניתן לטעון runs.json");
    }
    return response.json();
  })
  .then(function(data) {
    runs = data;
    initDashboard();
  })
  .catch(function(error) {
    console.error("שגיאה בטעינת הנתונים:", error);
  });

function initDashboard() {
  buildKPIs();
  buildRecords();
  buildTable();
  buildCharts();
}

function buildKPIs() {
  const totalRuns = runs.length;
  const totalKm = runs.reduce(function(s, r) { return s + r.km; }, 0);
  const totalMinutes = runs.reduce(function(s, r) { return s + r.minutes; }, 0);
  const avgPace = runs.reduce(function(s, r) { return s + r.pace; }, 0) / runs.length;

  document.getElementById("totalRuns").textContent = totalRuns;
  document.getElementById("totalKm").textContent = totalKm.toFixed(2);
  document.getElementById("totalMinutes").textContent = totalMinutes.toFixed(0);
  document.getElementById("avgPace").textContent = avgPace.toFixed(2);
}

function buildRecords() {
  const bestDistance = Math.max.apply(null, runs.map(function(r) { return r.km; }));
  const bestPace = Math.min.apply(null, runs.map(function(r) { return r.pace; }));
  const bestTime = Math.max.apply(null, runs.map(function(r) { return r.minutes; }));

  document.getElementById("bestDistance").textContent = bestDistance.toFixed(2) + " ק\"מ";
  document.getElementById("bestPace").textContent = bestPace.toFixed(2) + " דק/ק\"מ";
  document.getElementById("bestTime").textContent = bestTime.toFixed(0) + " דק";
}

function buildTable() {
  const tbody = document.querySelector("#runsTable tbody");
  tbody.innerHTML = "";

  runs.forEach(function(r) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + r.date + "</td>" +
      "<td>" + r.km.toFixed(2) + "</td>" +
      "<td>" + r.minutes.toFixed(0) + "</td>" +
      "<td>" + r.pace.toFixed(2) + "</td>" +
      "<td>" + r.effort + "</td>";
    tbody.appendChild(tr);
  });
}

function buildCharts() {
  const labels = runs.map(function(r) { return r.date; });

  new Chart(document.getElementById("distanceChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "ק\"מ",
        data: runs.map(function(r) { return r.km; }),
        borderWidth: 2,
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  new Chart(document.getElementById("paceChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "דק/ק\"מ",
        data: runs.map(function(r) { return r.pace; }),
        borderWidth: 2,
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { reverse: true }
      }
    }
  });
}

// --- Service Worker registration ---
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}