fetch('runs.json')
  .then(response => response.json())
  .then(runs => {
    buildKPIs(runs);
    buildRecords(runs);
    buildTable(runs);
    buildCharts(runs);
  })
  .catch(err => console.error('שגיאה בטעינת נתונים:', err));

function buildKPIs(runs) {
  let totalRuns = runs.length;
  let totalKm = 0;
  let totalMinutes = 0;
  let totalPace = 0;

  runs.forEach(r => {
    totalKm += r.km;
    totalMinutes += r.minutes;
    totalPace += r.pace;
  });

  let avgPace = totalPace / runs.length;

  document.getElementById("totalRuns").textContent = totalRuns;
  document.getElementById("totalKm").textContent = totalKm.toFixed(2);
  document.getElementById("totalMinutes").textContent = totalMinutes.toFixed(0);
  document.getElementById("avgPace").textContent = avgPace.toFixed(2);
}

function buildRecords(runs) {
  let bestDistance = Math.max(...runs.map(r => r.km));
  let bestPace = Math.min(...runs.map(r => r.pace));
  let bestTime = Math.max(...runs.map(r => r.minutes));

  document.getElementById("bestDistance").textContent = bestDistance.toFixed(2) + " ק\"מ";
  document.getElementById("bestPace").textContent = bestPace.toFixed(2) + " דקה/ק\"מ";
  document.getElementById("bestTime").textContent = bestTime.toFixed(0) + " דקות";
}

function buildTable(runs) {
  let tbody = document.querySelector("#runsTable tbody");
  tbody.innerHTML = '';
  runs.forEach(r => {
    let tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + r.date + "</td>" +
      "<td>" + r.km.toFixed(2) + "</td>" +
      "<td>" + r.minutes.toFixed(0) + "</td>" +
      "<td>" + r.pace.toFixed(2) + "</td>" +
      "<td>" + r.effort + "</td>";
    tbody.appendChild(tr);
  });
}

function buildCharts(runs) {
  let labels = runs.map(r => r.date);
  let distances = runs.map(r => r.km);
  let paces = runs.map(r => r.pace);

  new Chart(document.getElementById("distanceChart"), {
    type: "line",
    data: { labels, datasets: [{ label: "ק\"מ", data: distances, borderWidth: 2, tension: 0.3, fill: false }] },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" } } } }
  });

  new Chart(document.getElementById("paceChart"), {
    type: "line",
    data: { labels, datasets: [{ label: "דקה/ק\"מ", data: paces, borderWidth: 2, tension: 0.3, fill: false }] },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { reverse: true, grid: { color: "#f1f5f9" } } } }
  });
}
