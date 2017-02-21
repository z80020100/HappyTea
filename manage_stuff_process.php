<?php

require_once('includes/custom/php/general.php');
checkPermission(basename(__FILE__));
global $db;

// receive a json array
$op = $_REQUEST['op'];

if($op == "add_raw"){
    $req = $_REQUEST['request'];
    // iterate req
    foreach ($req as $item) {
        // insert data into raw_material table
        $sql = "INSERT INTO `raw_material` (`raw_name`, `unit`)
                VALUES ('".$item['raw_name']."', '".$item['unit']."')";

        $result = $db->query($sql);
    }

    /*****
                raw_material table
    raw_id     raw_name     unit

    *****/
}
else if($op == "del_raw"){
    $raw_id = $_REQUEST['raw_id'];
    // DELETE FROM `raw_material` WHERE `raw_material`.`raw_id` = 9
    $sql = "DELETE FROM `raw_material` WHERE `raw_material`.`raw_id` = '$raw_id'";

    $result = $db->query($sql);
}
?>
