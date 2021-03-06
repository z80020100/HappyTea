<?php

if(!isset($uniform_theme)){
    $uniform_theme = false;
}
else if($uniform_theme == true){
    $nav_type = $uniform_type;
}

if(!isset($nav_type)){
    $nav_type = NAV_TYPE_NONE;
    $template = $twig->loadTemplate('empty.html');
}
else if($nav_type == NAV_TYPE_CUSTOM){
    $template = $twig->loadTemplate('custom_navigation.html');
}
else if($nav_type == NAV_TYPE_SBADMIN2){
    $template = $twig->loadTemplate('sbadmin2_navigation.html');
}
else{
    $template = $twig->loadTemplate('empty.html');
}

$_HTML .= $template->render(array(
    'USER_IDENTITY' => $_USER_IDENTITY,
    'TOP_SHOP' => $_TOP_SHOP,
    //'USER_ACCOUNT' => $_USER_ACCOUNT,
    //'SHOP_NAME' => $_SHOP_NAME,
));

console(LEVEL_DBG, "\$_USER_ACCOUNT = $_USER_ACCOUNT", __FUNCTION__, __LINE__);
console(LEVEL_DBG, "\$_SHOP_NAME = $_SHOP_NAME", __FUNCTION__, __LINE__);

?>
