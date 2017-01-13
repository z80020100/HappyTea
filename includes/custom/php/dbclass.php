<?php
/**************************************************************************************
*
*	File 	: 	dbclass.php
*	Author 	: 	Martinet Lee <martinetlee@gmail.com>
*	Version	:  	0.1.0
*	Description:	
*		This is a class implementation of mysql database interface
*		Mainly to automate and reduce some codes when using mysql.
*
***************************************************************************************/
define("SUCCESS"	, 0);
define("CONNECT_FAIL"	, 1);
define("DBSELECT_FAIL"	, 2);
define("QUERY_FAIL"	, 3);
define("NUMROW_FAIL"	, 4);

class Db{
	
	var $mysqli;

	var $host;
	var $dbname;
	var $user;
	var $pass;

	var $err;
	var $errtext;
	
	function __construct($host_location, $username, $password, $database_name){
		// Setup the connection to the Database
	
		$this->host = $host_location;
		$this->user = $username;
		$this->pass = $password;
		$this->dbname = $database_name;
		
		$this->connect();
	}

	function error_occur($Db_errcode){
		$this->err = $Db_errcode;
		$this->errtext = $this->mysqli->error;	
	}
	
	function connect(){
		$this->mysqli = new mysqli($this->host, $this->user, $this->pass, $this->dbname);
	
		if ($this->mysqli->connect_errno) {
			$this->error_occur(CONNECT_FAIL);
			return false;
		}
		
		$this->mysqli->query("SET NAMES 'UTF8'");   
		// 解決讀出中文字亂碼問題,
		// 參考: http://www.mrmu.com.tw/2011/01/09/php-mysql-utf8-unicode/
	}
	
	function query($sql){
		if(!($result = $this->mysqli->query($sql))){
			$this->error_occur(QUERY_FAIL);
			return false;
		}
		return $result;
	}
	
	function fetch_array($result){
		return $result->fetch_assoc();
	}
	
	function query_select_one($sql){
		$result = $this->query($sql);
		$data = $result->fetch_array();
		return $data;
	}
	
	function numrow($result){
		return $result->num_rows;
	}
	
	function insert_id(){
		return $this->mysqli->insert_id;
	}
}


?>