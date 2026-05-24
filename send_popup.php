<div class="modal show" id="sendModal">

    <div class="modal-content send-popup">

        <div class="modal-header">
            <h2>Send Email</h2>
            <button type="button" class="close" aria-label="Close">&times;</button>
        </div>

        <form onsubmit="return false;">

            <div class="form-group">
                <label for="toEmail">Recipient Email *</label>
                <input
                type="email"
                id="toEmail"
                placeholder="candidate@example.com"
                required>
            </div>

            <div class="form-group">
                <label for="sendCompany">Company *</label>
                <select id="sendCompany" required>
                    <option value="">Select Company</option>
                </select>
            </div>

            <div class="form-group">
                <label for="sendPosition">Position *</label>
                <select id="sendPosition" required>
                    <option value="">Select Position</option>
                </select>
            </div>

            <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: var(--spacing-lg); margin: var(--spacing-lg) 0; border: 1px solid var(--border-light);">
                <h4 style="margin-bottom: var(--spacing-md); font-size: 14px;">Preview</h4>
                <div style="margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-md); border-bottom: 1px solid var(--border-light);">
                    <p style="color: var(--text-tertiary); font-size: 12px; margin-bottom: var(--spacing-xs);">Subject:</p>
                    <p id="previewSubject" style="font-weight: 500; color: var(--text-primary);">Select a template to see preview</p>
                </div>
                <div>
                    <p style="color: var(--text-tertiary); font-size: 12px; margin-bottom: var(--spacing-xs);">Body:</p>
                    <div id="previewBody" style="font-size: 13px; color: var(--text-secondary); max-height: 200px; overflow-y: auto;"></div>
                </div>
            </div>

            <button
            type="button"
            class="btn primary-btn"
            id="sendBtn"
            style="width: 100%;">
                <i class="fa fa-paper-plane"></i>
                Send Email & Open Outlook
            </button>

        </form>

    </div>

</div>