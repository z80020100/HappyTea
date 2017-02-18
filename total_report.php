<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = 'Sample'; // 請輸入頁面抬頭
$header_type = HEADER_TYPE_SBADMIN2; // 請參考includes/custom/php/general_define.php
$nav_type = NAV_TYPE_SBADMIN2;       // 請參考includes/custom/php/general_define.php
$footer_type = FOOTER_TYPE_SBADMIN2; // 請參考includes/custom/php/general_define.php
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');


$report_today =  date("Y-m-d");   
$report_tomorrow = date("Y-m-d", strtotime('tomorrow'));;   

$sql = "SELECT * FROM log where `time` >= '".$report_today."' AND `time` < '".$report_tomorrow."'";
$all_logs = array();
foreach ($db->query($sql) as $row) {

    $log = array(
        'time' => $row['time'],
        's_text' => $row['s_text'],
        'm_text' => $row['m_text'],
        'quantity' => $row['quantity'],
        'price' => $row['price']
    );
    $all_logs[] = $log;


}


$template = $twig->loadTemplate('total_report.html');
$_HTML .= $template->render(array(
    'all_logs' => $all_logs
));

require_once('includes/custom/php/footer.php');

?>
