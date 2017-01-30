<?php

function setShopID() {
	if ( isset($_GET['shop_id']) && strlen($_GET['shop_id']) != 0 ) {
		if (!preg_match("/(^-1$)|(^0$)|(^[1-9][0-9]*$)/", $_GET['shop_id'])) {
			$_SESSION['error_message'] = "Unvalid shop_id.";
			return false;
		}

		if (isset($_SESSION['GET_shop_id']) && $_SESSION['GET_shop_id'] == $_GET['shop_id']) {
			return true;
		} else {
			global $db;
			$sql = "SELECT * FROM `shop` WHERE `shop_id` = " . $_GET['shop_id'];
			$Quser = $db->query_select_one($sql);

			if ($Quser) {
				$_SESSION['GET_shop_id'] = $_GET['shop_id'];
				$_SESSION['shop_name'] = $Quser['shop_name'];
				return true;
			} else {
				$_SESSION['error_message'] = "No such shop_id.";
				return false;
			}
		}
	}
	else {
		if (isset($_SESSION['GET_shop_id']))
			return true;
		else {
			$_SESSION['error_message'] = "Not provide shop_id.";
			return false;
		}
	}
}

function user_login($username, $password, $phone_info, $customer_login){
	global $db;

	$sql = "SELECT * FROM `user` WHERE `u_name` = '".$username."' ";
	$Quser = $db->query_select_one($sql);

	if( $Quser ){
		$sql = "SELECT * FROM `user_info` WHERE `u_id` = ".$Quser['u_id'].";";
		$Quser_info = $db->query_select_one($sql);

		if($Quser_info['ui_advsecurity'] == 1){
			// if user enabled advanced security --> check password hash
			if($Quser['u_pass'] == hash("sha256", $password) ){

				$_SESSION['u_name'] = $Quser['u_name'];
				$_SESSION['u_id'] = $Quser['u_id'];
				$_SESSION['admin'] = ($Quser['u_type'] == IDADMIN);
				$_SESSION['staff'] = ($Quser['u_type'] == IDSTAFF);
				$_SESSION['u_type'] = $Quser['u_type'];
				$_SESSION['u_auth'] = 1 << $Quser['u_type'];
				$_SESSION['shop_id'] = $Quser['shop_id'];
				$_SESSION['ui_phone'] = $Quser_info['ui_phone'];

				if ($_SESSION['admin'] || $_SESSION['staff'])
					return !$customer_login;
				else
					return $customer_login;
			}
			else{
				return false;
			}
		}
		else{
			// if user disabled advanced security --> check info match --> using phone
			if($Quser_info['ui_phone'] == $phone_info){

				$_SESSION['u_name'] = $Quser['u_name'];
				$_SESSION['u_id'] = $Quser['u_id'];
				$_SESSION['admin'] = ($Quser['u_type'] == IDADMIN);
				$_SESSION['staff'] = ($Quser['u_type'] == IDSTAFF);
				$_SESSION['u_type'] = $Quser['u_type'];
				$_SESSION['u_auth'] = 1 << $Quser['u_type'];
				$_SESSION['shop_id'] = $Quser['shop_id'];
				$_SESSION['ui_phone'] = $Quser_info['ui_phone'];

				if ($_SESSION['admin'] || $_SESSION['staff'])
					return !$customer_login;
				else
					return $customer_login;
			}
			else{
				return false;
			}
		}
	}
	else
		return false;
}

?>
