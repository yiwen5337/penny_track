<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$categories = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';
$array = isset($_GET['arr']) ? $_GET['arr'] : '';

// $categoryIDs = implode(',', $array);

//spendings (`typeID` = 1)
$sql = "SELECT * FROM `user_data` ud 
LEFT JOIN `category` ca ON ca.categoryID = ud.categoryID
WHERE ud.categoryID in ({$array}) AND ud.typeID = 1 AND ud.userID ='{$uid}' ORDER BY ca.categoryID ;";

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {

        $categories[$i]['id'] = $row['id'];
        $categories[$i]['userID'] = $row['userID'];
        $categories[$i]['typeID'] = $row['typeID'];
        $categories[$i]['categoryID'] = $row['categoryID'];
        $categories[$i]['amount'] = $row['amount'];
		$categories[$i]['category'] = $row['category'];
		$categories[$i]['priority'] = $row['priority'];
        
		$i++;
	}
	echo json_encode($categories);
}
else {
	http_response_code(404);
}