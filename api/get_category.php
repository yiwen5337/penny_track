<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$categories = [];

$sql = "SELECT * FROM `category` ORDER BY `category`";

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {

        $categories[$i]['categoryID'] = $row['categoryID'];
		$categories[$i]['category'] = $row['category'];
		$categories[$i]['priority'] = $row['priority'];
        
		$i++;
	}
	echo json_encode($categories);
}
else {
	http_response_code(404);
}

?>