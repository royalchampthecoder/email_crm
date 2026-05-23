<div class="modal show" id="sendModal">

    <div class="modal-content send-popup">

        <span class="close"
        onclick="closeSendPopup()">
            &times;
        </span>

        <h2>Send Email</h2>

        <input
        type="email"
        id="toEmail"
        placeholder="Candidate Email">

        <select
        id="sendCompany"
        onchange="loadPositions()">
            <option value="">
                Select Company
            </option>
        </select>

        <select id="sendPosition">
            <option value="">
                Select Position
            </option>
        </select>

        <button
        class="btn primary-btn"
        onclick="sendEmail()">

            <i class="fa fa-paper-plane"></i>
            Send Email

        </button>

    </div>

</div>