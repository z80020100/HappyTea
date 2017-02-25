<?php
/***********************************************************
			order_response.php

		responds to customer order request from index.php

************************************************************/

/*
var test_order_info = {
	table_num : 15,
	people_num : 3,
	share_array : [
		{
			items_array:[
				{m_id:1, RO_array:[], AI_array:[{ai_id:1},{ai_id:2}],quantity:1 , comment:"不要加美乃滋"},
				{m_id:2, RO_array:[{ai_id:3},{ai_id:4}], AI_array:[],quantity:2, comment:""}
			]
		}
	],
};
*/
require_once ("includes/custom/php/general.php");
checkPermission(basename(__FILE__));
$_PAGE_TITLE = '樂台茶POS系統';
$header_type = HEADER_TYPE_NONE;
$nav_type = NAV_TYPE_NONE;
$footer_type = FOOTER_TYPE_NONE;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

//is_above_customer();

header("Content-Type:text/html; charset=utf-8");

$order_info = $_REQUEST['order_info'];
$request = $_REQUEST['req'];
/*********************
	return_sum
	confirm_sum
*********************/

// people_num doesn't exist in this mode
$_AWMode = 'BUSINESS';
/*if ($_AWMode == 'BUSINESS')
    $order_info['people_num'] = 1;*/

if( $request == "confirm_sum" ){
	if($_AWMode == "ACCOUNTING")
		$sql = "INSERT INTO `orders` (`o_id`, `u_id` , `o_time`, `o_estimate_time`, `table_num`, `people_num`, `status`, `shop_id`) VALUES (NULL, '".$_SESSION['u_id']."' ,  NOW(), NULL, '".$order_info['table_num']."', '".$order_info['people_num']."', '".$GLOBALS['STATUS'][sizeof($GLOBALS['STATUS'])-1]."', '".$_SHOP_ID."');";
	else if($_AWMode == "BUSINESS")
		$sql = "INSERT INTO `orders` (`o_id`, `u_id`, `o_time`, `o_estimate_time`, `table_num`, `people_num`, `status`, `shop_id`) VALUES (NULL, '".$_SESSION['u_id']."', NOW(), NULL, '".$order_info['table_num']."', '".$order_info['people_num']."', '".$GLOBALS['STATUS'][1]."', '".$_SHOP_ID."');";

	$db->query($sql);
	$o_id = $db->insert_id();

    echo $sql;
    print_r( $order_info);
	foreach($order_info['share_array'] as $share){
		print_r($share);

		$sql = "INSERT INTO `share` (`sh_id`, `o_id`, `total`) VALUES (NULL, '".$o_id."', '0')";
		$db->query($sql);
		$sh_id = $db->insert_id();
		//echo $sql . '\n';

		foreach($share['items_array'] as $item){
			$sql = "INSERT INTO `share_item` (`sh-i_id`, `sh_id`, `m_id`, `quantity`, `comment`, `price` ) VALUES (NULL, '".$sh_id."', '".$item['m_id']."', '".$item['quantity']."', '".mysqli_real_escape_string($db->mysqli,$item['comment'])."','".$item['price']."');";
			$db->query($sql);
			$sh_i_id = $db->insert_id();
			//echo $sql . '\n';

			$sql = "SELECT * FROM `main` WHERE `m_id` = ".$item['m_id'];
			$m_result = $db->query($sql);
			$main = $db->fetch_array($m_result);

			$sql = "SELECT * FROM `series` WHERE `s_id` = ".$main['s_id'];
			$se_result = $db->query($sql);
			$series = $db->fetch_array($se_result);

			$sql = "INSERT INTO `log` (`u_id`, `o_id`, `time`, `s_text`, `m_text`, `quantity`, `price`, `shop_id`) VALUES ('".$_SESSION['u_id']."', '".$o_id."', NOW(), '".$series['name']."', '".$main['name']."', ".$item['quantity'].", ".$item['price'].", '".$_SHOP_ID."')";
			$db->query($sql);
			//echo $sql . $db->insert_id();

			if( isset($item['AI_array'])){
				foreach($item['AI_array'] as $ai){
					$sql = "INSERT INTO `sh-i_ai` (`sh-i_ai_id`, `sh-i_id`, `ai_id`, `is_ro`) VALUES (NULL, '".$sh_i_id."', '".$ai."', '0')";
					$db->query($sql);
					//echo $sql . '\n';

				}
			}

			if( isset($item['RO_array'])){
				foreach($item['RO_array'] as $ai){
					$sql = "INSERT INTO `sh-i_ai` (`sh-i_ai_id`, `sh-i_id`, `ai_id`, `is_ro`) VALUES (NULL, '".$sh_i_id."', '".$ai."', '1')";
					$db->query($sql);
					//echo $sql . '\n';

				}
			}
		}

	}


	if($_AWMode == "ACCOUNTING")
		log_order($o_id);
}
elseif( $request == "return_sum")
{


}
elseif ( $request == "log_direct" ){
	$sql = "INSERT INTO `orders` (`o_id`, `u_id`, `o_time`, `o_estimate_time`, `table_num`, `people_num`, `status`, `shop_id`) VALUES (NULL, '".$_SESSION['u_id']."', NOW(), NULL, '".$order_info['table_num']."', '".$order_info['people_num']."', '".$GLOBALS['STATUS'][1]."', '".$_SHOP_ID."');";
	$db->query($sql);
	$o_id = $db->insert_id();

	foreach($order_info['share_array'] as $share){
		foreach($share['items_array'] as $item){
			$sql = "SELECT * FROM `main` WHERE `m_id` = ".$item['m_id'];
			$m_result = $db->query($sql);
			$main = $db->fetch_array($m_result);

			$sql = "SELECT * FROM `series` WHERE `s_id` = ".$main['s_id'];
			$se_result = $db->query($sql);
			$series = $db->fetch_array($se_result);

			$sql = "INSERT INTO `log` (`u_id`, `o_id`, `time`, `s_text`, `m_text`, `quantity`, `price`, `shop_id`) VALUES ('".$_SESSION['u_id']."', '".$o_id."', NOW(), '".$series['name']."', '".$main['name']."', ".$item['quantity'].", ".$item['price'].", '".$_SHOP_ID."')";
			$db->query($sql);
			echo $sql . $db->insert_id();
		}

	}
}




/*
INSERT INTO `orders` (`o_id`, `o_time`, `table_num`, `people_num`, `status`) VALUES (NULL, '1451095315', '5', '2', 'WAIT');
$o_id = mysqli_insert_id();
INSERT INTO `share` (`sh_id`, `o_id`, `total`) VALUES (NULL, '2', '0'), (NULL, '2', '0')
$sh_id = mysqli_insert_id();
INSERT INTO `share_item` (`sh-i_id`, `sh_id`, `m_id`, `quantity`, `comment`) VALUES (NULL, '4', '2', '1', '');
$sh-i_id = mysqli_insert_id();
INSERT INTO `sh-i_ai` (`sh-i_ai_id`, `sh-i_id`, `ai_id`, `is_ro`) VALUES (NULL, '2', '5', '1');
*/


/*$error_array = array('ai_id'=> -1, 'name' => '加點項目不存在', 'price' => 0);

$ai_array = array(
	array('ai_id' => 6, 'name'=>'加蛋', 'price' => 10),
	array('ai_id' => 7, 'name'=>'加起司', 'price' => 5),
);
$at_id = $_REQUEST['at']['id'];

if( $at_id == 6){
	echo json_encode($ai_array[0],JSON_UNESCAPED_UNICODE);
}
else if($at_id == 7){
	echo json_encode($ai_array[1],JSON_UNESCAPED_UNICODE);
}
else{
	echo json_encode($error_array,JSON_UNESCAPED_UNICODE);
}

*/





?>
