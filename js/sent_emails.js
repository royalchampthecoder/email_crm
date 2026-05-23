let allEmails = [];

fetch('api/get_sent_emails.php')
.then(res=>res.json())
.then(data=>{

allEmails = data;

loadCompanies(data);

renderEmails(data);

});

function loadCompanies(data){

let companies =
[...new Set(data.map(e=>e.company))];

let select =
document.getElementById('companyFilter');

select.innerHTML =
'<option value="">All Companies</option>';

companies.forEach(company=>{

select.innerHTML += `
<option value="${company}">
${company}
</option>
`;

});

}

function renderEmails(data){

let html='';

if(data.length===0){

html=`
<div class="email-card">
No emails found
</div>
`;

}

data.forEach(email=>{

html += `
<div class="email-card">

<h3>${email.company}</h3>

<p><strong>Title:</strong> ${email.title}</p>

<p><strong>Position:</strong> ${email.position}</p>

<p><strong>Email:</strong> ${email.to_email}</p>

<p><strong>Subject:</strong> ${email.subject}</p>

<p><strong>Status:</strong> ${email.status}</p>

<p><strong>Date:</strong> ${email.date}</p>

</div>
`;

});

document.getElementById(
'sentEmailsContainer'
).innerHTML = html;

}

function filterEmails(){

let search =
document.getElementById('emailSearch')
.value.toLowerCase();

let company =
document.getElementById('companyFilter')
.value;

let status =
document.getElementById('statusFilter')
.value;

let filtered =
allEmails.filter(email=>{

let matchSearch =

email.company.toLowerCase().includes(search) ||

email.position.toLowerCase().includes(search) ||

email.title.toLowerCase().includes(search);

let matchCompany =
company=='' ||
email.company==company;

let matchStatus =
status=='' ||
email.status==status;

return
matchSearch &&
matchCompany &&
matchStatus;

});

renderEmails(filtered);

}

document.getElementById(
'emailSearch'
).addEventListener('keyup',
filterEmails);

document.getElementById(
'companyFilter'
).addEventListener('change',
filterEmails);

document.getElementById(
'statusFilter'
).addEventListener('change',
filterEmails);