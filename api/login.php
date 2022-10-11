<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$email = isset($_GET['email']) ? $_GET['email'] : '';
$pwd = isset($_GET['pwd']) ? $_GET['pwd'] : '';
$sal_pwd = md5("@penny".$pwd."#track");

$logs = [];
$sql = 'SELECT * FROM user WHERE userEmail = "'.$email.'" AND userPassword = "'.$sal_pwd.'"';

if($result = mysqli_query($con,$sql)) {
  $i = 0;

  while($row = mysqli_fetch_assoc($result)) {
    $logs[$i]['userID'] = $row['userID'];
    $logs[$i]['userName'] = $row['userName'];
    $logs[$i]['userEmail'] = $row['userEmail'];
    $logs[$i]['userPassword'] = $row['userPassword'];
    $logs[$i]['createDTTM'] = $row['createDTTM'];

    $i++;
  }

  echo json_encode($logs);
}
else {
  http_response_code(404);
}

?>