<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$targets = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';

//targetStat = 0 (Fail/Disabled)
//targetStat = 1 (Active)
//targetStat = 2 (Complete)
$sql = "SELECT * FROM `user_target` WHERE `targetStat` = 1 AND `userID` ='{$uid}' LIMIT 1;"; 

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {
        $targets[$i]['targetID'] = $row['targetID'];
		$targets[$i]['userID'] = $row['userID'];
		$targets[$i]['salary'] = $row['salary'];
		$targets[$i]['target'] = $row['target'];
		$targets[$i]['payday'] = $row['payday'];
        $targets[$i]['targetDate'] = $row['targetDate'];
        $targets[$i]['targetStat'] = $row['targetStat'];
		$targets[$i]['createDTTM'] = $row['createDTTM'];

		$i++;
	}
	echo json_encode($targets);
}
else {
	http_response_code(404);
}

?>