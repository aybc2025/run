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

// פונקציה לחישוב קו מגמה לינארי
function calculateTrendLine(data) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumXX += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return data.map(function(_, i) {
    return slope * i + intercept;
  });
}

function buildCharts() {
  const labels = runs.map(function(r) { return r.date; });
  const distanceData = runs.map(function(r) { return r.km; });
  const paceData = runs.map(function(r) { return r.pace; });

  // גרף מרחק
  new Chart(document.getElementById("distanceChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "ק\"מ",
          data: distanceData,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          borderWidth: 2.5,
          tension: 0.3,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: "מגמה",
          data: calculateTrendLine(distanceData),
          borderColor: "#10b981",
          borderWidth: 2,
          borderDash: [8, 4],
          fill: false,
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: {
      plugins: { 
        legend: { 
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 12,
            font: { size: 11 }
          }
        } 
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // גרף קצב
  new Chart(document.getElementById("paceChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "דק/ק\"מ",
          data: paceData,
          borderColor: "#dc2626",
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          borderWidth: 2.5,
          tension: 0.3,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: "מגמה",
          data: calculateTrendLine(paceData),
          borderColor: "#f59e0b",
          borderWidth: 2,
          borderDash: [8, 4],
          fill: false,
          pointRadius: 0,
          tension: 0
        }
      ]
    },
    options: {
      plugins: { 
        legend: { 
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 12,
            font: { size: 11 }
          }
        } 
      },
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