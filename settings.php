<?php
$pageTitle = "Settings";
include 'includes/header.php';
include 'includes/sidebar.php';

// Load email settings config
$configFile = __DIR__ . '/api/email_settings.json';
$config = [];

if (file_exists($configFile)) {
    $config = json_decode(file_get_contents($configFile), true) ?: [];
}

// Initialize default config structure if empty
if (empty($config)) {
    $config = [
        'active_provider' => 'gmail',
        'gmail' => ['email' => '', 'password' => ''],
        'outlook' => ['email' => '', 'password' => '']
    ];
}

// Helper function to check if provider is selected
function checkedProvider($current, $value) {
    return $current === $value ? 'checked' : '';
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $config['active_provider'] = $_POST['provider'] ?? 'gmail';
    $config['gmail']['email'] = $_POST['gmail_email'] ?? '';
    $config['gmail']['password'] = $_POST['gmail_password'] ?? '';
    $config['outlook']['email'] = $_POST['outlook_email'] ?? '';
    $config['outlook']['password'] = $_POST['outlook_password'] ?? '';

    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT));

    header('Location: settings.php?saved=1');
    exit;
}
?>

<div class="content">
<?php include 'includes/topbar.php'; ?>

<div class="card">

    <h1>Email Settings</h1>

    <?php if(isset($_GET['saved'])): ?>
        <div class="success">
            Settings saved successfully.
        </div>
    <?php endif; ?>

    <form method="post">

        <div class="section">
            <h3>Select Provider</h3>

            <div class="provider-option">
                <label>
                    <input
                        type="radio"
                        name="provider"
                        value="gmail"
                        <?= checkedProvider($config['active_provider'], 'gmail'); ?>
                    >
                    Gmail SMTP
                </label>
            </div>

            <div class="provider-option">
                <label>
                    <input
                        type="radio"
                        name="provider"
                        value="outlook"
                        <?= checkedProvider($config['active_provider'], 'outlook'); ?>
                    >
                    Outlook SMTP
                </label>
            </div>

            <div class="provider-option">
                <label>
                    <input
                        type="radio"
                        name="provider"
                        value="deeplink"
                        <?= checkedProvider($config['active_provider'], 'deeplink'); ?>
                    >
                    Outlook Deeplink
                </label>
            </div>
        </div>

        <hr>

        <div class="section">
            <h3>Gmail SMTP Settings</h3>

            <div class="form-group">
                <label>Gmail Email</label>
                <input
                    type="email"
                    name="gmail_email"
                    value="<?= htmlspecialchars($config['gmail']['email']); ?>"
                >
            </div>

            <div class="form-group">
                <label>Gmail App Password</label>
                <input
                    type="password"
                    name="gmail_password"
                    value="<?= htmlspecialchars($config['gmail']['password']); ?>"
                >
            </div>
        </div>

        <hr>

        <div class="section">
            <h3>Outlook SMTP Settings</h3>

            <div class="form-group">
                <label>Outlook Email</label>
                <input
                    type="email"
                    name="outlook_email"
                    value="<?= htmlspecialchars($config['outlook']['email']); ?>"
                >
            </div>

            <div class="form-group">
                <label>Outlook Password</label>
                <input
                    type="password"
                    name="outlook_password"
                    value="<?= htmlspecialchars($config['outlook']['password']); ?>"
                >
            </div>
        </div>

        <button type="submit">
            Save Settings
        </button>

    </form>

</div>

</div>

<?php include 'includes/footer.php'; ?>
