<?php

require_once("permission_define.php");

$permission_list = (1 << 2); // only for testing, should be query from DB

console(LEVEL_DBG, "\$permission_list = $permission_list", __FUNCTION__, __LINE__);
/* set the file_name element and staff permission */
while(current($PERMISSION_TABLE)){
    $file_name = key($PERMISSION_TABLE);
    $PERMISSION_TABLE[$file_name]['file_name'] = $file_name;
    if((1 << $PERMISSION_TABLE[$file_name]['bits']) & $permission_list){
        console(LEVEL_DBG, "Staff can access $file_name", __FUNCTION__, __LINE__);
        $PERMISSION_TABLE[$file_name]['permission'] |= AUSTAFF;
    }
    next($PERMISSION_TABLE);
}
/*****************************/

function checkPermission($file_name){
    global $PERMISSION_TABLE;
    console(LEVEL_DBG, $file_name, __FUNCTION__, __LINE__);
    if(!isset($PERMISSION_TABLE[$file_name])){
        console(LEVEL_ERR, "此頁面未設定權限！", __FUNCTION__, __LINE__);
    }
    else{
        console(LEVEL_DBG, "Bits = ".$PERMISSION_TABLE[$file_name]['bits'], __FUNCTION__, __LINE__);
        console(LEVEL_DBG, "File Name = ".$PERMISSION_TABLE[$file_name]['file_name'], __FUNCTION__, __LINE__);
        console(LEVEL_DBG, "Description = ".$PERMISSION_TABLE[$file_name]['desc'], __FUNCTION__, __LINE__);
        console(LEVEL_DBG, "Visible = ".$PERMISSION_TABLE[$file_name]['visible'], __FUNCTION__, __LINE__);
        console(LEVEL_DBG, "Permission = ".$PERMISSION_TABLE[$file_name]['permission'], __FUNCTION__, __LINE__);
        
        if(checkAuth($PERMISSION_TABLE[$file_name]['permission'])){
            console(LEVEL_DBG, "允許存取", __FUNCTION__, __LINE__);
        }
        else{
            console(LEVEL_DBG, "禁止存取", __FUNCTION__, __LINE__);
            header("refresh:0;url=denied.php");
            exit;
        }     
    }
}
?>