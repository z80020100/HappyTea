<?php

require_once("permission_define.php");

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