<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
	// Extract the data.
	$request = json_decode($postdata);

	// Sanitize.
	$id = mysqli_real_escape_string($con, (int)$request->id);
	$uid = mysqli_real_escape_string($con, (int)$request->userID);
	$name = mysqli_real_escape_string($con, trim($request->name));
	$type = mysqli_real_escape_string($con, (int)$request->typeID);
	$category = mysqli_real_escape_string($con, (int)$request->categoryID);
	$amount = mysqli_real_escape_string($con, (float)$request->amount);
	$des = mysqli_real_escape_string($con, $request->description);

	$sql = "UPDATE `user_data` SET `name`='$name', `typeID`=$type, `categoryID`=$category, `amount`=$amount, `description`='$des' WHERE `id` = $id AND `userID` = $uid";
	
	if(mysqli_query($con, $sql)) {
		http_response_code(201);
		
		echo json_encode("success");
	} 
	else {
		http_response_code(422);
	}
}

?>