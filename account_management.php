<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = '帳號新增 - 樂台茶餐飲管理系統'; // 請輸入頁面抬頭
$header_type = HEADER_TYPE_SBADMIN2; // 請參考includes/custom/php/general_define.php
$nav_type = NAV_TYPE_SBADMIN2;       // 請參考includes/custom/php/general_define.php
$footer_type = FOOTER_TYPE_SBADMIN2; // 請參考includes/custom/php/general_define.php
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$template = $twig->loadTemplate('account_management.html');

if (isset($_POST['user_name'])) {

    $user_reginfo = array();

    if (isset($_POST['store_name'])) {
        // create user as drink store boss
        $shop_id = createShop($_POST['store_name'], $_POST['store_address'], $_POST['store_tel'], $_POST['user_name']);
        $user_reginfo['user_type'] = 3;
    }
    else{
        //create user as corporate staff    
        $shop_id = -1;
        $user_reginfo['user_type'] = 2;
    }
    $user_reginfo['user_name'] = $_POST['user_name'];
    $user_reginfo['user_gendor'] = $_POST['user_gendor'];
    $user_reginfo['user_id'] = $_POST['user_id'];
    $user_reginfo['user_tel'] = $_POST['user_tel'];

    createUser($_POST['user_account'], $_POST['user_password'], $user_reginfo, $shop_id );

}


$_HTML .= $template->render(array(
));

require_once('includes/custom/php/footer.php');

function createShop($shop_name, $shop_address, $shop_tel, $owner_name) {
    global $db;

    $sql = "SELECT * FROM `shop` WHERE `shop_name` = '" . $shop_name . "' ";
    if ($db->query_select_one($sql)) {
        return -1;
    }

    $sql = "INSERT INTO `shop` (`shop_id`, `shop_name`, `shop_address`, `shop_tel`, `shop_owner`, `shop_account`, `shop_type`) VALUES (NULL, '" . $shop_name . "', '" . $shop_address . "', '" . $shop_tel . "', '" . $owner_name . "', NULL, 1)";
    if (!$result = $db->query($sql)) {
        echo "<p>Error: " . $db->err . "</p>";
        echo "<p>Error text: " . $db->errtext . "</p>";
        die('error gf_uc_1<br>');
    }

    return $db->mysqli->insert_id;
}

function createUser($user_account, $user_passwd, $user_reginfo, $shop_id){
    global $db;

    $sql = "SELECT * FROM `user` WHERE `u_account` = '".$user_account."' ";
    if($db->query_select_one($sql)){
        return -1;
    }

    $sql = "INSERT INTO `user` (`u_id`, `u_account`, `u_pass`, `u_type`, `shop_id`, `is_remove`) VALUES (NULL, '".$user_account."', '".hash("sha256",$user_passwd)."', '".$user_reginfo['user_type']."', '".$shop_id."', 0);";

    if( !$result = $db->query($sql) ){
        echo "<p>Error: " . $db->err . "</p>";
        echo "<p>Error text: " . $db->errtext . "</p>";
        die('error user create 1<br>');
    }

    $new_user_id = $db->mysqli->insert_id;

    $sql = "INSERT INTO `user_info` (`ui_id`, `u_id`, `ui_phone`, `ui_name`, `ui_gendor`, `ui_country_id`) VALUES (NULL, '".$db->mysqli->insert_id."','".$user_reginfo['user_tel']."','".$user_reginfo['user_name']."','".$user_reginfo['user_gendor']."','".$user_reginfo['user_id']."');" ;
    if( !$result = $db->query($sql) ){
        echo "<p>Error: " . $db->err . "</p>";
        echo "<p>Error text: " . $db->errtext . "</p>";
        die('error user create 2 <br>');
    }

//header("Content-Type:text/html; charset=utf-8");
    return $new_user_id;
}

?>



