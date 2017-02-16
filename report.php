<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = '營業報表';
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

global $db;
$sql;
if ($_SHOP_ID == -1) {
  $shop_id = 1;
  $sql = "SELECT * FROM `log`
          WHERE `shop_id` = '".$shop_id."'";
}
else {
  $sql = "SELECT * FROM `log`
          WHERE `shop_id` = '".$_SHOP_ID."'";
}
$result = $db->query($sql);

$template = $twig->loadTemplate('report.html');

$_HTML .= $template->render(array(
  'data' => $result,
));

require_once('includes/custom/php/footer.php');

?>
