<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$email = isset($_GET['email']) ? $_GET['email'] : '';


$logs = [];
$sql = 'SELECT userEmail FROM user WHERE userEmail = "'.$email.'"';

if($result = mysqli_query($con,$sql)) {
  $i = 0;

  while($row = mysqli_fetch_assoc($result)) {
    $logs[$i]['userEmail'] = $row['userEmail'];

    $i++;
  }

  echo json_encode($logs);
}
else {
  http_response_code(404);
}

?>