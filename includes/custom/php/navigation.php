<?php

if(!isset($nav_type)){
    $nav_type = NAV_TYPE_NONE;
}

if(!isset($uniform_theme)){
    $uniform_theme = false;
}

if($uniform_theme == true){
    $nav_type = $uniform_type;
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

if($_shopID == -1){
    $top_shop = true;
}
else{
    $top_shop = false;
}

$_HTML .= $template->render(array(
    'PAGE_TITLE' => $_PAGE_TITLE,
    'USER_IDENTITY' => $_USER_IDENTITY,
    'USER_NAME' => $_USER_NAME,
    'TOP_SHOP' => $top_shop,
));

?>
