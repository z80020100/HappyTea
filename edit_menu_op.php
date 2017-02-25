<?php

require_once ("includes/custom/php/general.php");
//checkPermission(basename(__FILE__));
$action = $_REQUEST["action"]; // 接收傳遞過來的動作

if($action == "add_series")
{
	$new_series = $_REQUEST["new_series"];
	//$order_number = $_REQUEST["order_number"];

	$write_sql = "INSERT INTO `series` (`s_id`, `order_num`, `name`, `shop_id`) VALUES (NULL, '2147683647', '$new_series', 1)";
	$result = $db->query($write_sql);
	
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "edit_series")
{
	$series_text = $_REQUEST["series_text"];
	$s_id = $_REQUEST["s_id"];
	
	$write_sql = "UPDATE `series` SET `name` = '$series_text' WHERE `series`.`s_id` = $s_id";
	$result = $db->query($write_sql);
	
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "get_series")
{	
	$series_array = array();
	$read_sql = "SELECT * FROM `series` ORDER BY `order_num` ASC";
	$result = $db->query($read_sql);
	while($data = $db->fetch_array($result)){
		array_push( $series_array, $data );
	}
		
	echo json_encode($series_array, JSON_UNESCAPED_UNICODE);
}

else if($action == "get_add_type")
{	
	$add_type_array = array();
	$read_sql = "SELECT * FROM `additional_type`";
	$result = $db->query($read_sql);
	while($data = $db->fetch_array($result)){
		array_push( $add_type_array, $data );
	}
		
	echo json_encode($add_type_array, JSON_UNESCAPED_UNICODE);
}

else if($action == "get_add_data")
{	
	$at_id = $_REQUEST["at_id"];
	$add_data_array = array();
	$read_sql = "SELECT * FROM `additional_item` WHERE `at_id` = $at_id";
	$result = $db->query($read_sql);
	while($data = $db->fetch_array($result)){
		array_push( $add_data_array, $data );
	}
		
	echo json_encode($add_data_array, JSON_UNESCAPED_UNICODE);
}

else if($action == "edit_ai")
{	
	$ai_id = $_REQUEST["ai_id"];
	$new_ai_data = $_REQUEST["new_ai_data"];
	$edit_data = $_REQUEST["edit_data"];
	$write_sql = "UPDATE `additional_item` SET `$edit_data` = '$new_ai_data' WHERE `additional_item`.`ai_id` = $ai_id";
	$result = $db->query($write_sql);

	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "add_item")
{	

	$single_at_id = $_REQUEST["single_at_id"];
	$mul_at_id = $_REQUEST["mul_at_id"]; 
	$new_main_series = $_REQUEST["new_main_series"];
	$new_main_name = $_REQUEST["new_main_name"];
	$new_main_price = $_REQUEST["new_main_price"];
		
	if($single_at_id[0] == "0"){
		$has_ro = 0; // 是否有requied_option
	}
		
	else{
		$has_ro = 1;
	}
	
	$write_sql = "INSERT INTO `main` (`m_id`, `name`, `price`, `s_id`, `at_id`, `required_option`, `order_num`) VALUES (
		NULL, '$new_main_name', '$new_main_price', '$new_main_series', '$mul_at_id', '$has_ro', '2147683647'
	)";
	$result = $db->query($write_sql);
	$new_m_id = $db->mysqli->insert_id;
	if($has_ro == 1){
		for($i = 0; $i < count($single_at_id); $i++){
			$at_id = $single_at_id[$i];
			$write_ro_sql = "INSERT INTO `required_option` (`ro_id`, `name`, `m_id`, `at_id`) VALUES (NULL, '', '$new_m_id', '$at_id')";
			$ro_result = $db->query($write_ro_sql);
		}
	}
	
	echo json_encode("", JSON_UNESCAPED_UNICODE);
}

else if($action == "add_additional_type"){
	$option_name = $_REQUEST["option_name"];
	$multiple_choice = $_REQUEST["multiple_choice"];
	
	$write_sql = "INSERT INTO `additional_type` (`at_id`, `option_name`, `multiple_choice`) VALUES (NULL, '$option_name ', '$multiple_choice')";
	$result = $db->query($write_sql);
	
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "add_additional_item"){
	$at_id = $_REQUEST["at_id"];
	$name = $_REQUEST["name"];
	$price = $_REQUEST["price"];
	
	$write_sql = "INSERT INTO `additional_item` (`ai_id`, `at_id`, `name`, `price`) VALUES (NULL, '$at_id', '$name', '$price');";
	$result = $db->query($write_sql);
	
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "del_additional_item"){
	$ai_id = $_REQUEST["ai_id"];
	
	$write_sql = "DELETE FROM `additional_item` WHERE `additional_item`.`ai_id` = $ai_id";
	$result = $db->query($write_sql);
	
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "del_additional_type"){
	$at_id = $_REQUEST["at_id"];
	
	$write_sql = "DELETE FROM `additional_type` WHERE `additional_type`.`at_id` = $at_id";
	$result = $db->query($write_sql); // 刪除細項種類
	
	$write_sql = "DELETE FROM `additional_item` WHERE `additional_item`.`at_id` = $at_id";
	$result = $db->query($write_sql); // 刪除該細項種類中所有細項
	
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "edit_at_name"){
	$at_id = $_REQUEST["at_id"];
	$new_at_name = $_REQUEST["new_at_name"];
	
	$write_sql = "UPDATE `additional_type` SET `option_name` = '$new_at_name' WHERE `additional_type`.`at_id` = $at_id";
	$result = $db->query($write_sql);

	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "get_ro_for_main"){
	$m_id = $_REQUEST["m_id"];
	$ro_data_array = array();
	
	$read_sql = "SELECT * FROM `required_option` WHERE `m_id` = $m_id";
	$result = $db->query($read_sql);
	while($data = $db->fetch_array($result)){
		array_push($ro_data_array, $data);
	}
	
	echo json_encode($ro_data_array, JSON_UNESCAPED_UNICODE);
}

else if($action == "del_item"){
	$m_id = $_REQUEST["m_id"];
	
	$write_sql = "DELETE FROM `main` WHERE `main`.`m_id` = $m_id";
	$result = $db->query($write_sql);
	
	$write_sql = "DELETE FROM `required_option` WHERE `required_option`.`m_id` = $m_id";
	$result = $db->query($write_sql);

	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "edit_item")
{	
	$m_id = $_REQUEST["m_id"];
	$single_at_id = $_REQUEST["single_at_id"];
	$mul_at_id = $_REQUEST["mul_at_id"]; 
	$new_main_series = $_REQUEST["new_main_series"];
	$new_main_name = $_REQUEST["new_main_name"];
	$new_main_price = $_REQUEST["new_main_price"];
	
	$write_sql = "DELETE FROM `required_option` WHERE `required_option`.`m_id` = $m_id";
	$result = $db->query($write_sql);
		
	if($single_at_id[0] == "0"){
		$has_ro = 0; // 是否有requied_option
	}
		
	else{
		$has_ro = 1;
	}
	
	$write_sql = "UPDATE `main` SET `name` = '$new_main_name', `price` = '$new_main_price', `s_id` = '$new_main_series', `at_id` = '$mul_at_id', `required_option` = '$has_ro' WHERE `main`.`m_id` = $m_id;";
	$result = $db->query($write_sql);
	$new_m_id = $m_id;
	if($has_ro == 1){
		for($i = 0; $i < count($single_at_id); $i++){
			$at_id = $single_at_id[$i];
			$write_ro_sql = "INSERT INTO `required_option` (`ro_id`, `name`, `m_id`, `at_id`) VALUES (NULL, '', '$new_m_id', '$at_id')";
			$ro_result = $db->query($write_ro_sql);
		}
	}
	
	echo json_encode("", JSON_UNESCAPED_UNICODE);
}

else if($action == "del_series"){
	$s_id = $_REQUEST["s_id"];
	$main_data_array = array();
	
	$read_sql = "SELECT * FROM `main` WHERE `s_id` = $s_id";
	$result = $db->query($read_sql);
	while($data = $db->fetch_array($result)){
		array_push($main_data_array, $data);
	}
	
	
	for($i = 0; $i < count($main_data_array); $i++){
		$m_id = $main_data_array[$i]['m_id'];
		$write_sql = "DELETE FROM `main` WHERE `main`.`m_id` = $m_id";
		$result = $db->query($write_sql);
	
		$write_sql = "DELETE FROM `required_option` WHERE `required_option`.`m_id` = $m_id";
		$result = $db->query($write_sql);
	}
	
	$write_sql = "DELETE FROM `series` WHERE `series`.`s_id` = $s_id";
	$result = $db->query($write_sql);

	echo json_encode(count($main_data_array), JSON_UNESCAPED_UNICODE);
}

else if($action == "main_sort"){
	$m_id = $_REQUEST["m_id"];
	$order = $_REQUEST["order"];
	
	$write_sql = "UPDATE `main` SET `order_num` = '$order' WHERE `main`.`m_id` = $m_id";
	$result = $db->query($write_sql);

	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "series_sort"){
	$s_id = $_REQUEST["s_id"];
	$order = $_REQUEST["order"];
	
	$write_sql = "UPDATE `series` SET `order_num` = '$order' WHERE `series`.`s_id` = $s_id";
	$result = $db->query($write_sql);

	echo json_encode($result, JSON_UNESCAPED_UNICODE);
}

else if($action == "road_main_by_s_id"){
    $series_s_id = $_REQUEST["series_s_id"];
    $main_data_array = array();
    $read_sql = "SELECT * FROM `main` WHERE `s_id` = $series_s_id";
    $result = $db->query($read_sql);
    while($data = $db->fetch_array($result)){
        array_push($main_data_array, $data);
	}
    echo json_encode($main_data_array, JSON_UNESCAPED_UNICODE);
}

?>