<?php

require_once('includes/custom/php/general.php');

$req = $_REQUEST['request'];


//global $db, $shift_start, $shift_end;
$sql;
if(isset($req)){
    $start = $req['start'];
    $end = $req['end'];
    $sql = "SELECT * FROM `log` WHERE `time` >= '".$start."' AND `time` <= '".$end."' AND HOUR(`time`) >= '".$shift_start."' AND HOUR(`time`) < '".($shift_end+1)."'";
    $ret = array();
    foreach ($db->query($sql) as $row) {
        $ret[] = $row;
    }

    echo json_encode($ret, JSON_UNESCAPED_UNICODE);

}else{

    $report_today =  date("Y-m-d");
    $report_tomorrow = date("Y-m-d", strtotime('tomorrow'));
    $sql = "SELECT * FROM log WHERE `time` >= '".$report_today."' AND `time` < '".$report_tomorrow."'";
    $ret = array();
    foreach ($db->query($sql) as $row) {
        $ret[] = $row;
    }


    echo json_encode($ret, JSON_UNESCAPED_UNICODE);
}


//
// get today's report



?>



