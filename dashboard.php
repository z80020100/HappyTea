<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = '系統總覽 - 樂台茶餐飲管理系統';
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$sql = "SELECT * FROM `shop`";
$all_shops = array();
foreach ($db->query($sql) as $row) {
  $shop = array(
        'shop_id' => $row['shop_id'],
        'shop_name' => $row['shop_name'],
        'shop_address' => $row['shop_address'],
        'shop_tel' => $row['shop_tel'],
        'shop_owner' => $row['shop_owner']
  );
    $all_shops[] = $shop;
}

$template = $twig->loadTemplate('dashboard.html');
$_HTML .= $template->render(array(
  'allshops' => $all_shops

));

require_once('includes/custom/php/footer.php');

?>
