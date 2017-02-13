<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = '帳號編輯 - 樂台茶餐飲管理系統';
// remember check $uniform_theme in includes/custom/php/general.php
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$template = $twig->loadTemplate('account_edit.html');

if($_SESSION['shop_id'] == -1 && $_SESSION['u_type'] == 3 ){
    // this is top boss
    $sql = "SELECT * FROM `user` INNER JOIN `user_info` on user.u_id = user_info.u_id WHERE not (shop_id = -1 AND u_type = 3) ";
}
elseif($_SESSION['shop_id'] == -1 && $_SESSION['u_type'] == 2){
    // this is top staff
    $sql = "SELECT * FROM `user` INNER JOIN `user_info` on user.u_id = user_info.u_id WHERE (shop_id = -1 AND u_type = 2) ";
}elseif($_SESSION['shop_id'] != -1 && $_SESSION['u_type'] == 3){
    // this is bottom boss
    $sql = "SELECT * FROM `user` INNER JOIN `user_info` on user.u_id = user_info.u_id WHERE (shop_id <> -1 AND u_type = 3) ";
}

foreach ($db->query($sql) as $row) {

    $row['u_role'] = changeType2Word($row['u_type'], $row['shop_id']);

    $user_info = array(
        'u_id' => $row['u_id'],
        'u_name' => $row['u_name'],
        'u_role' => $row['u_role'],
        'shop_id' => $row['shop_id'],
        'u_tel' => $row['ui_phone'],
    );
    $user_info_array[] = $user_info;
  
}

$_HTML .= $template->render(array(
  'user_info_array' => $user_info_array

));

require_once('includes/custom/php/footer.php');

function changeType2Word($u_type, $shop_id){
    if($u_type == 3 && $shop_id == -1){
        return "總店老闆";
    }
    elseif($u_type == 2 && $shop_id == -1){
        return "總店員工";
    }
    elseif($u_type == 3 && $shop_id != -1){
        return "加盟店老闆";
    }
    elseif($u_type == 2 && $shop_id != -1){
        return "加盟店員工";
    }
    elseif($u_type == 1 && $shop_id != -1){
        return "消費者";
    }

}


?>
