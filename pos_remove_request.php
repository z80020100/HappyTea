<?php

require_once('includes/custom/php/general.php');
$remove_request = $_REQUEST;

$sql = "SELECT * From orders ORDER BY `o_time` DESC LIMIT 5";
$remove_orders = array();

foreach ($db->query($sql) as $orders) {
    $sql2 = "SELECT * From log WHERE `o_id` = '".$orders['o_id']."'";
    foreach ($db->query($sql2) as $row) {
        $remove_orders[] = $row;
    }
}



echo json_encode($remove_orders,JSON_UNESCAPED_UNICODE);

?>



