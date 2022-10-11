<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$category = [];

$cid = isset($_GET['catID']) ? $_GET['catID'] : '';

$sql = "SELECT `category` FROM `category` WHERE `categoryID` ='{$cid}';";

if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {

		$category[$i]['category'] = $row['category'];
        
		$i++;
	}
	echo json_encode($category);
}
else {
	http_response_code(404);
}

?>