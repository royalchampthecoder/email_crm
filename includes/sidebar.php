<div class="sidebar">
	<div class="logo">
		<h2>Email CRM</h2>
	</div>
	<ul class="menu">
		<li><a href="dashboard.php" class="<?= basename($_SERVER['PHP_SELF'])=='dashboard.php'?'active':'' ?>"><i class="fa fa-chart-bar"></i> Dashboard</a></li>
		<li><a href="templates.php" class="<?= basename($_SERVER['PHP_SELF'])=='templates.php'?'active':'' ?>"><i class="fa fa-file-alt"></i> Templates</a></li>
		<li><a href="sent_emails.php" class="<?= basename($_SERVER['PHP_SELF'])=='sent_emails.php'?'active':'' ?>"><i class="fa fa-paper-plane"></i> Sent Emails</a></li>
	</ul>
</div>