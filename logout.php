<?php

require_once ("includes/custom/php/general_define.php");

$_PAGE_TITLE = '系統登出';
$header_type = NAV_TYPE_NONE;
$nav_type = NAV_TYPE_NONE;
$footer_type = NAV_TYPE_NONE;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

$template = $twig->loadTemplate('empty.html');

//$message = "";

if(isset($_SESSION['u_name'])){
    session_destroy();
    echo "DBG: 已登出";
}
else{
    echo "DBG: 未登入";
}

$_HTML .= $template->render(array(
  //'LOGIN_MESSAGE' => $message,
));

require_once('includes/custom/php/footer.php');

?>
