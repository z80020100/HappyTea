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



$sql = "INSERT INTO `orders` ( `u_id`, `o_time`, `o_estimate_time`, `table_num`, `people_num`, `status`, `shop_id`, `in_or_out`, `is_remove`, `discount_ratio`, `order_price`, `discount_amount`) VALUES ( '0', NOW(), NULL, '1' , '0', 'WAIT', '".$_SHOP_ID."', '".$order_info['in_or_out']."', '0', '".$order_info['discount_ratio']."', '".$order_info['check_out_total_amount']."', '".$order_info['discount_amount']."');";

$db->query($sql);
$o_id = $db->insert_id();



foreach($order_info['share_array'] as $share){

    foreach($share['items_array'] as $item){


        $sql = "SELECT * FROM `main` WHERE `name` = '".$item['name']."'";
        $m_result = $db->query($sql);
        $main = $db->fetch_array($m_result);

        $sql = "SELECT * FROM `series` WHERE `s_id` = '".$main['s_id']."'";
        $se_result = $db->query($sql);
        $series = $db->fetch_array($se_result);

        $sql = "INSERT INTO `log` (`u_id`, `o_id`, `time`, `s_text`, `m_text`, `quantity`, `price`, `shop_id`, `volume`) VALUES ( '0', '".$o_id."', NOW(), '".$series['name']."', '".$main['name']."', ".$item['quantity'].", ".$item['price'].", '".$_SHOP_ID."', '".$item['volume']."')";
        $db->query($sql);
        $log_id = $db->insert_id(); 

        foreach($item['comment'] as $comment){
            
            $sql = "INSERT INTO `log_material` (`log_id`, `name`, `quantity`) VALUES ('".$log_id."', '".$comment."','1')";
            $db->query($sql);

        }

    }
}

$response = array();
$sql = "SELECT * FROM `shop` WHERE `shop_id` = '".$_SHOP_ID."'";
foreach($db->query($sql) as $row){
    $response[] = $row;
}
$response[] = $o_id;
//$response[] = $share['items_array'][0]['comment'][0];
echo json_encode($response,JSON_UNESCAPED_UNICODE);



?>
