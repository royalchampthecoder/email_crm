/* ================================================
   DASHBOARD - Data Management
   ================================================ */

let emails = [];
let companyChartInstance = null;
let dateChartInstance = null;

let stats = {
  totalEmails: 0,
  totalCompanies: 0,
  totalPositions: 0,
  todayEmails: 0,
  thisWeekEmails: 0
};

document.addEventListener('DOMContentLoaded', async () => {
  await initDashboard();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = emails.filter(email =>
        (email.company || '').toLowerCase().includes(query) ||
        (email.position || '').toLowerCase().includes(query) ||
        (email.title || '').toLowerCase().includes(query) ||
        (email.to_email || '').toLowerCase().includes(query)
      );
      renderRecent(filtered);
    });
  }
});

async function initDashboard() {
  try {
    const response = await fetch('api/get_sent_emails.php');
    const data = await response.json();

    emails = Array.isArray(data) ? data : (data.data || []);

    calculateStats();
    renderStats();
    renderRecent(emails);
    renderCharts();
  } catch (error) {
    console.error('Error loading emails:', error);
    if (window.toast) toast.error('Failed to load dashboard data');
  }
}

function parseEmailDate(dateString) {
  if (!dateString) return null;

  const rawDate = dateString.split(' ')[0];
  const [dd, mm, yyyy] = rawDate.split('-').map(Number);

  if (!dd || !mm || !yyyy) return null;

  return new Date(yyyy, mm - 1, dd);
}

function formatDateKey(dateString) {
  const date = parseEmailDate(dateString);
  if (!date) return null;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function calculateStats() {
  stats.totalEmails = emails.length;
  stats.totalCompanies = new Set(emails.map(e => e.company).filter(Boolean)).size;
  stats.totalPositions = new Set(emails.map(e => e.position).filter(Boolean)).size;

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  stats.todayEmails = emails.filter(e => formatDateKey(e.date) === todayKey).length;

  const weekAgo = new Date();
  weekAgo.setHours(0, 0, 0, 0);
  weekAgo.setDate(weekAgo.getDate() - 7);

  stats.thisWeekEmails = emails.filter(e => {
    const d = parseEmailDate(e.date);
    return d && d >= weekAgo;
  }).length;
}

function renderStats() {
  const statsGrid = document.getElementById('statsGrid');
  if (!statsGrid) return;

  statsGrid.innerHTML = `
    <div class="stat-card">
      <h3>${stats.totalEmails}</h3>
      <p>Total Emails Sent</p>
    </div>
    <div class="stat-card">
      <h3>${stats.totalCompanies}</h3>
      <p>Total Companies</p>
    </div>
    <div class="stat-card">
      <h3>${stats.totalPositions}</h3>
      <p>Total Positions</p>
    </div>
    <div class="stat-card">
      <h3>${stats.todayEmails}</h3>
      <p>Today's Emails</p>
    </div>
    <div class="stat-card">
      <h3>${stats.thisWeekEmails}</h3>
      <p>This Week</p>
    </div>
  `;
}

function renderRecent(data = emails) {
  const recentContainer = document.getElementById('recentEmails');
  if (!recentContainer) return;

  let html = '';

  if (!data.length) {
    html = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa fa-inbox"></i></div>
        <h3>No emails sent yet</h3>
        <p>Start sending emails to see them appear here</p>
      </div>
    `;
  } else {
    data.slice(0, 8).forEach(email => {
      html += `
        <div class="email-card">
          <h3>${escapeHtml(email.company || '-')}</h3>
          <p><strong>Title:</strong> ${escapeHtml(email.title || '-')}</p>
          <p><strong>Position:</strong> ${escapeHtml(email.position || '-')}</p>
          <p><strong>Email:</strong> ${escapeHtml(email.to_email || '-')}</p>
          <p class="text-small text-muted">${escapeHtml(email.date || '-')}</p>
          <span class="badge">${escapeHtml(email.status || 'Sent')}</span>
        </div>
      `;
    });
  }

  recentContainer.innerHTML = html;
}

function renderCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded');
    return;
  }

  renderCompanyChart();
  renderDateChart();
}

function renderCompanyChart() {
  const canvas = document.getElementById('companyChart');
  if (!canvas) return;

  if (companyChartInstance) {
    companyChartInstance.destroy();
    companyChartInstance = null;
  }

  const companyCounts = {};
  emails.forEach(e => {
    const company = e.company || 'Unknown';
    companyCounts[company] = (companyCounts[company] || 0) + 1;
  });

  const sortedCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (!sortedCompanies.length) return;

  companyChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: sortedCompanies.map(([name]) => name),
      datasets: [{
        label: 'Emails Sent',
        data: sortedCompanies.map(([, count]) => count),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6b7280'
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6b7280'
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)'
          }
        }
      }
    }
  });
}

function renderDateChart() {
  const canvas = document.getElementById('dateChart');
  if (!canvas) return;

  if (dateChartInstance) {
    dateChartInstance.destroy();
    dateChartInstance = null;
  }

  const dateCounts = {};

  emails.forEach(e => {
    const dateKey = formatDateKey(e.date);
    if (dateKey) {
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    }
  });

  const sortedDates = Object.entries(dateCounts)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-30);

  if (!sortedDates.length) return;

  dateChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: sortedDates.map(([date]) => date),
      datasets: [{
        label: 'Emails Sent',
        data: sortedDates.map(([, count]) => count),
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6b7280'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6b7280'
          },
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6b7280'
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.15)'
          }
        }
      }
    }
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}