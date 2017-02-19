<?php

require_once('includes/custom/php/general.php');
checkPermission(basename(__FILE__));
global $db;

// receive a json array
$req = $_REQUEST['request'];
// get current time with year:month:date hour:minute:second format
date_default_timezone_set("Asia/Taipei");
$curTime = date("Y-m-d H:i:s");
// get shop id for the user
$shop_id = $_SESSION['shop_id'];
if ($shop_id == '') $shop_id = -2;  // -2: Error session
echo $shop_id;

// iterate req
foreach ($req as $item) {
	// insert data into ingredient table
	$sql = "INSERT INTO `ingredient` (`shop_id`, `ingredient`, `num`,
									  `unit`, `call_time`, `handled`)
			VALUES ('".$shop_id."', '".$item['ingredient']."', '".$item['num']."',
			 		'".$item['unit']."', '".$curTime."', 0)";

	$result = $db->query($sql);
}

/*****
 						ingredient table
shop_id     ingredient     num     unit     call_time     handled

*****/

?>
