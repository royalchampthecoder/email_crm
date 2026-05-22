<?php
$pageTitle = "Sent Emails";
include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content">

<?php include 'includes/topbar.php'; ?>

<div class="filters">

<input type="text" id="emailSearch"
placeholder="Search company, position, title">

<select id="companyFilter"></select>

<select id="statusFilter">
<option value="">All Status</option>
<option value="Sent">Sent</option>
</select>

</div>

<div id="sentEmailsContainer" class="cards-grid"></div>

</div>

<script src="js/sent_emails.js"></script>

<?php include 'includes/footer.php'; ?>