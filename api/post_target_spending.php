<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$amounts = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';
$tdate = isset($_GET['targetDate']) ? $_GET['targetDate'] : '';
$cdate = isset($_GET['createDate']) ? $_GET['createDate'] : '';

$sql = "SELECT `amount` FROM `user_data` WHERE `typeID` = 1 AND `userID` ='{$uid}' AND `createDTTM` <= '{$tdate}' AND `createDTTM` >= '{$cdate}' ;";

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {
        $amounts[$i]['amount'] = $row['amount'];

		$i++;
	}
	echo json_encode($amounts);
}
else {
	http_response_code(404);
}

?>