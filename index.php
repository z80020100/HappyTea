<?php

require_once ("includes/custom/php/general_define.php");
$_PAGE_TITLE = '樂台茶POS系統';
$header_type = HEADER_TYPE_NONE;
$nav_type = NAV_TYPE_NONE;
$footer_type = FOOTER_TYPE_NONE;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

/*
not_login_redirect();
if (is_staff()) {
	not_staff_redirect();
}
*/

/*
// List Series by order_num
$sql = "SELECT * FROM `series` WHERE `shop_id` = '".$_shopID."' ORDER BY `series`.`order_num` ASC ";
$result = $db->query($sql);
$num = $db->numrow($result);
$all_series = array();
while($series_data = $db->fetch_array($result)){
	$snum = array_push( $all_series, $series_data )-1;

	// List the dishes in the series
	$sql = "SELECT * FROM `main` WHERE `s_id` = ". $series_data['s_id'] ." ORDER BY `main`.`order_num` ASC";
	$m_result = $db->query($sql);
	$all_main = array();
	while($main_data = $db->fetch_array($m_result)){
		$mnum = array_push($all_main, $main_data)-1;

		// List the "Additional options" that are directly related to the dish
		$sql = "SELECT * FROM  `additional_item` WHERE `at_id` = ".$main_data['at_id'] ;
		$ai_result = $db->query($sql);
		$all_ai = array();
		while($ai_data = $db->fetch_array($ai_result)){
			$ainum = array_push($all_ai, $ai_data)-1;
		}
		$all_main[$mnum]['ai'] = $all_ai;

		$all_ro = array();
		if($main_data['required_option'] == true){
			// 1 dish <--> several required options
			$sql = "SELECT * FROM `required_option` WHERE `m_id` = ".$main_data['m_id'];
			$ro_result = $db->query($sql);
			$all_ro = array();
			while($ro_data = $db->fetch_array($ro_result)){
				$ronum = array_push($all_ro, $ro_data)-1;

				// 1 required option <--> several item to choose
				$sql = "SELECT * FROM  `additional_item` WHERE `at_id` = ".$ro_data['at_id'] ;
				$ai_result = $db->query($sql);
				$all_ro_ai = array();
				while($ai_data = $db->fetch_array($ai_result)){
					$ro_ainum = array_push($all_ro_ai, $ai_data)-1;
				}
				$all_ro[$ronum]['ai'] = $all_ro_ai;
			}
		}
		$all_main[$mnum]['ro'] = $all_ro;
	}
	$all_series[$snum]['main'] = $all_main;
}
*/

//if (is_staff()){
    $template = $twig->loadTemplate('pos_index.html');
//}
//else{
    //$template = $twig->loadTemplate('index.html');
//}

$_HTML .= $template->render(array(
	//'all_series' => $all_series,
    //'verification_code' => $Qver['value'],
));

require_once('includes/custom/php/footer.php');

?>
