/* ================================================
   SENT EMAILS PAGE
   ================================================ */

let allEmails = [];

/* ================================================
   LOAD EMAILS ON PAGE LOAD
   ================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('api/get_sent_emails.php');
    const data = await response.json();

    allEmails = Array.isArray(data) ? data : (data.data || []);
    
    loadCompanies();
    renderEmails(allEmails);
  } catch (error) {
    console.error('Error loading emails:', error);
    toast.error('Failed to load sent emails');
  }
});

/* ================================================
   LOAD COMPANIES FILTER
   ================================================ */

/*function loadCompanies() {
  const companies = [...new Set(allEmails.map(e => e.company))];
  const select = document.getElementById('companyFilter');

  if (!select) return;

  select.innerHTML = '<option value="">All Companies</option>';
  companies.forEach(company => {
    select.innerHTML += `<option value="${company}">${company}</option>`;
  });
}
  */

/* ================================================
   RENDER EMAILS
   ================================================ */

function renderEmails(data) {
  const container = document.getElementById('sentEmailsContainer');
  if (!container) return;

  let html = '';

  if (data.length === 0) {
    html = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-state-icon"><i class="fa fa-inbox"></i></div>
        <h3>No emails found</h3>
        <p>Start sending emails to see them appear here</p>
      </div>
    `;
  } else {
    data.forEach(email => {
      html += `
        <div class="email-card">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-md);">
            <div>
              <h3>${email.company}</h3>
              <p style="font-size: 12px; color: var(--text-tertiary);">${email.date}</p>
            </div>
            <span class="badge">${email.status}</span>
          </div>

          <p><strong>Title:</strong> ${email.title}</p>
          <p><strong>Position:</strong> ${email.position}</p>
          <p><strong>Email:</strong> <a href="mailto:${email.to_email}" style="color: var(--primary); text-decoration: none;">${email.to_email}</a></p>
          <p><strong>Subject:</strong> ${email.subject}</p>

          <div class="card-actions">
            <button class="btn secondary-btn" onclick="copyToClipboard('${email.to_email}')">
              <i class="fa fa-copy"></i> Copy Email
            </button>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

/* ================================================
   FILTER EMAILS
   ================================================ */

function filterEmails() {
  const search = document.getElementById('emailSearch').value.toLowerCase();
  const company = document.getElementById('companyFilter').value;
  const status = document.getElementById('statusFilter').value;

  const filtered = allEmails.filter(email => {
    const matchSearch =
      email.company.toLowerCase().includes(search) ||
      email.position.toLowerCase().includes(search) ||
      email.title.toLowerCase().includes(search) ||
      email.to_email.toLowerCase().includes(search);

    const matchCompany = company === '' || email.company === company;
    const matchStatus = status === '' || email.status === status;

    return matchSearch && matchCompany && matchStatus;
  });

  renderEmails(filtered);
}

/* ================================================
   SETUP FILTER EVENT LISTENERS
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('emailSearch');
  const companyFilter = document.getElementById('companyFilter');
  const statusFilter = document.getElementById('statusFilter');

  if (searchInput) {
    searchInput.addEventListener('keyup', filterEmails);
  }

  if (companyFilter) {
    companyFilter.addEventListener('change', filterEmails);
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', filterEmails);
  }
});

/* ================================================
   COPY TO CLIPBOARD
   ================================================ */

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Email copied to clipboard!');
  }).catch(() => {
    toast.error('Failed to copy');
  });
}

/* ================================================
   EXPORT TO CSV
   ================================================ */

function exportToCSV() {
  if (allEmails.length === 0) {
    toast.warning('No emails to export');
    return;
  }

  const headers = ['Company', 'Title', 'Position', 'Email', 'Subject', 'Status', 'Date'];
  const rows = allEmails.map(e => [
    e.company,
    e.title,
    e.position,
    e.to_email,
    e.subject,
    e.status,
    e.date
  ]);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sent-emails-${new Date().getTime()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  toast.success('Emails exported successfully!');
}
