<?php

require_once ("includes/custom/php/general.php");
checkPermission(basename(__FILE__));
$_PAGE_TITLE = '系統總覽 - 樂台茶餐飲管理系統';
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$all_shops = array();

$sql = "SELECT * FROM `user` WHERE `is_remove` = 0 AND `u_type` = 3 AND `shop_id` <> -1"; 
foreach ($db->query($sql) as $row) {
//    echo $row['u_account'];
    $sql = "SELECT * FROM `shop` WHERE `shop_id` = '".$row['shop_id']."'";
//
    foreach ($db->query($sql) as $inner_row) {
        $shop = array(
            'shop_id' => $inner_row['shop_id'],
            'shop_name' => $inner_row['shop_name'],
            'shop_address' => $inner_row['shop_address'],
            'shop_tel' => $inner_row['shop_tel'],
            'shop_owner' => $inner_row['shop_owner']
        );
        $all_shops[] = $shop;
    }
}

$template = $twig->loadTemplate('dashboard.html');
$_HTML .= $template->render(array(
  'allshops' => $all_shops

));

require_once('includes/custom/php/footer.php');

?>
