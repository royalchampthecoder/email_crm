<?php
$pageTitle = "Dashboard";
include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="content">

<?php include 'includes/topbar.php'; ?>

<div class="stats-grid" id="statsGrid">
    <div class="stat-card">
        <h3>0</h3>
        <p>Total Emails Sent</p>
    </div>
    <div class="stat-card">
        <h3>0</h3>
        <p>Total Companies</p>
    </div>
    <div class="stat-card">
        <h3>0</h3>
        <p>Total Positions</p>
    </div>
    <div class="stat-card">
        <h3>0</h3>
        <p>Today's Emails</p>
    </div>
</div>

<div class="charts-grid">
    <div class="chart-card">
        <h3>Emails by Company (Top 10)</h3>
        <canvas id="companyChart"></canvas>
    </div>

    <div class="chart-card">
        <h3>Daily Email Volume (Last 30 Days)</h3>
        <canvas id="dateChart"></canvas>
    </div>
</div>

<div class="search-box">
    <input type="text" id="searchInput"
    placeholder="Search company, title, position, email...">
</div>

<div id="recentEmails" class="cards-grid"></div>

</div>

<script src="assets/js/dashboard.js"></script>
<script src="assets/js/send.js"></script>

<?php include 'includes/footer.php'; ?>