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

?>
