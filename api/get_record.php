<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$records = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';

$sql = "SELECT d.id, d.name, t.type, t.typeID, c.category, c.categoryID, d.amount, d.description, d.createDTTM
FROM `user` u
LEFT JOIN `user_data` d ON (d.userID = u.userID)
LEFT JOIN `type` t ON (t.typeID = d.typeID)
LEFT JOIN `category` C ON (c.categoryID = d.categoryID)
WHERE u.userID ='{$uid}'
ORDER BY d.createDTTM DESC;";

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {
        $records[$i]['id'] = $row['id'];
		$records[$i]['name'] = $row['name'];
		$records[$i]['type'] = $row['type'];
		$records[$i]['typeID'] = $row['typeID'];
        $records[$i]['category'] = $row['category'];
		$records[$i]['categoryID'] = $row['categoryID'];
		$records[$i]['amount'] = $row['amount'];
		$records[$i]['description'] = $row['description'];
        $records[$i]['createDTTM'] = $row['createDTTM'];

		$i++;
	}
	echo json_encode($records);
}
else {
	http_response_code(404);
}

?>