<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$user = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';

$sql = "SELECT * FROM `user` WHERE `userID` = '{$uid}'";

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {

        $user[$i]['userID'] = $row['userID'];
		$user[$i]['userName'] = $row['userName'];
		$user[$i]['userEmail'] = $row['userEmail'];
        $user[$i]['createDTTM'] = $row['createDTTM'];

		$i++;
	}
	echo json_encode($user);
}
else {
	http_response_code(404);
}

?>
