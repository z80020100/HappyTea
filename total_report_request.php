<?php

require_once('includes/custom/php/general.php');

$req = $_REQUEST['request'];


//global $db, $shift_start, $shift_end;
$start = $req['start'];
$end = $req['end'];
//
// get today's report
if($_SHOP_ID == -1){
$sql = "SELECT * FROM `log` WHERE `time` >= '".$start."' AND `time` <= '".$end."' AND HOUR(`time`) >= '".$shift_start."' AND HOUR(`time`) < '".($shift_end+1)."'";
}
//else{
//    //$sql = "SELECT * FROM log where Date(`time`) = `CURDATE()` WHERE `shop_id` = '".$_SHOP_ID."'";
//

//}
$result = $db->query($sql);
$ret = array();
while($order = $db->fetch_array($result)){
    array_push($ret, $order);
}
echo json_encode($ret, JSON_UNESCAPED_UNICODE);


?>



