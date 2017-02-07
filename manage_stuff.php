<?php

require_once('includes/custom/php/general.php');

$_PAGE_TITLE = '編輯補料 - 樂台茶餐飲管理系統';
// remember check $uniform_theme in includes/custom/php/general.php
$header_type = HEADER_TYPE_SBADMIN2;
$nav_type = NAV_TYPE_SBADMIN2;
$footer_type = FOOTER_TYPE_SBADMIN2;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

global $db;

// redirect if it's not top_admin || top_staff
// if (!(is_topboss() || is_headquarters_staff())) {
//   header("location:login.php?shop_id=" . $_shopID);
//   die('');
// }
$shop_id = $_SESSION['shop_id'];
if ($shop_id == '') $shop_id = -2;  // -2: Error session


// read data from raw_material table
$sql = "SELECT `raw_id`, `raw_name`, `unit` FROM `raw_material`";

$result = $db->query($sql);

$template = $twig->loadTemplate('manage_stuff.html');

$_HTML .= $template->render(array(
  'data' => $result,
));

require_once('includes/custom/php/footer.php');

?>
