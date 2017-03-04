<?php

require_once('includes/custom/php/general.php');
$report_request = $_REQUEST;

$report_today =  date("Y-m-d");
$report_tomorrow = date("Y-m-d", strtotime('tomorrow'));

$sql = "SELECT * FROM `orders` WHERE shop_name = '".$_SHOP_ID."' AND `o_time` < '".$report_tomorrow."' AND `o_time` >= '".$report_today."'";

foreach ($db->query($sql) as $row) {
}



echo json_encode($remove_orders,JSON_UNESCAPED_UNICODE);

?>



