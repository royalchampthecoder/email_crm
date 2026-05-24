/* ================================================
   TEMPLATES PAGE
   ================================================ */

let templates = [];
let quill = null;
let currentEditIndex = null;

/* ================================================
   DOM READY
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  initializeQuill();

  loadTemplates();

  setupSearch();

  setupModalClose();

});

/* ================================================
   QUILL EDITOR
   ================================================ */

function initializeQuill() {

  const editor = document.getElementById('editor');

  if (!editor) {
    console.error('Editor not found');
    return;
  }

  if (typeof Quill === 'undefined') {
    console.error('Quill JS not loaded');
    return;
  }

  quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Write email template...',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ header: [1, 2, 3, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link'],
        ['clean']
      ]
    }
  });

}

/* ================================================
   MODAL FUNCTIONS
   ================================================ */

function openTemplateModal() {

  const modal = document.getElementById('templateModal');

  if (!modal) {
    console.error('Modal not found');
    return;
  }

  clearForm();

  modal.classList.add('show');

  document.body.style.overflow = 'hidden';

}

function closeTemplateModal() {

  const modal = document.getElementById('templateModal');

  if (!modal) return;

  modal.classList.remove('show');

  document.body.style.overflow = 'auto';

  currentEditIndex = null;

}

function setupModalClose() {

  const modal = document.getElementById('templateModal');

  if (!modal) return;

  window.addEventListener('click', (e) => {

    if (e.target === modal) {
      closeTemplateModal();
    }

  });

}

/* ================================================
   CLEAR FORM
   ================================================ */

function clearForm() {

  document.getElementById('templateIndex').value = '';

  document.getElementById('title').value = '';

  document.getElementById('company').value = '';

  document.getElementById('position').value = '';

  document.getElementById('subject').value = '';

  if (quill) {
    quill.root.innerHTML = '';
  }

}

/* ================================================
   LOAD TEMPLATES
   ================================================ */

async function loadTemplates() {

  try {

    const response = await fetch('api/get_templates.php');

    const data = await response.json();

    templates = Array.isArray(data) ? data : [];

    renderTemplates();

  } catch (error) {

    console.error(error);

    toast.error('Failed to load templates');

  }

}

/* ================================================
   RENDER TEMPLATES
   ================================================ */

function renderTemplates() {

  const container = document.getElementById('templatesContainer');

  if (!container) return;

  if (templates.length === 0) {

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fa fa-file-alt"></i>
        </div>

        <h3>No Templates Found</h3>

        <p>Create your first template</p>
      </div>
    `;

    return;
  }

  let html = '';

  templates.forEach((t, index) => {

    html += `
      <div class="email-card">

        <h3>${t.title || ''}</h3>

        <p><strong>Company:</strong> ${t.company || ''}</p>

        <p><strong>Position:</strong> ${t.position || ''}</p>

        <p><strong>Subject:</strong> ${t.subject || ''}</p>

        <div class="card-actions">

          <button class="btn secondary-btn"
          onclick="editTemplate(${index})">

            <i class="fa fa-edit"></i>
            Edit

          </button>

          <button class="btn secondary-btn"
          onclick="duplicateTemplate(${index})">

            <i class="fa fa-copy"></i>
            Duplicate

          </button>

          <button class="btn secondary-btn"
          onclick="deleteTemplate(${index})">

            <i class="fa fa-trash"></i>
            Delete

          </button>

        </div>

      </div>
    `;

  });

  container.innerHTML = html;

}

/* ================================================
   EDIT TEMPLATE
   ================================================ */

function editTemplate(index) {

  const t = templates[index];

  currentEditIndex = index;

  openTemplateModal();

  document.getElementById('templateIndex').value = index;

  document.getElementById('title').value = t.title || '';

  document.getElementById('company').value = t.company || '';

  document.getElementById('position').value = t.position || '';

  document.getElementById('subject').value = t.subject || '';

  if (quill) {
    quill.root.innerHTML = t.body || '';
  }

}

/* ================================================
   DUPLICATE TEMPLATE
   ================================================ */

function duplicateTemplate(index) {

  const t = templates[index];

  openTemplateModal();

  document.getElementById('title').value =
    (t.title || '') + ' Copy';

  document.getElementById('company').value =
    t.company || '';

  document.getElementById('position').value =
    t.position || '';

  document.getElementById('subject').value =
    t.subject || '';

  if (quill) {
    quill.root.innerHTML = t.body || '';
  }

}

/* ================================================
   SAVE TEMPLATE
   ================================================ */

async function saveTemplate() {

  const title =
    document.getElementById('title').value.trim();

  const company =
    document.getElementById('company').value.trim();

  const position =
    document.getElementById('position').value.trim();

  const subject =
    document.getElementById('subject').value.trim();

  const body =
    quill ? quill.root.innerHTML : '';

  if (
    !title ||
    !company ||
    !position ||
    !subject
  ) {

    toast.error('Fill all required fields');

    return;

  }

  const formData = new FormData();

  formData.append(
    'index',
    document.getElementById('templateIndex').value
  );

  formData.append('title', title);

  formData.append('company', company);

  formData.append('position', position);

  formData.append('subject', subject);

  formData.append('body', body);

  try {

    const response = await fetch(
      'api/save_template.php',
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.text();

    if (data.includes('error')) {

      toast.error('Failed to save');

    } else {

      toast.success('Template saved');

      closeTemplateModal();

      loadTemplates();

    }

  } catch (error) {

    console.error(error);

    toast.error('Error saving template');

  }

}

/* ================================================
   DELETE TEMPLATE
   ================================================ */

async function deleteTemplate(index) {

  const confirmDelete =
    confirm('Delete this template?');

  if (!confirmDelete) return;

  const formData = new FormData();

  formData.append('index', index);

  try {

    const response = await fetch(
      'api/delete_template.php',
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.text();

    if (data.includes('error')) {

      toast.error('Delete failed');

    } else {

      toast.success('Deleted');

      loadTemplates();

    }

  } catch (error) {

    console.error(error);

    toast.error('Delete failed');

  }

}

/* ================================================
   SEARCH
   ================================================ */

function setupSearch() {

  const search =
    document.getElementById('templateSearch');

  if (!search) return;

  search.addEventListener('keyup', () => {

    const query =
      search.value.toLowerCase();

    const cards =
      document.querySelectorAll('.email-card');

    cards.forEach(card => {

      const text =
        card.innerText.toLowerCase();

      card.style.display =
        text.includes(query)
          ? 'block'
          : 'none';

    });

  });

}