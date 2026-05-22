fetch('api/get_sent_emails.php')
.then(res=>res.json())
.then(data=>{

renderEmails(data);

});

function renderEmails(data){

let html='';

data.forEach(email=>{

html += `
<div class="email-card">

<h3>${email.company}</h3>

<p>${email.title}</p>
<p>${email.position}</p>
<p>${email.to_email}</p>
<p>${email.subject}</p>
<p>${email.status}</p>
<p>${email.date}</p>

</div>
`;

});

document.getElementById('sentEmailsContainer').innerHTML=html;

}