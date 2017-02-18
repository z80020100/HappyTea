<?php

require_once ("includes/custom/php/general.php");

$_PAGE_TITLE = '即時訂單';
$header_type = HEADER_TYPE_NONE;
$nav_type = NAV_TYPE_NONE;
$footer_type = FOOTER_TYPE_NONE;
require_once('includes/custom/php/header.php');
require_once('includes/custom/php/navigation.php');

//not_staff_redirect();

$template = $twig->loadTemplate('listorder.html');


$_HTML .= $template->render(array(

));

require_once('includes/custom/php/footer.php');
?>
