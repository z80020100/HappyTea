<?php

/* include libraries **********************************************/

require_once ("dbclass.php");
require_once ("db_config.php");
require_once ("general_define.php");
require_once ("general_functions.php");

// Mustache template system
//require 'includes/Mustache/Autoloader.php';
//Mustache_Autoloader::register();

require_once dirname(__FILE__).'/../../vendor/Twig/lib/Twig/Autoloader.php';
Twig_Autoloader::register(true);
$loader = new Twig_Loader_Filesystem('./templates/');
$twig = new Twig_Environment($loader, array(
    //'cache' => '/templates/cache/',
));

/******************************************************************/

session_start();
header("Content-Type:text/html; charset=utf-8");

$db = new Db(DB_ADDRESS, DB_USER, DB_PASSWORD, DB_DATABASE);

if(!isset($_SESSION['u_auth']))
	$_SESSION['u_auth'] = AUGUEST;

if(!isset($staff_login)){
    $staff_login = false;
}

// 設定$_SESSION['GOT_shop_id']
if($staff_login == false){
    console(LEVEL_DBG, "嘗試透過method GET取得shop_id", __FUNCTION__, __LINE__);
    if(setSessionGotShopID()){
        console(LEVEL_DBG, "更新GOT_shop_id = ".$_SESSION['GOT_shop_id'], __FUNCTION__, __LINE__);
    }
    else if(isset($_SESSION['GOT_shop_id'])){
        console(LEVEL_DBG, "讀取已儲存的GOT_shop_id = ".$_SESSION['GOT_shop_id'], __FUNCTION__, __LINE__);
    }
    else{
        console(LEVEL_DBG, "shop_id未輸入或不合法！", __FUNCTION__, __LINE__);
        echo "TODO: 未取得shop_ip時跳轉至選擇頁面<br>";
    }
}
else{
    console(LEVEL_DBG, "員工登入頁面，不透過method GET取得shop_id", __FUNCTION__, __LINE__);
}

// 設定$_SHOP_ID
if(checkAuth(AUSTAFF | AUADMIN)){
    $_SHOP_ID = $_SESSION['shop_id'];
    console(LEVEL_DBG, "POS使用者身分設定\$_SHOP_ID", __FUNCTION__, __LINE__);
}
else if(checkAuth(AUCUSTOMER)){
    $_SHOP_ID = $_SESSION['GOT_shop_id'];
    console(LEVEL_DBG, "遠端消費者身分設定\$_SHOP_ID", __FUNCTION__, __LINE__);
}
else{
    console(LEVEL_DBG, "未登入，不設定\$_SHOP_ID", __FUNCTION__, __LINE__);
}

// User info
if(!isset($_SESSION['u_type'])){
    $_USER_IDENTITY = $_Identity[IDGUEST]['name'];
    $_USER_NAME = 'Not login';
    $_SHOP_NAME = 'Not login';
}
else{
    $_USER_IDENTITY = $_Identity[$_SESSION['u_type']]['name'];
    $_USER_NAME = $_SESSION['u_name'];
    $_SHOP_NAME = $_SESSION['shop_name'];
}

if(isset($_SESSION['shop_id']) && ($_SESSION['shop_id'] == -1)){
    $_TOP_SHOP = true;
}
else{
    $_TOP_SHOP = false;
}

// Theme
$uniform_theme = false; // If enable this function, header_type, nav_type, footer_type will be ignored
$uniform_type = UNIFORM_TYPE_NONE; // It will be ignored if $uniform_theme is false

// Menu Data
if(!isset($all_series)){
	$all_series = array();
}

/*
    Config
    未來要獨立成為設定檔的部分，可能會變成資料庫存取
 */

// 開放訂餐的時間 從 4點 ~ 14點  (13-14是一個時段)
$shift_start = 0;
$shift_end = 24;

// 是否開啟遠端消費者註冊簡訊驗證
$_DontSendSMS = true;

?>
