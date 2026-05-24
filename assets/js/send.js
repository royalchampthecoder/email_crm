/* ================================================
   SEND EMAIL - Popup Management
   ================================================ */

let allTemplates = [];

async function openSendPopup() {
  try {
    const response = await fetch('send_popup.php');
    const html = await response.text();

    const oldModal = document.getElementById('sendModal');
    if (oldModal) oldModal.remove();

    document.body.insertAdjacentHTML('beforeend', html);

    const modal = document.getElementById('sendModal');
    if (modal) {
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    }

    await loadCompanies();
    setupPopupEvents();
  } catch (error) {
    console.error('Error loading popup:', error);
    if (window.toast) toast.error('Failed to load send popup');
  }
}

function setupPopupEvents() {
  const modal = document.getElementById('sendModal');
  if (!modal) return;

  const companySelect = document.getElementById('sendCompany');
  const positionSelect = document.getElementById('sendPosition');
  const sendBtn = document.getElementById('sendBtn');
  const closeBtn = modal.querySelector('.close');

  if (companySelect) {
    companySelect.addEventListener('change', loadPositions);
  }

  if (positionSelect) {
    positionSelect.addEventListener('change', loadPreview);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', sendEmail);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSendPopup);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSendPopup();
  });

  document.addEventListener('keydown', handleSendPopupEsc);
}

function handleSendPopupEsc(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('sendModal');
    if (modal && modal.classList.contains('show')) {
      closeSendPopup();
    }
  }
}

function closeSendPopup() {
  const modal = document.getElementById('sendModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleSendPopupEsc);

    setTimeout(() => {
      if (modal.parentNode) modal.remove();
    }, 200);
  }
}

async function loadCompanies() {
  try {
    const response = await fetch('api/get_templates.php');
    const data = await response.json();

    allTemplates = Array.isArray(data) ? data : (data.data || []);

    const companies = [...new Set(allTemplates.map(t => t.company).filter(Boolean))];
    const select = document.getElementById('sendCompany');

    if (!select) return;

    select.innerHTML = '<option value="">Select Company</option>';
    companies.forEach(company => {
      select.innerHTML += `<option value="${escapeHtml(company)}">${escapeHtml(company)}</option>`;
    });
  } catch (error) {
    console.error('Error loading companies:', error);
    if (window.toast) toast.error('Failed to load companies');
  }
}

function loadPositions() {
  const companyEl = document.getElementById('sendCompany');
  const positionEl = document.getElementById('sendPosition');
  const previewSubject = document.getElementById('previewSubject');
  const previewBody = document.getElementById('previewBody');

  if (!companyEl || !positionEl) return;

  const company = companyEl.value;
  const filtered = allTemplates.filter(t => t.company === company);

  positionEl.innerHTML = '<option value="">Select Position</option>';
  filtered.forEach(t => {
    positionEl.innerHTML += `<option value="${escapeHtml(t.position)}">${escapeHtml(t.position)}</option>`;
  });

  if (previewSubject) previewSubject.textContent = 'Select a position to preview subject';
  if (previewBody) previewBody.innerHTML = '<p>Select a position to preview email body.</p>';
}

function loadPreview() {
  const companyEl = document.getElementById('sendCompany');
  const positionEl = document.getElementById('sendPosition');
  const previewSubject = document.getElementById('previewSubject');
  const previewBody = document.getElementById('previewBody');

  if (!companyEl || !positionEl || !previewSubject || !previewBody) return;

  const company = companyEl.value;
  const position = positionEl.value;

  const template = allTemplates.find(t => t.company === company && t.position === position);

  if (!template) {
    previewSubject.textContent = 'No subject';
    previewBody.innerHTML = '<p>No preview available.</p>';
    return;
  }

  previewSubject.textContent = template.subject || 'No subject';
  previewBody.innerHTML = template.body || '<p>No body</p>';
}

async function sendEmail() {
  const toEmailEl = document.getElementById('toEmail');
  const companyEl = document.getElementById('sendCompany');
  const positionEl = document.getElementById('sendPosition');
  const sendBtn = document.getElementById('sendBtn');

  if (!toEmailEl || !companyEl || !positionEl || !sendBtn) return;

  const toEmail = toEmailEl.value.trim();
  const company = companyEl.value;
  const position = positionEl.value;

  if (!toEmail || !company || !position) {
    if (window.toast) toast.error('Please fill all fields');
    return;
  }

  if (window.FormValidator && !FormValidator.email(toEmail)) {
    if (window.toast) toast.error('Please enter a valid email address');
    return;
  }

  const template = allTemplates.find(t => t.company === company && t.position === position);

  if (!template) {
    if (window.toast) toast.error('Template not found');
    return;
  }

  const originalText = sendBtn.innerHTML;
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';

  try {
    const formData = new FormData();
    formData.append('to_email', toEmail);
    formData.append('company', company);
    formData.append('title', template.title || '');
    formData.append('position', position);
    formData.append('subject', template.subject || '');

    await fetch('api/save_sent_email.php', {
      method: 'POST',
      body: formData
    });

    const url = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(toEmail)}&subject=${encodeURIComponent(template.subject || '')}&body=${encodeURIComponent(stripHtml(template.body || ''))}`;
    window.open(url, '_blank');

    if (window.toast) toast.success('Email saved and Outlook opened!');
    closeSendPopup();
  } catch (error) {
    console.error('Error sending email:', error);
    if (window.toast) toast.error('Failed to send email');
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = originalText;
  }
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('sendEmailBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', openSendPopup);
  }
});