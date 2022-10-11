<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
  // Extract the data.
  $request = json_decode($postdata);

  // Sanitize.
  $uid = mysqli_real_escape_string($con, $request->userID);
  $status = mysqli_real_escape_string($con, (int)$request->userStat);
  $session = mysqli_real_escape_string($con, $request->userSession);
  $date = mysqli_real_escape_string($con, date("Y-m-d H:i:s"));

  // Create.
  $sql = "UPDATE `user_log` SET `userID`='$uid',`userStat`='$status',`createDTTM`='$date' WHERE `userSession` = '{$session}' LIMIT 1";

  if(mysqli_query($con, $sql)) {
    http_response_code(201);
    
    echo json_encode("success");
  }
  else {
    http_response_code(422);
  }
}

?>