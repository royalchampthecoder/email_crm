<div class="sidebar">
	<div class="logo">
		<h2><i class="fa fa-envelope"></i> Email CRM</h2>
	</div>
	<ul class="menu">
		<li><a href="dashboard.php" class="<?= basename($_SERVER['PHP_SELF'])=='dashboard.php'?'active':'' ?>" title="Dashboard"><i class="fa fa-chart-bar"></i> <span>Dashboard</span></a></li>
		<li><a href="templates.php" class="<?= basename($_SERVER['PHP_SELF'])=='templates.php'?'active':'' ?>" title="Templates"><i class="fa fa-file-alt"></i> <span>Templates</span></a></li>
		<li><a href="sent_emails.php" class="<?= basename($_SERVER['PHP_SELF'])=='sent_emails.php'?'active':'' ?>" title="Sent Emails"><i class="fa fa-paper-plane"></i> <span>Sent Emails</span></a></li>
	</ul>
</div>