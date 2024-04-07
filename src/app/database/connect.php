<?php
//header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
//header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

define('DB_HOST', '162.144.3.211');
define('DB_USER', 'jherm');
define('DB_PASS', 'R0-M,N=55iB$');
define('DB_NAME', 'sagejher_users');

function connect()
{
  $connect = mysqli_connect(DB_HOST ,DB_USER ,DB_PASS ,DB_NAME);

  if (mysqli_connect_errno($connect)) {
    die("Failed to connect:" . mysqli_connect_error());
  }

  mysqli_set_charset($connect, "utf8");
  echo('Made Connection!');
  return $connect;
}

$con = connect();


?>