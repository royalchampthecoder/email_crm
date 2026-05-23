<?php
$pageTitle = "Templates";
include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content">

<?php include 'includes/topbar.php'; ?>

<div class="template-top-actions">

<button class="btn primary-btn" onclick="openTemplateModal()">
    <i class="fa fa-plus"></i>
    Add Template
</button>

</div>

<div id="templatesContainer" class="cards-grid"></div>

</div>


<div class="modal" id="templateModal">
    <div class="modal-content">
        <span class="close" onclick="closeTemplateModal()">&times;</span>
        <h2>Template</h2>
        <input type="hidden" id="templateIndex">
        <input type="text" id="title" placeholder="Title">
        <input type="text" id="company" placeholder="Company">
        <input type="text" id="position" placeholder="Position">
        <input type="text" id="subject" placeholder="Subject">
       <div class="quill-wrapper">

    <div id="editor"></div>

</div>

<input type="hidden" id="body">
        <button class="btn primary-btn" onclick="saveTemplate()">Save Template</button>
    </div>
</div>

<script>
function openTemplateModal() {
    document.getElementById('templateModal').classList.add('show');
}
function closeTemplateModal() {
    document.getElementById('templateModal').classList.remove('show');
}
</script>

<script src="js/templates.js"></script>
<script src="js/send.js"></script>

<?php include 'includes/footer.php'; ?>