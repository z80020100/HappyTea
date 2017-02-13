<?php

require_once('includes/custom/php/general.php');

$change_account = $_POST['req'];


if($change_account['is_rm'] == 1){
    // update this account name 
    $target_id = $change_account['u_id'];
    $sql = "UPDATE `user` SET `is_remove` = '1' WHERE `user`.`u_id` =$target_id" ;
    $result = $db->query($sql);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);

    
}
else{
    echo "test";

} 


?>



