<?php

$_HTML = '';

if(!isset($uniform_theme)){
    $uniform_theme = false;
}
else if($uniform_theme == true){
    $header_type = $uniform_type;
}

if(!isset($header_type)){
    $header_type = HEADER_TYPE_NONE;
    $template = $twig->loadTemplate('no_header.html');
}
else if($header_type == HEADER_TYPE_CUSTOM){
    $template = $twig->loadTemplate('custom_header.html');
}
else if($header_type == HEADER_TYPE_SBADMIN2){
    $template = $twig->loadTemplate('sbadmin2_header.html');
}
else{
    $template = $twig->loadTemplate('no_header.html');
}

$_HTML .= $template->render(array(
	'PAGE_TITLE' => $_PAGE_TITLE,
));

?>
