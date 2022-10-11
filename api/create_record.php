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
	$name = mysqli_real_escape_string($con, trim($request->name));
	$type = mysqli_real_escape_string($con, (int)$request->typeID);
	$category = mysqli_real_escape_string($con, (int)$request->categoryID);
	$amount = mysqli_real_escape_string($con, (float)$request->amount);
	$des = mysqli_real_escape_string($con, $request->description);
	$date = mysqli_real_escape_string($con, $request->createDTTM); //datetime format convertion is done from frontend

	// Create.
	$sql = "INSERT INTO `user_data` (`userID`,`name`,`typeID`,`categoryID`,`amount`,`description`,`createDTTM`) VALUES ($uid, '$name', $type, $category, $amount, '$des', '$date')";

	if(mysqli_query($con,$sql)) {
		http_response_code(201);
		
		echo json_encode("success");
	}
	else{
		http_response_code(422);
	}
}

?>