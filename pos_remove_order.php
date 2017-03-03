<?php

require_once('includes/custom/php/general.php');

if(isset($_REQUEST['o_id'])){
$sql = "UPDATE `orders` SET `is_remove` = 1 WHERE `o_id` = '".$_REQUEST['o_id']."'";
$result = $db->query($sql);


}


echo json_encode($result,JSON_UNESCAPED_UNICODE);

?>



