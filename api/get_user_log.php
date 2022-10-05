<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$existed_session = isset($_GET['user_session']) ? $_GET['user_session'] : '';

$logs = [];
$sql = 'SELECT * FROM `user_log` WHERE `userSession` = "'.$existed_session.'"';

if($result = mysqli_query($con,$sql)) {

  $i = 0;
  while($row = mysqli_fetch_assoc($result)) {
    $logs[$i]['logID'] = $row['logID'];
    $logs[$i]['userID'] = $row['userID'];
    $logs[$i]['userStat'] = $row['userStat'];
    $logs[$i]['userSession'] = $row['userSession'];
    $logs[$i]['createDTTM'] = $row['createDTTM'];

    $i++;
  }

  echo json_encode($logs);
}
else {
  http_response_code(404);
}

?>