<?php
require_once ("dbclass.php");
// db_config.php
// configurate database connection
define('DB_ADDRESS', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_DATABASE', 'happytea');

$db = new Db(DB_ADDRESS, DB_USER, DB_PASSWORD, DB_DATABASE);
?>
