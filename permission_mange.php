<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = '權限管理 - 樂台茶餐飲管理系統';
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$template = $twig->loadTemplate('permission_mange.html');

$_HTML .= $template->render(array(
));

require_once('includes/custom/php/footer.php');

?>
