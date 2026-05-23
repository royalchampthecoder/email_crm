let allTemplates = [];

/*
========================
OPEN SEND POPUP
========================
*/

function openSendPopup() {

fetch('send_popup.php')

.then(res => res.text())

.then(html => {

let oldModal =
document.getElementById('sendModal');

if (oldModal) {
oldModal.remove();
}

document.body.insertAdjacentHTML(
'beforeend',
html
);

loadCompanies();

})

.catch(error => {

console.log(error);

alert('Failed to load popup');

});

}

/*
========================
CLOSE POPUP
========================
*/

function closeSendPopup() {

let modal =
document.getElementById('sendModal');

if (modal) {
modal.remove();
}

}

/*
========================
LOAD COMPANIES
========================
*/

function loadCompanies() {

fetch('api/get_templates.php')

.then(res => res.json())

.then(data => {

allTemplates = data;

let companies = [
...new Set(
data.map(t => t.company)
)
];

let select =
document.getElementById('sendCompany');

if (!select) return;

select.innerHTML = `
<option value="">
Select Company
</option>
`;

companies.forEach(company => {

select.innerHTML += `
<option value="${company}">
${company}
</option>
`;

});

});

}

/*
========================
LOAD POSITIONS
========================
*/

function loadPositions() {

let company =
document.getElementById('sendCompany').value;

let filtered =
allTemplates.filter(
t => t.company === company
);

let select =
document.getElementById('sendPosition');

select.innerHTML = `
<option value="">
Select Position
</option>
`;

filtered.forEach(t => {

select.innerHTML += `
<option value="${t.position}">
${t.position}
</option>
`;

});

loadPreview();

}

/*
========================
LOAD TEMPLATE PREVIEW
========================
*/

function loadPreview() {

let company =
document.getElementById('sendCompany').value;

let position =
document.getElementById('sendPosition').value;

let template =
allTemplates.find(t =>
t.company === company &&
t.position === position
);

if (!template) return;

let previewSubject =
document.getElementById('previewSubject');

let previewBody =
document.getElementById('previewBody');

if (previewSubject) {

previewSubject.innerHTML =
template.subject;

}

if (previewBody) {

previewBody.innerHTML =
template.body;

}

}

/*
========================
SEND EMAIL
========================
*/

function sendEmail() {

let to =
document.getElementById('toEmail').value;

let company =
document.getElementById('sendCompany').value;

let position =
document.getElementById('sendPosition').value;

/*
========================
VALIDATION
========================
*/

if (
to === '' ||
company === '' ||
position === ''
) {

alert('Please fill all fields');

return;

}

/*
========================
GET TEMPLATE
========================
*/

let template =
allTemplates.find(t =>

t.company === company &&
t.position === position

);

if (!template) {

alert('Template not found');

return;

}

/*
========================
SAVE SENT EMAIL
========================
*/

let saveData =
new FormData();

saveData.append(
'to_email',
to
);

saveData.append(
'company',
company
);

saveData.append(
'title',
template.title
);

saveData.append(
'position',
position
);

saveData.append(
'subject',
template.subject
);

fetch(
'api/save_sent_email.php',
{
method: 'POST',
body: saveData
}
)

.then(res => res.text())

.then(() => {

/*
========================
OPEN OUTLOOK
========================
*/

let url =
`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;

window.open(
url,
'_blank'
);

/*
========================
CLOSE POPUP
========================
*/

closeSendPopup();

})

.catch(error => {

console.log(error);

alert('Failed to send email');

});

}

/*
========================
TOPBAR BUTTON
========================
*/

document.addEventListener(
'DOMContentLoaded',
() => {

let sendBtn =
document.getElementById(
'sendEmailBtn'
);

if (sendBtn) {

sendBtn.addEventListener(
'click',
openSendPopup
);

}

}
);