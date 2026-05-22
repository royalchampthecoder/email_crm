<?php
$pageTitle = "Dashboard";
include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content">

<?php include 'includes/topbar.php'; ?>

<div class="stats-grid">

    <div class="stat-card">
        <h3 id="totalEmails">0</h3>
        <p>Total Emails Sent</p>
    </div>

    <div class="stat-card">
        <h3 id="totalCompanies">0</h3>
        <p>Total Companies</p>
    </div>

    <div class="stat-card">
        <h3 id="totalPositions">0</h3>
        <p>Total Positions</p>
    </div>

    <div class="stat-card">
        <h3 id="todayEmails">0</h3>
        <p>Today's Emails</p>
    </div>

</div>

<div class="charts-grid">

    <div class="chart-card">
        <canvas id="companyChart"></canvas>
    </div>

    <div class="chart-card">
        <canvas id="dayChart"></canvas>
    </div>

</div>

<div class="search-box">
    <input type="text" id="searchInput"
    placeholder="Search company, title, position, email">
</div>

<div id="recentEmails" class="cards-grid"></div>

</div>

<script src="js/dashboard.js"></script>

<?php include 'includes/footer.php'; ?>