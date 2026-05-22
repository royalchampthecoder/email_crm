<div class="popup" id="sendPopup">

    <div class="popup-content send-popup">

        <div class="popup-header">

            <div>
                <h2>Send Email</h2>
                <p>Select company and position</p>
            </div>

            <span class="close-popup"
            onclick="closeSendPopup()">
                &times;
            </span>

        </div>

        <div class="popup-body">

            <div class="form-group">

                <label>To Email</label>

                <input
                type="email"
                id="toEmail"
                placeholder="Enter candidate email">

            </div>

            <div class="form-group">

                <label>Select Company</label>

                <select
                id="companySelect"
                onchange="loadPositions()">

                    <option value="">
                        Select Company
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label>Select Position</label>

                <select
                id="positionSelect"
                onchange="loadTemplate()">

                    <option value="">
                        Select Position
                    </option>

                </select>

            </div>

            <div class="template-preview">

                <h3>Email Preview</h3>

                <div class="preview-box">
<div class="modal" id="sendPopup">
    <div class="modal-content send-popup">
        <div class="popup-header">
            <div>
                <h2>Send Email</h2>
                <p>Select company and position</p>
            </div>
            <span class="close" onclick="closeSendPopup()">&times;</span>
        </div>
        <div class="popup-body">
            <div class="form-group">
                <label>To Email</label>
                <input type="email" id="toEmail" placeholder="Enter candidate email">
            </div>
            <div class="form-group">
                <label>Select Company</label>
                <select id="companySelect" onchange="loadPositions()">
                    <option value="">Select Company</option>
                </select>
            </div>
            <div class="form-group">
                <label>Select Position</label>
                <select id="positionSelect" onchange="loadTemplate()">
                    <option value="">Select Position</option>
                </select>
            </div>
            <div class="template-preview">
                <h3>Email Preview</h3>
                <div class="preview-box">
                    <p><strong>Subject:</strong> <span id="previewSubject">No template selected</span></p>
                    <div id="previewBody">Email body preview will appear here...</div>
                </div>
            </div>
        </div>
        <div class="popup-footer">
            <button class="secondary-btn" onclick="closeSendPopup()">Cancel</button>
            <button class="primary-btn" onclick="sendEmail()"><i class="fa fa-paper-plane"></i> Send Email</button>
        </div>
    </div>
</div>
<script>
function openSendPopup() {
    document.getElementById('sendPopup').classList.add('show');
}
function closeSendPopup() {
    document.getElementById('sendPopup').classList.remove('show');
}
</script>