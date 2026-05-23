let emails = [];

fetch('api/get_sent_emails.php')
.then(res => res.json())
.then(data => {

emails = data;

renderStats();
renderRecent(data);
renderCharts(data);

});

function renderStats(){

document.getElementById('totalEmails')
.innerText = emails.length;

let companies =
[...new Set(emails.map(e=>e.company))];

document.getElementById('totalCompanies')
.innerText = companies.length;

let positions =
[...new Set(emails.map(e=>e.position))];

document.getElementById('totalPositions')
.innerText = positions.length;

let today =
new Date().toLocaleDateString('en-GB');

let todayCount =
emails.filter(e=>e.date.includes(today))
.length;

document.getElementById('todayEmails')
.innerText = todayCount;

}

function renderRecent(data){

let html='';

data.slice(0,10).forEach(email=>{

html += `
<div class="email-card">

<h3>${email.company}</h3>

<p>${email.title}</p>
<p>${email.position}</p>
<p>${email.to_email}</p>
<p>${email.status}</p>
<p>${email.date}</p>

</div>
`;

});

document.getElementById('recentEmails').innerHTML = html;

}

function renderCharts(data){

let companyCounts = {};

data.forEach(e=>{
companyCounts[e.company] =
(companyCounts[e.company] || 0)+1;
});

new Chart(document.getElementById('companyChart'),{
type:'bar',
data:{
labels:Object.keys(companyCounts),
datasets:[{
label:'Emails',
data:Object.values(companyCounts)
}]
}
});

}