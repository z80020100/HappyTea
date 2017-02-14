<?php

define("ALL_PEOPLE", AUADMIN|AUSTAFF|AUCUSTOMER|AUGUEST);
define("ALL_STAFF",  AUADMIN|AUSTAFF);

$PERMISSION_TABLE = array();

$PERMISSION_TABLE['dashboard.php']   = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // will be set on while loop in the end
    'desc' => '系統總覽',
    'visible' => true,
    'permission' => ALL_STAFF
);

$PERMISSION_TABLE['staff_login.php']   = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // will be set on while loop in the end
    'desc' => '員工登入',
    'visible' => true,
    'permission' => ALL_PEOPLE
);

$PERMISSION_TABLE['account_edit.php']   = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // will be set on while loop in the end
    'desc' => '帳號編輯',
    'visible' => true,
    'permission' => AUADMIN
);

// set the file_name element
while(current($PERMISSION_TABLE)){
    $file_name = key($PERMISSION_TABLE);
    $PERMISSION_TABLE[$file_name]['file_name'] = $file_name;
    next($PERMISSION_TABLE);
}
?>