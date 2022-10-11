<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
	// Extract the data.
	$request = json_decode($postdata);

	// Sanitize.
	$uid = mysqli_real_escape_string($con, (int)$request->userID);
	$stat = mysqli_real_escape_string($con, (int)$request->targetStat);
	$salary = mysqli_real_escape_string($con, (float)$request->salary);
    $target = mysqli_real_escape_string($con, (float)$request->target);
	$payday = mysqli_real_escape_string($con, $request->payday);
	$targetDate = mysqli_real_escape_string($con, $request->targetDate); //datetime format convertion is done from frontend

	// Create.
	$sql = "INSERT INTO `user_target`(`userID`, `salary`, `target`, `payday`, `targetDate`, `targetStat`) VALUES ($uid, $salary, $target, '$payday', '$targetDate', $stat)";

	if(mysqli_query($con,$sql)) {
		http_response_code(201);
		
		echo json_encode("success");
	}
	else{
		http_response_code(422);
	}
}

?>