<?php

require_once('includes/custom/php/general.php');

$req = $_REQUEST['request'];

$report_today =  date("Y-m-d");
$report_tomorrow = date("Y-m-d", strtotime('tomorrow'));

$sql = "SELECT * FROM log where `time` >= '".$report_today."' AND `time` < '".$report_tomorrow."' AND `shop_id` = '".$_SHOP_ID."'";
$ret = array();
foreach ($db->query($sql) as $row) {
    $ret[] = $row;
}
echo json_encode($ret, JSON_UNESCAPED_UNICODE);

?>



