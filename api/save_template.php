<?php

$file = '../data/templates.json';

$data = json_decode(file_get_contents($file), true);

$template = [

"title" => $_POST['title'],
"company" => $_POST['company'],
"position" => $_POST['position'],
"subject" => $_POST['subject'],
"body" => $_POST['body'],
"date" => date('d-m-Y h:i A')

];

if($_POST['index'] !== ''){

$data[$_POST['index']] = $template;

}else{

$data[] = $template;

}

file_put_contents($file,
json_encode($data, JSON_PRETTY_PRINT));

echo "saved";