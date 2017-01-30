<?php

require_once ("includes/custom/php/general_define.php");

$_PAGE_TITLE = '員工登入 - 樂台茶餐飲管理系統';
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_NONE;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$template = $twig->loadTemplate('staff_login.html');

$message = "";

if(isset($_SESSION['u_name'])){
	session_destroy();
	$message = "已自動登出，請重新登入";
	header("refresh:1;url=staff_login.php?shop_id=" . $_shopID);
}

if(isset($_POST['submit'])){
    echo "DBG: press login button<br>";
    if(!isset($_POST['password']))
        $_POST['password'] = '';

    if(!isset($_POST['phone']))
        $_POST['phone'] = '';

    if(user_login($_POST['username'] , $_POST['password'], $_POST['phone'], false)){
        if($_SESSION['shop_id'] == -1 ){
            echo "TODO: 轉跳不同頁面 for 總店老闆 & 總店員工<br>";
            $message = "成功登入總店，總店控制台讀取中...";
            header("refresh:2;url=dashboard.php?shop_id=" . $_SESSION['shop_id']);
        }
        else if($_SESSION['admin'] == 1){
            $message = "登入成功，控制台讀取中...";
            echo "TODO: 自動轉跳 for 分店老闆<br>";
            header("refresh:2;url=dashboard.php?shop_id=" . $_SESSION['shop_id']);
        }
        else if ($_SESSION['staff'] == 1) {
            $message = "登入成功，POS系統讀取中...";
            header("refresh:2;url=index.php?shop_id=" . $_SESSION['shop_id']);
        }
    }
    else{
        $message = "登入失敗";
    }
}
else{
    echo "DBG: first time to this page<br>";
}

$_HTML .= $template->render(array(
  'LOGIN_MESSAGE' => $message,
));

require_once('includes/custom/php/footer.php');

?>
