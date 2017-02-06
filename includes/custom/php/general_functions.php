<?php

/*
    Print log to JS console.
    Example, console(LEVEL_ERR, "TEST", __FUNCTION__, __LINE__);
 */
function console($level, $msg, $function, $line){
    if(strlen($function) == 0){
        $function = "root"; // root means not in function
    }

    if($level == LEVEL_ERR){
        echo "<script>console.log(\"ERR: $msg on function $function() line $line\")</script>";
    }
    else if($level == LEVEL_DBG){
        echo "<script>console.log(\"DBG: $msg on function $function() line $line\")</script>";
    }
    else if($level == LEVEL_INFO){
        echo "<script>console.log(\"INFO: $msg on function $function() line $line\")</script>";
    }
}

// Print all global variables name, $global_key = array_keys(get_defined_vars())
function printGlobalVariables($global_key){
    $golbal_key_num = count($global_key);
    //print_r($global_key);
    console(LEVEL_INFO, "全域變數數量：$golbal_key_num ", __FUNCTION__, __LINE__);
    for($i = 0; $i < $golbal_key_num; $i++){
        if($global_key[$i] != '_GET'     &&
           $global_key[$i] != '_POST'    &&
           $global_key[$i] != '_COOKIE'  &&
           $global_key[$i] != '_FILES'   &&
           $global_key[$i] != 'loader'   &&
           $global_key[$i] != 'twig'     &&
           $global_key[$i] != '_SESSION' &&
           $global_key[$i] != 'db'       &&
           $global_key[$i] != 'twig'     &&
           $global_key[$i] != 'template' &&
           $global_key[$i] != '_HTML'){
           console(LEVEL_INFO, "$i. \$$global_key[$i]", __FUNCTION__, __LINE__);
        }
    }
}

function checkAuth($page_auth) {
	return ($_SESSION['u_auth'] & $page_auth) != 0;
}

// verify shop_id from GET
function verifyGetShopId(){
    if(isset($_GET['shop_id']) && (strlen($_GET['shop_id']) != 0)){
        if(!preg_match("/(^-1$)|(^0$)|(^[1-9][0-9]*$)/", $_GET['shop_id'])){
            // GET取得的shop_id無效
            return false;
        }
        else{
            return true;
        }
    }
    else{
        return false;
    }
}

/*
    Get shop_id from address bar via method "GET" and set to $_SESSION['GOT_shop_id']
 */
function setSessionGotShopID(){
    if(verifyGetShopId()){
        $_SESSION['GOT_shop_id'] = $_GET['shop_id'];
        return true;
    }
    else{
        console(LEVEL_ERR, "shop_id is illegal", __FUNCTION__, __LINE__);
        return false;
    }
}

// If $_SESSION['GOT_shop_id'] equal to $_GET['shop_id']return true
function cmpShopId(){
    if(verifyGetShopId()){
        if($_SESSION['GOT_shop_id'] == $_GET['shop_id']){
            return true;
        }
        else{
            false;
        }
    }
    else{
        false;
    }
}

function getShopName($shop_id){
    global $db;
    $sql = "SELECT * FROM `shop` WHERE `shop_id` = " . $shop_id;
    if($query_shop_result = $db->query_select_one($sql)){
        return $query_shop_result['shop_name'];
    }
    else{
        console(LEVEL_ERR, "取得分店名稱失敗", __FUNCTION__, __LINE__);
        return false;
    }
}

?>
