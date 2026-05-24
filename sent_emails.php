<?php
$pageTitle = "Sent Emails";
include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content">

<?php include 'includes/topbar.php'; ?>

<div style="margin-bottom: var(--spacing-lg); display: flex; gap: var(--spacing-md); align-items: center; flex-wrap: wrap;">

    <input type="text" id="emailSearch" placeholder="Search company, position, title...">

    <!-- <select id="companyFilter"></select> -->

    <select id="statusFilter">
        <option value="">All Status</option>
        <option value="Sent">Sent</option>
    </select>

    <button class="btn secondary-btn" onclick="exportToCSV()">
        <i class="fa fa-download"></i> Export CSV
    </button>

</div>

<div id="sentEmailsContainer" class="cards-grid"></div>

</div>

<script src="assets/js/sent_emails.js"></script>
<script src="assets/js/send.js"></script>

<?php include 'includes/footer.php'; ?>