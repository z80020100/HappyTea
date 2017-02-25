<?php

require_once('includes/custom/php/general.php');
$remove_request = $_REQUEST;

$sql = "SELECT * From log ORDER BY `time` DESC LIMIT 5";
$remove_orders = array();

foreach ($db->query($sql) as $row) {
    $remove_orders[] = $row;
}



echo json_encode($remove_orders,JSON_UNESCAPED_UNICODE);

?>



