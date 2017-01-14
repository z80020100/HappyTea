<?php

// 此檔案為新頁面用範本檔

require_once ("includes/custom/php/general_define.php");

$_PAGE_TITLE = 'Sample'; // 請輸入頁面抬頭
$header_type = HEADER_TYPE_SBADMIN2; // 請參考includes/custom/php/general_define.php
$nav_type = NAV_TYPE_SBADMIN2;       // 請參考includes/custom/php/general_define.php
$footer_type = FOOTER_TYPE_SBADMIN2; // 請參考includes/custom/php/general_define.php
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$template = $twig->loadTemplate('empty.html');

$_HTML .= $template->render(array(
));

// 此行註解請取消 //require_once('includes/custom/php/footer.php');

?>
