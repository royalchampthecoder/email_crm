function openSendPopup(){

fetch('send_popup.php')
.then(res=>res.text())
.then(html=>{

if(document.getElementById('sendModal')){
document.getElementById('sendModal').remove();
}

document.body.insertAdjacentHTML('beforeend',html);

loadCompanies();

});

}

function closeSendPopup(){

let modal = document.getElementById('sendModal');

if(modal){
modal.remove();
}

}

function loadCompanies(){

fetch('api/get_templates.php')
.then(res=>res.json())
.then(data=>{

let companies = [...new Set(data.map(t=>t.company))];

let select =
document.getElementById('sendCompany');

select.innerHTML =
'<option value="">Select Company</option>';

companies.forEach(company=>{

select.innerHTML += `
<option value="${company}">
${company}
</option>
`;

});

});

}

function loadPositions(){

fetch('api/get_templates.php')
.then(res=>res.json())
.then(data=>{

let company =
document.getElementById('sendCompany').value;

let filtered =
data.filter(t=>t.company==company);

let select =
document.getElementById('sendPosition');

select.innerHTML =
'<option value="">Select Position</option>';

filtered.forEach(t=>{

select.innerHTML += `
<option value="${t.position}">
${t.position}
</option>
`;

});

});

}

function sendEmail(){

let to =
document.getElementById('toEmail').value;

let company =
document.getElementById('sendCompany').value;

let position =
document.getElementById('sendPosition').value;

if(to=='' || company=='' || position==''){

alert('Please fill all fields');
return;

}

fetch('api/get_templates.php')
.then(res=>res.json())
.then(data=>{

let template =
data.find(t=>
t.company==company &&
t.position==position
);

if(!template){

alert('Template not found');
return;

}

let saveData = new FormData();

saveData.append('to_email',to);
saveData.append('company',company);
saveData.append('title',template.title);
saveData.append('position',position);
saveData.append('subject',template.subject);

fetch('api/save_sent_email.php',{

method:'POST',
body:saveData

})
.then(()=>{

let url =
`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;

window.open(url,'_blank');

closeSendPopup();

});

});

}