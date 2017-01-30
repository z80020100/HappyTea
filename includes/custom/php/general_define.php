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

$uniform_theme = false; // If enable this function, header_type, nav_type, footer_type will be ignored
$uniform_type = UNIFORM_TYPE_NONE; // It will be ignored if $uniform_theme is false

define("IDGUEST", 0);
define("IDCUSTOMER", 1);
define("IDSTAFF", 2);
define("IDADMIN", 3);

define("AUGUEST", (1 << IDGUEST) );
define("AUCUSTOMER", (1 << IDCUSTOMER) );
define("AUSTAFF", (1 << IDSTAFF));
define("AUADMIN", (1 << IDADMIN));

$_Identity = array();
$_Identity[IDGUEST] = array('id' => IDGUEST, 'desc' => '訪客/未啟用顧客', 'name' => 'guest');
$_Identity[IDCUSTOMER] = array('id' => IDCUSTOMER,'desc' => '顧客', 'name' => 'customer');
$_Identity[IDSTAFF] = array('id' => IDSTAFF,'desc' => '職員', 'name' => 'staff');
$_Identity[IDADMIN] = array('id' => IDADMIN,'desc' => '老闆', 'name' => 'admin');

?>
