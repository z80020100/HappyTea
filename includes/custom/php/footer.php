<?php

if(!isset($footer_type)){
    $footer_type = FOOTER_TYPE_NONE;
}

if(!isset($uniform_theme)){
    $uniform_theme = false;
}

if($uniform_theme == true){
    $footer_type = $uniform_type;
}

if($footer_type == FOOTER_TYPE_CUSTOM){
    $template = $twig->loadTemplate('custom_footer.html');
}
else if($footer_type == FOOTER_TYPE_SBADMIN2){
    $template = $twig->loadTemplate('sbadmin2_footer.html');
}
else{
    $template = $twig->loadTemplate('no_footer.html');
}

$_HTML .= $template->render(array(
	'PAGE_TITLE' => $_PAGE_TITLE,
));


echo $_HTML;

?>