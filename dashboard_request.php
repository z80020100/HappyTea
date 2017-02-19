<?php

require_once('includes/custom/php/general.php');
checkPermission(basename(__FILE__));
$panel_request = $_REQUEST["dash_request"];


//echo json_encode("hello");


$res_array = array();


$sql = "SELECT COUNT(shop_id) FROM `user` WHERE `is_remove` = 0 AND `u_type` = 3 AND shop_id <> -1" ;
$num_store = $db->query_select_one($sql);


$sql = "SELECT COUNT(call_id) FROM `ingredient` WHERE `handled` = 0" ;
$num_call_material = $db->query_select_one($sql);


$sql = "SELECT COUNT(shop_id) FROM `shop`" ;
$num_activity_store = $db->query_select_one($sql);

$sql = "SELECT COUNT(u_id) FROM `user` WHERE `is_remove` = 0" ;
$num_user = $db->query_select_one($sql);

$res_array['num_store'] = $num_store[0]; 
$res_array['num_call_material'] = $num_call_material[0]; 
$res_array['num_activity_store'] = $num_activity_store[0]; 
$res_array['num_user'] = $num_user[0]-1; 

echo json_encode($res_array,JSON_UNESCAPED_UNICODE);

?>



