let templates = [];

function loadTemplates(){

fetch('api/get_templates.php')
.then(res=>res.json())
.then(data=>{

templates = data;

renderTemplates();

});

}

function renderTemplates(){

let html='';

templates.forEach((t,index)=>{

html += `
<div class="email-card">

<h3>${t.title}</h3>

<p>${t.company}</p>
<p>${t.position}</p>
<p>${t.date}</p>

<div class="card-actions">

<button class="icon-btn"
onclick="editTemplate(${index})">
<i class="fa fa-edit"></i>
</button>

<button class="icon-btn"
onclick="deleteTemplate(${index})">
<i class="fa fa-trash"></i>
</button>

</div>

</div>
`;

});

document.getElementById('templatesContainer').innerHTML = html;

}

function openTemplateModal(){

document.getElementById('templateModal').style.display='flex';

}

function closeTemplateModal(){

document.getElementById('templateModal').style.display='none';

}

function editTemplate(index){

let t = templates[index];

openTemplateModal();

document.getElementById('templateIndex').value=index;
document.getElementById('title').value=t.title;
document.getElementById('company').value=t.company;
document.getElementById('position').value=t.position;
document.getElementById('subject').value=t.subject;
document.getElementById('body').value=t.body;

}

function saveTemplate(){

let formData = new FormData();

formData.append('index',
document.getElementById('templateIndex').value);

formData.append('title',
document.getElementById('title').value);

formData.append('company',
document.getElementById('company').value);

formData.append('position',
document.getElementById('position').value);

formData.append('subject',
document.getElementById('subject').value);

formData.append('body',
document.getElementById('body').value);

fetch('api/save_template.php',{
method:'POST',
body:formData
})
.then(res=>res.text())
.then(()=>{

closeTemplateModal();
loadTemplates();

});

}

function deleteTemplate(index){

let formData = new FormData();

formData.append('index',index);

fetch('api/delete_template.php',{
method:'POST',
body:formData
})
.then(()=>loadTemplates());

}

loadTemplates();