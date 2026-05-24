<?php
$pageTitle = "Templates";
include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content">

<?php include 'includes/topbar.php'; ?>

<div style="margin-bottom: var(--spacing-lg); display: flex; gap: var(--spacing-md); align-items: center;">

    <button class="btn primary-btn" onclick="openTemplateModal()">
        <i class="fa fa-plus"></i>
        Add Template
    </button>

    <input type="text" id="templateSearch" placeholder="Search templates..." style="flex: 1; max-width: 400px;">

</div>

<div id="templatesContainer" class="cards-grid"></div>

</div>

<!-- TEMPLATE MODAL -->
<div class="modal" id="templateModal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Create Template</h2>
            <button type="button" class="close" onclick="closeTemplateModal()" aria-label="Close">&times;</button>
        </div>

        <form id="templateForm" onsubmit="return false;">

            <div class="form-group">
                <label for="title">Title *</label>
                <input type="text" id="title" placeholder="Template title" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
                <div class="form-group">
                    <label for="company">Company *</label>
                    <input type="text" id="company" placeholder="Company name" required>
                </div>

                <div class="form-group">
                    <label for="position">Position *</label>
                    <input type="text" id="position" placeholder="Job position" required>
                </div>
            </div>

            <div class="form-group">
                <label for="subject">Subject *</label>
                <input type="text" id="subject" placeholder="Email subject" required>
            </div>

            <div class="form-group">
                <label for="editor">Email Body</label>
                <div class="quill-wrapper">
                    <div id="editor"></div>
                </div>
            </div>

            <input type="hidden" id="templateIndex">

            <div style="display: flex; gap: var(--spacing-md); justify-content: flex-end; padding-top: var(--spacing-lg); border-top: 1px solid var(--border-light);">
                <button type="button" class="btn secondary-btn" onclick="closeTemplateModal()">
                    <i class="fa fa-times"></i> Cancel
                </button>
                <button type="button" class="btn primary-btn" id="saveTemplateBtn" onclick="saveTemplate()">
                    <i class="fa fa-save"></i> Save Template
                </button>
            </div>

        </form>
    </div>
</div>

<script src="assets/js/templates.js"></script>
<script src="assets/js/send.js"></script>

<?php include 'includes/footer.php'; ?>