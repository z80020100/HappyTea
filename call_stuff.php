<?php

require_once('includes/custom/php/general.php');

$_PAGE_TITLE = '上游叫料 - 樂台茶餐飲管理系統';
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

//not_admin_redirect();

// read data from raw_material table
/*****
      raw_material table
raw_id     raw_name     unit

*****/
$sql = "SELECT * FROM `raw_material`";

$result = $db->query($sql);

$template = $twig->loadTemplate('call_stuff.html');

$_HTML .= $template->render(array(
  'data' => $result,
));

require_once('includes/custom/php/footer.php');

?>
