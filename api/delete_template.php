<?php

$file = '../data/templates.json';

$data = json_decode(file_get_contents($file), true);

unset($data[$_POST['index']]);

$data = array_values($data);

file_put_contents($file,
json_encode($data, JSON_PRETTY_PRINT));

echo "deleted";