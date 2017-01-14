<?php

require_once ("includes/custom/php/general_define.php");

$_PAGE_TITLE = '系統總覽 - 樂台茶餐飲管理系統';
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$template = $twig->loadTemplate('dashboard.html');

$_HTML .= $template->render(array(
));

require_once('includes/custom/php/footer.php');

?>
