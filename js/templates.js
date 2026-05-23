/*
========================
GLOBAL VARIABLES
========================
*/

let templates = [];

let quill;

/*
========================
INITIALIZE PAGE
========================
*/

document.addEventListener(
'DOMContentLoaded',
()=>{

initializeQuill();

loadTemplates();

}
);

/*
========================
INITIALIZE QUILL
========================
*/

function initializeQuill(){

const editor =
document.getElementById('editor');

if(!editor) return;

quill = new Quill(
'#editor',
{

theme:'snow',

placeholder:
'Write email template...',

modules:{

toolbar:[

['bold','italic','underline'],

[{header:[1,2,3,false]}],

[
{list:'ordered'},
{list:'bullet'}
],

[
{color:[]},
{background:[]}
],

[
{align:[]}
],

['link'],

['clean']

]

}

}
);

}

/*
========================
LOAD TEMPLATES
========================
*/

function loadTemplates(){

fetch('api/get_templates.php')

.then(res=>res.json())

.then(data=>{

templates = data || [];

renderTemplates();

})

.catch(error=>{

console.log(error);

});

}

/*
========================
RENDER TEMPLATES
========================
*/

function renderTemplates(){

let html='';

if(templates.length===0){

html=`
<div class="email-card">

<h3>No Templates Found</h3>

</div>
`;

}

templates.forEach((t,index)=>{

html += `

<div class="email-card">

<h3>${t.title}</h3>

<p>
<strong>Company:</strong>
${t.company}
</p>

<p>
<strong>Position:</strong>
${t.position}
</p>

<p>
<strong>Date:</strong>
${t.date}
</p>

<div class="card-actions">

<button
class="icon-btn"
onclick="editTemplate(${index})">

<i class="fa fa-edit"></i>

</button>

<button
class="icon-btn"
onclick="deleteTemplate(${index})">

<i class="fa fa-trash"></i>

</button>

</div>

</div>

`;

});

document.getElementById(
'templatesContainer'
).innerHTML = html;

}

/*
========================
OPEN MODAL
========================
*/

function openTemplateModal(){

document.getElementById(
'templateModal'
).classList.add('show');

/*
CLEAR FORM
*/

document.getElementById(
'templateIndex'
).value='';

document.getElementById(
'title'
).value='';

document.getElementById(
'company'
).value='';

document.getElementById(
'position'
).value='';

document.getElementById(
'subject'
).value='';

if(quill){

quill.root.innerHTML='';

}

}

/*
========================
CLOSE MODAL
========================
*/

function closeTemplateModal(){

document.getElementById(
'templateModal'
).classList.remove('show');

}

/*
========================
EDIT TEMPLATE
========================
*/

function editTemplate(index){

let t = templates[index];

openTemplateModal();

/*
SET VALUES
*/

document.getElementById(
'templateIndex'
).value=index;

document.getElementById(
'title'
).value=t.title;

document.getElementById(
'company'
).value=t.company;

document.getElementById(
'position'
).value=t.position;

document.getElementById(
'subject'
).value=t.subject;

/*
SET QUILL CONTENT
*/

if(quill){

quill.root.innerHTML =
t.body || '';

}

}

/*
========================
SAVE TEMPLATE
========================
*/

function saveTemplate(){

let title =
document.getElementById(
'title'
).value;

let company =
document.getElementById(
'company'
).value;

let position =
document.getElementById(
'position'
).value;

let subject =
document.getElementById(
'subject'
).value;

let body =
quill
?
quill.root.innerHTML
:
'';

/*
VALIDATION
*/

if(
title==='' ||
company==='' ||
position==='' ||
subject===''
){

alert('Please fill all fields');

return;

}

/*
FORM DATA
*/

let formData =
new FormData();

formData.append(
'index',
document.getElementById(
'templateIndex'
).value
);

formData.append(
'title',
title
);

formData.append(
'company',
company
);

formData.append(
'position',
position
);

formData.append(
'subject',
subject
);

formData.append(
'body',
body
);

/*
SAVE API
*/

fetch(
'api/save_template.php',
{
method:'POST',
body:formData
}
)

.then(res=>res.text())

.then(response=>{

closeTemplateModal();

loadTemplates();

})

.catch(error=>{

console.log(error);

alert('Save failed');

});

}

/*
========================
DELETE TEMPLATE
========================
*/

function deleteTemplate(index){

let confirmDelete =
confirm(
'Delete this template?'
);

if(!confirmDelete) return;

let formData =
new FormData();

formData.append(
'index',
index
);

fetch(
'api/delete_template.php',
{
method:'POST',
body:formData
}
)

.then(res=>res.text())

.then(()=>{

loadTemplates();

})

.catch(error=>{

console.log(error);

});

}