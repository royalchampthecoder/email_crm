<?php

$file = '../data/sent_emails.json';

$data = json_decode(file_get_contents($file), true);

$data[] = [

"to_email" => $_POST['to_email'],
"title" => $_POST['title'],
"company" => $_POST['company'],
"position" => $_POST['position'],
"subject" => $_POST['subject'],
"status" => "Sent",
"date" => date('d-m-Y h:i A')

];

file_put_contents($file,
json_encode($data, JSON_PRETTY_PRINT));

echo "saved";