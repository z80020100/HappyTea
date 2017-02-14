<?php

$staff_login = true;
require_once ("includes/custom/php/general.php");
checkPermission(basename(__FILE__));
$_PAGE_TITLE = '員工登入 - 樂台茶餐飲管理系統';
$header_type = HEADER_TYPE_SBADMIN2;
//$nav_type = NAV_TYPE_NONE;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/login_functions.php');
//require_once('includes/custom/php/navigation.php');

$template = $twig->loadTemplate('staff_login.html');

$message = "";

if(isset($_SESSION['u_type']) && ($_SESSION['u_type'] != IDGUEST)){
    console(LEVEL_TODO, "已登入，自動轉跳", __FUNCTION__, __LINE__);
}

if(isset($_POST['submit'])){
    console(LEVEL_DBG, "press login button", __FUNCTION__, __LINE__);
    if(!isset($_POST['password']))
        $_POST['password'] = '';

    if(userLogin($_POST['username'], $_POST['password'], false)){
        //console(LEVEL_DBG, "登入成功", __FUNCTION__, __LINE__);
        switch($_SESSION['u_auth']){
            case AUGUEST:
                console(LEVEL_ERR, "登入異常：遊客", __FUNCTION__, __LINE__);
                break;
            case AUCUSTOMER:
                console(LEVEL_ERR, "登入異常：遠端消費者", __FUNCTION__, __LINE__);
                break;
            case AUSTAFF:
                if($_SESSION['shop_id'] == -1){
                    console(LEVEL_ERR, "登入成功：總店員工", __FUNCTION__, __LINE__);
                    header("refresh:0;url=dashboard.php");
                }
                else{
                    console(LEVEL_DBG, "登入成功：分店員工", __FUNCTION__, __LINE__);
                    header("refresh:0;url=index.php");
                }
                break;
            case AUADMIN:
                if($_SESSION['shop_id'] == -1){
                    console(LEVEL_DBG, "登入成功：總店店長", __FUNCTION__, __LINE__);
                    header("refresh:0;url=dashboard.php");
                }
                else{
                    console(LEVEL_DBG, "登入成功：分店店長", __FUNCTION__, __LINE__);
                    header("refresh:0;url=dashboard.php");
                }
                break;
        }
    }
    else{
        $message = "登入失敗！";
        console(LEVEL_ERR, "登入失敗！", __FUNCTION__, __LINE__);
    }
}
else{
    console(LEVEL_DBG, "first time to this page", __FUNCTION__, __LINE__);
}

$_HTML .= $template->render(array(
  'LOGIN_MESSAGE' => $message,
));

require_once('includes/custom/php/footer.php');

?>
