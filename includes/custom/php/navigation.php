<?php

if(!isset($nav_type)){
    $nav_type = NAV_TYPE_NONE;
}

if($nav_type == NAV_TYPE_CUSTOM){
    $template = $twig->loadTemplate('custom_navigation.html');
}
else if($nav_type == NAV_TYPE_SBADMIN2){
    $template = $twig->loadTemplate('sbadmin2_navigation.html');
}
else{
    $template = $twig->loadTemplate('empty.html');
}

$_HTML .= $template->render(array(
	'PAGE_TITLE' => $_PAGE_TITLE,
));

?>
