<?php

require_once('includes/custom/php/general.php');

$change_account = $_POST['req'];


if($change_account['is_rm'] == 1){
    // update (is_remove) accounts
    
    $target_id = $change_account['u_id'];
    $sql = "SELECT * FROM `user` WHERE `u_id` = '" . $target_id . "' ";
    $uType = $db->query_select_one($sql);

    if($uType['u_type'] ==3){
        // this is boss 
        $sql = "SELECT * FROM `user` WHERE `shop_id` = '" . $uType['shop_id'] . "' ";
        foreach ($db->query($sql) as $row){
            $sql = "UPDATE `user` SET `is_remove` = '1' WHERE `user`.`u_id` ='".$row['u_id']."'" ;
            $result = $db->query($sql);
        }

    }else{
        $sql = "UPDATE `user` SET `is_remove` = '1' WHERE `user`.`u_id` =$target_id" ;
        $result = $db->query($sql);

    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    
}
else{
    // modify this account
    echo "test";

} 


?>



