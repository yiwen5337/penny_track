<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$data = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';
$sort = isset($_GET['sort']) ? $_GET['sort'] : '';


if($sort == "0"){ //All
    $sql = "SELECT * FROM `user_data` WHERE `userID` ='{$uid}' ORDER BY `createDTTM` ASC;";

}elseif($sort == "1"){ //1 month
    $sql = "SELECT * FROM `user_data` WHERE `userID` ='{$uid}' AND `createDTTM` >= DATE(NOW() - INTERVAL 1 MONTH) ORDER BY `createDTTM` ASC;";

}elseif($sort == "2"){ //7 days
    $sql = "SELECT * FROM `user_data` WHERE `userID` ='{$uid}' AND `createDTTM` >= DATE(NOW() - INTERVAL 7 DAY) ORDER BY `createDTTM` ASC;";

}elseif($sort == "3"){ //2 months
    $sql = "SELECT * FROM `user_data` WHERE `userID` ='{$uid}' AND `createDTTM` >= DATE(NOW() - INTERVAL 2 MONTH) ORDER BY `createDTTM` ASC;";

}

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {
        $data[$i]['id'] = $row['id'];
        $data[$i]['userID'] = $row['userID'];
        $data[$i]['name'] = $row['name'];
        $data[$i]['typeID'] = $row['typeID'];
        $data[$i]['categoryID'] = $row['categoryID'];
        $data[$i]['amount'] = $row['amount'];
        $data[$i]['description'] = $row['description'];
        $data[$i]['createDTTM'] = $row['createDTTM'];

		$i++;
	}
	echo json_encode($data);
}
else {
	http_response_code(404);
}

?>