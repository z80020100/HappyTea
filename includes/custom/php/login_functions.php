<?php

function userLogout($clear_GOT_shop_id){
    unset($_SESSION['u_id']);
    unset($_SESSION['u_name']);
    unset($_SESSION['u_type']);
    unset($_SESSION['shop_id']);
    $_SESSION['u_auth'] = AUGUEST;
    unset($_SESSION['shop_name']);
    if($clear_GOT_shop_id == true){
        unset($_SESSION['GOT_shop_id']);
        console(LEVEL_DBG, "登出：完全登出", __FUNCTION__, __LINE__);
    }
    else{
        console(LEVEL_DBG, "登出：保留GOT_shop_id", __FUNCTION__, __LINE__);
    }
}

function userLogin($username, $password, $customer_login){
	global $db;
    $sql = "SELECT * FROM `user` WHERE `u_name` = '".$username."'";
    $query_user_result = $db->query_select_one($sql);
	if($query_user_result){
        console(LEVEL_DBG, "帳號存在", __FUNCTION__, __LINE__);
        if($query_user_result['u_pass'] == hash("sha256", $password)){
            console(LEVEL_DBG, "密碼正確", __FUNCTION__, __LINE__);
            $_SESSION['u_id'] = $query_user_result['u_id'];
            $_SESSION['u_name'] = $query_user_result['u_name'];
            $_SESSION['u_type'] = $query_user_result['u_type'];
            $_SESSION['shop_id'] = $query_user_result['shop_id'];
            $_SESSION['u_auth'] = 1 << $query_user_result['u_type'];
            if(checkAuth(AUSTAFF | AUADMIN)){
                console(LEVEL_DBG, "帳號身分：POS使用者", __FUNCTION__, __LINE__);
                if($customer_login == false){
                    $_SESSION['GOT_shop_id'] = $_SESSION['shop_id'];
                    $_SESSION['shop_name'] = getShopName($_SESSION['GOT_shop_id']);
                    if($_SESSION['shop_name'] != false){
                        console(LEVEL_DBG, "分店名稱：".$_SESSION['shop_name'], __FUNCTION__, __LINE__);
                        console(LEVEL_DBG, "登入成功：POS使用者", __FUNCTION__, __LINE__);
                        return true;
                    }
                    else{
                        userLogout(true);
                        return false;
                    }
                }
                else{
                    console(LEVEL_ERR, "登入失敗：遠端消費者頁面無法登入POS使用者帳號", __FUNCTION__, __LINE__);
                    userLogout(false);
                    return false;
                }
            }
            else{
                console(LEVEL_DBG, "帳號身分：遠端消費者", __FUNCTION__, __LINE__);
                if($customer_login == false){
                    console(LEVEL_ERR, "登入失敗：POS使用者頁面無法登入遠端消費者帳號", __FUNCTION__, __LINE__);
                    userLogout(true);
                    return false;
                }
                else{
                    $_SESSION['shop_name'] = getShopName($_SESSION['GOT_shop_id']);
                    if($_SESSION['shop_name'] != false){
                        console(LEVEL_DBG, "消費店家：".$_SESSION['shop_name'], __FUNCTION__, __LINE__);
                        console(LEVEL_DBG, "登入成功：遠端消費者", __FUNCTION__, __LINE__);
                        return true;
                    }
                    else{
                        userLogout(true);
                        return false;
                    }
                }
            }
        }
        else{
            console(LEVEL_ERR, "密碼錯誤！", __FUNCTION__, __LINE__);
        }
    }
    else{
        console(LEVEL_ERR, "帳號不存在！", __FUNCTION__, __LINE__);
        userLogout(false);
        return false;
    }
}

?>
