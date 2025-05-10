document.addEventListener('DOMContentLoaded', () => {
  // Pie chart (invoice status summary)
  const pieCtx = document.getElementById('summaryPieChart').getContext('2d');
  new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(statusSummary),
      datasets: [{
        label: 'Invoice Status',
        data: Object.values(statusSummary),
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 1
      }]
    },
    options: {




      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Invoice Status Distribution' }
      },
    }
  });

  // Line chart for electricity
  const electricityCtx = document.getElementById('electricityTrendChart').getContext('2d');
  new Chart(electricityCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Electricity (kWh)',
        data: electricityData,
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: 'rgba(33, 150, 243, 1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {

      responsive: true,
      plugins: {
        title: { display: true, text: 'Electricity Usage Over Time' }
      }
    }
  });

  // Line chart for gas
  const gasCtx = document.getElementById('gasTrendChart').getContext('2d');
  new Chart(gasCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Gas (m³)',
        data: gasData,
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        borderColor: 'rgba(255, 193, 7, 1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Gas Usage Over Time' }
      }
    }
  });
});
