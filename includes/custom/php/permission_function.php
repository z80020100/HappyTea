<?php

require_once("permission_define.php");

$permission_list = 0b11111111111111111111111111111111; // only for testing, should be query from DB

console(LEVEL_DBG, "\$permission_list = $permission_list", __FUNCTION__, __LINE__);
/* set the file_name element and staff permission */
while(current($PERMISSION_TABLE)){
    $file_name = key($PERMISSION_TABLE);
    $PERMISSION_TABLE[$file_name]['file_name'] = $file_name;
    if($PERMISSION_TABLE[$file_name]['link'] == ''){
        if((1 << $PERMISSION_TABLE[$file_name]['bits']) & $permission_list){
            console(LEVEL_DBG, "Staff can access $file_name", __FUNCTION__, __LINE__);
            $PERMISSION_TABLE[$file_name]['permission'] |= AUSTAFF;
        }
    }
    else{
        console(LEVEL_DBG, "$file_name has the same permission as ".$PERMISSION_TABLE[$file_name]['link'], __FUNCTION__, __LINE__);
        if((1 << $PERMISSION_TABLE[$PERMISSION_TABLE[$file_name]['link']]['bits']) & $permission_list){
            $PERMISSION_TABLE[$file_name]['permission'] = $PERMISSION_TABLE[$PERMISSION_TABLE[$file_name]['link']]['permission'];
        }
    }
    next($PERMISSION_TABLE);
}
/*****************************/

function checkPermission($file_name){
    global $PERMISSION_TABLE;
    console(LEVEL_DBG, $file_name, __FUNCTION__, __LINE__);
    if(!isset($PERMISSION_TABLE[$file_name])){
        die('此頁面未設定權限！');
    }
    else if(!isset($PERMISSION_TABLE[$file_name]['bits'])){
        die("!isset(\$PERMISSION_TABLE[\$file_name]['bits'])");
    }
    else if(!isset($PERMISSION_TABLE[$file_name]['file_name'])){
        die("!isset(\$PERMISSION_TABLE[\$file_name]['file_name'])");
    }
    else if(!isset($PERMISSION_TABLE[$file_name]['desc'])){
        die("!isset(\$PERMISSION_TABLE[\$file_name]['desc'])");
    }
    else if(!isset($PERMISSION_TABLE[$file_name]['link'])){
        die("!isset(\$PERMISSION_TABLE[\$file_name]['link'])");
    }
    else if(!isset($PERMISSION_TABLE[$file_name]['permission'])){
        die("!isset(\$PERMISSION_TABLE[\$file_name]['permission'])");
    }
    else{
        console(LEVEL_DBG, "Bits = ".$PERMISSION_TABLE[$file_name]['bits'], __FUNCTION__, __LINE__);
        console(LEVEL_DBG, "File Name = ".$PERMISSION_TABLE[$file_name]['file_name'], __FUNCTION__, __LINE__);
        console(LEVEL_DBG, "Description = ".$PERMISSION_TABLE[$file_name]['desc'], __FUNCTION__, __LINE__);
        console(LEVEL_DBG, "Link = ".$PERMISSION_TABLE[$file_name]['link'], __FUNCTION__, __LINE__);
        console(LEVEL_DBG, "Permission = ".$PERMISSION_TABLE[$file_name]['permission'], __FUNCTION__, __LINE__);
        
        if(checkAuth($PERMISSION_TABLE[$file_name]['permission'])){
            console(LEVEL_DBG, "允許存取", __FUNCTION__, __LINE__);
            //echo '允許存取';
        }
        else if($PERMISSION_TABLE[$file_name]['link'] == ''){
            console(LEVEL_DBG, "禁止存取", __FUNCTION__, __LINE__);
            //echo '禁止存取';
            header("refresh:0;url=denied.php");
        }
        else{
            console(LEVEL_DBG, "禁止存取request page", __FUNCTION__, __LINE__);
            //echo '禁止存取request page';
            exit;
        }
    }
}
?>