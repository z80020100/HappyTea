<?php

require_once('includes/custom/php/general.php');

$change_account = $_POST['req'];
$target_id = $change_account['u_id'];
$sql = "SELECT * FROM `user` WHERE `u_id` = '" . $target_id . "' ";
$uType = $db->query_select_one($sql);

//echo json_encode($change_account['is_rm'], JSON_UNESCAPED_UNICODE);

if($change_account['is_rm'] == 1){
    // update (is_remove) accounts
    

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
    $sql = "UPDATE `user` SET `u_account` = '".$change_account['user_account']."', `u_pass` = '".hash("sha256",$change_account['user_passwd'])."' WHERE `u_id` = '".$change_account['u_id']."'";
    $result = $db->query($sql);
    $sql = "UPDATE `user_info` SET `ui_phone` = '".$change_account['user_tel']."', `ui_name` = '".$change_account['user_name']."', `ui_gendor` = '".$change_account['user_gendor']."', `ui_country_id` = '".$change_account['user_country_id']."' WHERE `u_id` = '".$change_account['u_id']."'";
    $result = $db->query($sql);
    if($uType['u_type'] ==3){
        $sql = "UPDATE `shop` SET `shop_owner` = '".$change_account['user_name']."' WHERE `shop_id` = '".$uType['shop_id']."'";
        $result = $db->query($sql);

        echo json_encode('success', JSON_UNESCAPED_UNICODE);
        

    }else{

        echo json_encode('success', JSON_UNESCAPED_UNICODE);

    }

} 


?>



