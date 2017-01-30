<?php

require_once('includes/custom/php/general.php');
header("Content-Type:text/html; charset=utf-8");

$_HTML = '';

if(!isset($header_type)){
    $header_type = HEADER_TYPE_NONE;
}

if(!isset($uniform_theme)){
    $uniform_theme = false;
}

if($uniform_theme == true){
    $header_type = $uniform_type;
}

if($header_type == HEADER_TYPE_CUSTOM){
    $template = $twig->loadTemplate('custom_header.html');
}
else if($header_type == HEADER_TYPE_SBADMIN2){
    $template = $twig->loadTemplate('sbadmin2_header.html');
}
else{
    $template = $twig->loadTemplate('no_header.html');
}

if(!isset($all_series))
	$all_series = array();

if(!isset($_SESSION['u_type'])){
	$_USER_IDENTITY = $_Identity[IDGUEST]['name'];
	$_USER_NAME = '訪客';
}
else{
	$_USER_IDENTITY = $_Identity[$_SESSION['u_type']]['name'];
	$_USER_NAME = $_SESSION['u_name'];
}


$_HTML .= $template->render(array(
	'username' => $_USER_NAME,
	'PAGE_TITLE' => $_PAGE_TITLE,
	'USER_IDENTITY' => $_USER_IDENTITY,
	'all_series' => $all_series,
	'TOP_SHOP' => $_shopID,
	'shopname' => $_SESSION['shop_name']
));

?>
