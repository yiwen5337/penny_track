<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
  // Extract the data.
  $request = json_decode($postdata);
  
  // Sanitize.
  $name = mysqli_real_escape_string($con, trim($request->userName));
  $email= mysqli_real_escape_string($con, $request->userEmail);
  $pwd= mysqli_real_escape_string($con, $request->userPassword);

  $sal_pwd = md5("@penny".$pwd."#track"); //salt the password

  // Create.
  $sql = "INSERT INTO `user` (`userName`, `userEmail`, `userPassword`) VALUES ('{$name}','{$email}','{$sal_pwd}')";

  if(mysqli_query($con,$sql)) {
    http_response_code(201);

    echo json_encode("success");
  }
  else {
    http_response_code(422);
  }
}

?>