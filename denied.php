<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = '禁止存取';
$header_type = NAV_TYPE_NONE;
$nav_type = NAV_TYPE_NONE;
$footer_type = NAV_TYPE_NONE;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');
require_once('includes/custom/php/login_functions.php');

console(LEVEL_ERR, "禁止存取", __FUNCTION__, __LINE__);

switch($_SESSION['u_auth']){
    case AUGUEST:
        console(LEVEL_TODO, "自動轉跳：遊客", __FUNCTION__, __LINE__);
        break;
    case AUCUSTOMER:
        console(LEVEL_TODO, "自動轉跳：遠端消費者", __FUNCTION__, __LINE__);
        break;
    case AUSTAFF:
        if($_SESSION['shop_id'] == -1){
            console(LEVEL_DBG, "自動轉跳：總店員工", __FUNCTION__, __LINE__);
            header("refresh:0;url=dashboard.php");
        }
        else{
            console(LEVEL_DBG, "自動轉跳：分店員工", __FUNCTION__, __LINE__);
            header("refresh:0;url=index.php");
        }
        break;
    case AUADMIN:
        if($_SESSION['shop_id'] == -1){
            console(LEVEL_DBG, "自動轉跳：總店店長", __FUNCTION__, __LINE__);
            header("refresh:0;url=dashboard.php");
        }
        else{
            console(LEVEL_ERR, "登入成功：分店店長", __FUNCTION__, __LINE__);
            header("refresh:0;url=dashboard.php");
        }
        break;
}

$template = $twig->loadTemplate('empty.html');

$_HTML .= $template->render(array(

));

require_once('includes/custom/php/footer.php');

?>
