<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$targets = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';

$sql = "SELECT TIMESTAMPDIFF(DAY, NOW(), `targetDate`) AS `days`, TIMESTAMPDIFF(MONTH, `payday`, `targetDate`) AS `months` FROM `user_target` WHERE `targetStat` = 1 AND `userID` ='{$uid}' LIMIT 1;";

if($result = mysqli_query($con,$sql)) {
    $i = 0;
	while($row = mysqli_fetch_assoc($result)) {
        $targets[$i]['days'] = $row['days'];
        $targets[$i]['months'] = $row['months'];
       
		$i++;
	}
	
	echo json_encode($targets);
}
else {
	http_response_code(404);
}

?>