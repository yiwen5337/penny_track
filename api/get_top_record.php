<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$records = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';

$sql = "SELECT  d.name, t.type, d.amount
FROM `user_data` d 
LEFT JOIN `type` t ON (t.typeID = d.typeID)
WHERE d.userID ='{$uid}'
ORDER BY d.createDTTM DESC LIMIT 3;";

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {
		$records[$i]['name'] = $row['name'];
		$records[$i]['amount'] = $row['amount'];
        $records[$i]['type'] = $row['type'];

		$i++;
	}
	echo json_encode($records);
}
else {
	http_response_code(404);
}

?>