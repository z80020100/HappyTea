<?php

if(!isset($uniform_theme)){
    $uniform_theme = false;
}
else if($uniform_theme == true){
    $footer_type = $uniform_type;
}

if(!isset($footer_type)){
    $footer_type = FOOTER_TYPE_NONE;
    $template = $twig->loadTemplate('no_footer.html');
}
else if($footer_type == FOOTER_TYPE_CUSTOM){
    $template = $twig->loadTemplate('custom_footer.html');
}
else if($footer_type == FOOTER_TYPE_SBADMIN2){
    $template = $twig->loadTemplate('sbadmin2_footer.html');
}
else{
    $template = $twig->loadTemplate('no_footer.html');
}

$_HTML .= $template->render(array(
	//'PAGE_TITLE' => $_PAGE_TITLE,
));
$global_key = array_keys(get_defined_vars());
printGlobalVariables($global_key);
echo $_HTML;

?>