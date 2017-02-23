<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = 'Sample';
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$shop_info_array = array();
$sql = $sql = "SELECT * FROM `shop` WHERE `shop_id` <> -1";


// shold add if it is remove
foreach ($db->query($sql) as $row) {


    $shop_info = array(
        'shop_name' => $row['shop_name'],
    );
    $shop_info_array[] = $shop_info;



}


$template = $twig->loadTemplate('single_report.html');
$_HTML .= $template->render(array(
    'USER_IDENTITY' => $_USER_IDENTITY,
    'TOP_SHOP' => $_TOP_SHOP,
    'shop_info_array' => $shop_info_array

));

require_once('includes/custom/php/footer.php');

?>
