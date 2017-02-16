<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = 'Sample'; // 請輸入頁面抬頭
$header_type = HEADER_TYPE_SBADMIN2; // 請參考includes/custom/php/general_define.php
$nav_type = NAV_TYPE_SBADMIN2;       // 請參考includes/custom/php/general_define.php
$footer_type = FOOTER_TYPE_SBADMIN2; // 請參考includes/custom/php/general_define.php
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');




// get today's report
//if($_SHOP_ID == -1){
//    $sql = "SELECT * FROM log where Date(time) = CURDATE()";
//
//}else{
//    $sql = "SELECT * FROM log where Date(time) = CURDATE() WHERE `shop_id` = '".$_SHOP_ID."'";
//
//}
//
//
//foreach ($db->query($sql) as $row) {
//
//
//echo json_encode($row, JSON_UNESCAPED_UNICODE);
//}
//
//

$template = $twig->loadTemplate('total_report.html');
$_HTML .= $template->render(array(

));

require_once('includes/custom/php/footer.php');

?>
