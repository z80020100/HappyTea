<?php

require_once('includes/custom/php/general.php');
checkPermission(basename(__FILE__));

global $db;

// receive a json array
$req = $_REQUEST['request'];

$shop_id = $_SESSION['shop_id'];

if ($shop_id == -1) {
	/***
		總店
	***/
	// update if all info is the same
	$sql = "UPDATE `ingredient`
			SET `handled` = 1
			WHERE `shop_id` = '".$req['shop_id']."'
			AND `call_time` = '".$req['call_time']."'
			AND `ingredient` = '".$req['ingredient']."'
			AND `num` = '".$req['num']."'
			AND `unit` = '".$req['unit']."'
			LIMIT 1";
}
else {
	$sql = "UPDATE `ingredient`
			SET `handled` = 2
			WHERE `call_time` = '".$req['call_time']."'
			AND `ingredient` = '".$req['ingredient']."'
			AND `num` = '".$req['num']."'
			AND `unit` = '".$req['unit']."'
			AND `handled` = 1
			LIMIT 1";
}

$result = $db->query($sql);

?>