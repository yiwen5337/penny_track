<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$id = isset($_GET['id']) ? $_GET['id'] : '';
$uid = isset($_GET['uid']) ? $_GET['uid'] : '';

$sql = "DELETE FROM `user_data` WHERE `id` = $id AND `userID` = $uid";

if(mysqli_query($con, $sql)) {
	http_response_code(201);
	
	echo json_encode("success");
} 
else {
	http_response_code(422);
}

?>