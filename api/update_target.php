<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
	// Extract the data.
	$request = json_decode($postdata);

	// Sanitize.
    $tid = mysqli_real_escape_string($con, (int)$request->targetID);
	$uid = mysqli_real_escape_string($con, (int)$request->userID);
	$stat = mysqli_real_escape_string($con, (int)$request->targetStat);
	

	$sql = "UPDATE `user_target` SET `targetStat`='$stat' WHERE `targetID` = $tid AND `userID` = $uid";
	
	if(mysqli_query($con, $sql)) {
		http_response_code(201);
		
		echo json_encode("success");
	} 
	else {
		http_response_code(422);
	}
}

?>