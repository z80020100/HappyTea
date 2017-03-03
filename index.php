<?php

require_once ("includes/custom/php/general.php");
checkPermission(basename(__FILE__));
$_PAGE_TITLE = '樂台茶POS系統';
$header_type = HEADER_TYPE_NONE;
$nav_type = NAV_TYPE_NONE;
$footer_type = FOOTER_TYPE_NONE;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

// List Series by order_num
$sql = "SELECT * FROM `series` WHERE `shop_id` = '".$_SHOP_ID."' ORDER BY `series`.`order_num` ASC ";
$result = $db->query($sql);
$num = $db->numrow($result);
$all_series = array();
while($series_data = $db->fetch_array($result)){
	$snum = array_push( $all_series, $series_data )-1;

	// List the main item in the series
	$sql = "SELECT * FROM `main` WHERE `s_id` = ". $series_data['s_id'] ." ORDER BY `main`.`order_num` ASC";
	$m_result = $db->query($sql);
	$all_main = array();
	while($main_data = $db->fetch_array($m_result)){
		$mnum = array_push($all_main, $main_data)-1;
		$all_ro = array();
		$all_main[$mnum]['ro'] = $all_ro;
	}
	$all_series[$snum]['main'] = $all_main;
}

$sql = "SELECT DISTINCT name, price, ai_id FROM `additional_item`";
$all_material = $db->query($sql);

$template = $twig->loadTemplate('pos.html');
$_HTML .= $template->render(array(
	'all_series' => $all_series,
    'all_material' => $all_material,
));

require_once('includes/custom/php/footer.php');

?>
