<?php

define("HEADER_TYPE_NONE", 0);
define("HEADER_TYPE_CUSTOM", 1);
define("HEADER_TYPE_SBADMIN2", 2);

define("NAV_TYPE_NONE", 0);
define("NAV_TYPE_CUSTOM", 1);
define("NAV_TYPE_SBADMIN2", 2);

define("FOOTER_TYPE_NONE", 0);
define("FOOTER_TYPE_CUSTOM", 1);
define("FOOTER_TYPE_SBADMIN2", 2);

define("UNIFORM_TYPE_NONE", 0);
define("UNIFORM_TYPE_CUSTOM", 1);
define("UNIFORM_TYPE_SBADMIN2", 2);

define("IDGUEST", 0);
define("IDCUSTOMER", 1);
define("IDSTAFF", 2);
define("IDADMIN", 3);

define("AUGUEST", (1 << IDGUEST) );
define("AUCUSTOMER", (1 << IDCUSTOMER) );
define("AUSTAFF", (1 << IDSTAFF));
define("AUADMIN", (1 << IDADMIN));

define("LEVEL_ERR", 0);
define("LEVEL_DBG", 1);
define("LEVEL_INFO", 2);
define("LEVEL_TODO", 3);

$_Identity = array();
$_Identity[IDGUEST] = array('id' => IDGUEST, 'desc' => '訪客/未啟用顧客', 'name' => 'guest');
$_Identity[IDCUSTOMER] = array('id' => IDCUSTOMER,'desc' => '顧客', 'name' => 'customer');
$_Identity[IDSTAFF] = array('id' => IDSTAFF,'desc' => '職員', 'name' => 'staff');
$_Identity[IDADMIN] = array('id' => IDADMIN,'desc' => '老闆', 'name' => 'admin');

/*
CANCEL 		: 	已取消
WAIT		:	等待製作中
MAKING		:	製作中
DONE		:	餐點完成
PAID		:	已付錢
ARCHIVE	:	已封存
*/

/*
	functions to control order status
*/

$GLOBALS['STATUS'] = array(
	'CANCEL',  // cannot be deleted
	'WAIT',		// Default
	'MAKING',
	'DONE',
//	'PAID',
	'ARCHIVE'  // cannot be deleted
);

?>
