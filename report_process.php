<?php

require_once('includes/custom/php/general.php');

global $db, $shift_start, $shift_end;

// receive a json array
$req = $_REQUEST['request'];

$op = $req['op'];
$start = $req['start'];
$end = $req['end'];
if ($_SHOP_ID == -1) $shop = $req['shop'];
else $shop =  $_SHOP_ID;

/* need to check if this authority has the permission to query the shop log */

switch ($op) {
  case 'query':
    $sql = "SELECT * FROM `log` WHERE `time` >= '".$start."' AND `time` <= '".$end."' AND HOUR(`time`) >= ".$shift_start." AND HOUR(`time`) < ".($shift_end+1)." AND shop_id = ".$shop;
    $result = $db->query($sql);

    $ret = array();
    while($order = $db->fetch_array($result)){
        array_push($ret, $order);
    }
    echo json_encode($ret, JSON_UNESCAPED_UNICODE);
    break;

  case 'dump':
    # code...
    break;

  default:
    $ret = array();
    array_push($ret, "ERROR OPERATION FOR LOG!!!");
    echo json_encode($ret, JSON_UNESCAPED_UNICODE);
    break;
}

?>