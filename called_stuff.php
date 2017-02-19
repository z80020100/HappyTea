<?php

require_once('includes/custom/php/general.php');
checkPermission(basename(__FILE__));
$_PAGE_TITLE = '叫料通知 - 樂台茶餐飲管理系統';
// remember check $uniform_theme in includes/custom/php/general.php
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

// redirect if it's not top_admin || top_staff || bottom_admin
// if (!(is_admin() || is_headquarters_staff())) {
// 	header("location:login.php?shop_id=" . $_shopID);
// 	die('');
// }

global $db;

$shop_id = $_SESSION['shop_id'];
if ($shop_id == -1) {
	/***
		總店
	***/
	/***
		handled = 0 -> 分店叫料，總店尚未處理
		handled = 1 -> 分店叫料，總店已處理
		handled = 2 -> 分店叫料，總店已處理，且分店已看過
	***/
	// read data from ingredient table
	$sql = "SELECT `shop_id`, `ingredient`, `num`, `unit`, `call_time`
			FROM `ingredient`
			WHERE `handled` = 0
			ORDER BY `call_time`";

	$result = $db->query($sql);

	$template = $twig->loadTemplate('top_called_stuff.html');

	$_HTML .= $template->render(array(
		'data' => $result,
	));
}
else {
	/***
		分店
	***/
	/***
		handled = 0 -> 分店叫料，總店尚未處理
		handled = 1 -> 分店叫料，總店已處理
		handled = 2 -> 分店叫料，總店已處理，且分店已看過
	***/
	// read data from ingredient table
	$sql = "SELECT `ingredient`, `num`, `unit`, `call_time`, `handled`
			FROM `ingredient`
			WHERE `handled` != 2 AND `shop_id` = '".$shop_id."'
			ORDER BY `call_time`";

	$result = $db->query($sql);

	$template = $twig->loadTemplate('called_stuff.html');

	$_HTML .= $template->render(array(
		'data' => $result,
	));
}

require_once('includes/custom/php/footer.php');

?>
