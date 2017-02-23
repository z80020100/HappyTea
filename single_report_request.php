<?php

require_once('includes/custom/php/general.php');

$req = $_REQUEST['request'];

$report_today =  date("Y-m-d");
$report_tomorrow = date("Y-m-d", strtotime('tomorrow'));


if($_SHOP_ID == -1){

    if(isset($req['is_search'])){

        $sql = "SELECT * FROM shop WHERE shop_name = '".$req['shop']."'";
        $select_shop_id = $db->query_select_one($sql);
        $sql = "SELECT * FROM log where `time` >= '".$req['start']."' AND `time` < '".$req['end']."' AND `shop_id` = '".$select_shop_id['shop_id']."'";
        
    }else{

        $sql = "SELECT * FROM shop WHERE shop_name = '".$req['shop']."'";
        $select_shop_id = $db->query_select_one($sql);
        $sql = "SELECT * FROM log where `time` >= '".$report_today."' AND `time` < '".$report_tomorrow."' AND `shop_id` = '".$select_shop_id['shop_id']."'";

    }


}else{


}

$ret = array();
foreach ($db->query($sql) as $row) {
    $ret[] = $row;
}
echo json_encode($ret, JSON_UNESCAPED_UNICODE);

?>



