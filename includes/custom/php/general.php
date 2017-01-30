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

if(!isset($_SESSION['u_auth']))
	$_SESSION['u_auth'] = AUGUEST;

$db = new Db(DB_ADDRESS, DB_USER, DB_PASSWORD, DB_DATABASE);

if (1) {
	$_shopID = $_SESSION['GET_shop_id'];
} else {
	die($_SESSION['error_message']);
}

$uniform_theme = false; // If enable this function, header_type, nav_type, footer_type will be ignored
$uniform_type = UNIFORM_TYPE_NONE; // It will be ignored if $uniform_theme is false

// 未來要獨立成為設定檔的部分 -----------------------
// 可能會變成資料庫存取

// 開放訂餐的時間 從 4點 ~ 14點  (13-14是一個時段)
$shift_start = 0;
$shift_end = 24;

//$_AWMode = "BUSINESS"; // ACCOUNTING, BUSINESS

$_DontSendSMS = true;
// 未來要獨立成為設定檔的部分 -----------------------

?>
