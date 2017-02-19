<?php

define("ALL_PEOPLE", AUADMIN|AUSTAFF|AUCUSTOMER|AUGUEST);
define("ALL_STAFF",  AUADMIN|AUSTAFF);

$PERMISSION_TABLE = array();
/*******************************************************************************/
$PERMISSION_TABLE['account_edit.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => '帳號編輯',
    'link' => '', // if this page is for request, enter the related php which has the same permission
    'permission' => AUADMIN // if "links" is not null string, this value will be ignored
);
$PERMISSION_TABLE['edit_account_request.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => 'Request page for 帳號編輯',
    'link' => 'account_edit.php', // if this page is for request, enter the related php which has the same permission
    'permission' => '' // if "links" is not null string, this value will be ignored
);
/*******************************************************************************/
$PERMISSION_TABLE['account_management.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => '帳號新增',
    'link' => '', // if this page is for request, enter the related php which has the same permission
    'permission' => AUADMIN // if "links" is not null string, this value will be ignored
);
/*******************************************************************************/
$PERMISSION_TABLE['call_stuff.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => '上游叫料',
    'link' => '', // if this page is for request, enter the related php which has the same permission
    'permission' => AUADMIN // if "links" is not null string, this value will be ignored
);
$PERMISSION_TABLE['call_stuff_process.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => 'Request page for 上游叫料',
    'link' => 'call_stuff.php', // if this page is for request, enter the related php which has the same permission
    'permission' => '' // if "links" is not null string, this value will be ignored
);
/*******************************************************************************/
$PERMISSION_TABLE['called_stuff.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => '叫料通知',
    'link' => '', // if this page is for request, enter the related php which has the same permission
    'permission' => AUADMIN // if "links" is not null string, this value will be ignored
);
$PERMISSION_TABLE['called_stuff_process.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => 'Request page for 叫料通知',
    'link' => 'called_stuff.php', // if this page is for request, enter the related php which has the same permission
    'permission' => '' // if "links" is not null string, this value will be ignored
);
/*******************************************************************************/
$PERMISSION_TABLE['dashboard.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => '系統總覽',
    'link' => '', // if this page is for request, enter the related php which has the same permission
    'permission' => AUADMIN // if "links" is not null string, this value will be ignored
);
$PERMISSION_TABLE['dashboard_request.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => 'Request page for 系統總覽',
    'link' => 'dashboard.php', // if this page is for request, enter the related php which has the same permission
    'permission' => '' // if "links" is not null string, this value will be ignored
);
/*******************************************************************************/
$PERMISSION_TABLE['edit_menu.php'] = array(
    'bits' => count($PERMISSION_TABLE),
    'file_name' => '', // it will be set on while loop in permission_function.php
    'desc' => '編輯菜單',
    'link' => '', // if this page is for request, enter the related php which has the same permission
    'permission' => AUADMIN // if "links" is not null string, this value will be ignored
);
?>