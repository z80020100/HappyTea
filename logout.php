<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = '系統登出';
$header_type = NAV_TYPE_NONE;
$nav_type = NAV_TYPE_NONE;
$footer_type = NAV_TYPE_NONE;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');
require_once('includes/custom/php/login_functions.php');

$template = $twig->loadTemplate('empty.html');

userLogout(true);
// echo "已登出";
header("refresh:0;url=staff_login.php");

$_HTML .= $template->render(array(

));

require_once('includes/custom/php/footer.php');

?>
