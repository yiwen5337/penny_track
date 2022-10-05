<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$spendings = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';

//spendings (`typeID` = 1)
$sql = "SELECT count(if(`categoryID`='0',1,null)) AS `0`,
        count(if(`categoryID`='1',1,null)) AS `1`,
        count(if(`categoryID`='2',1,null)) AS `2`,
        count(if(`categoryID`='3',1,null)) AS `3`,
        count(if(`categoryID`='4',1,null)) AS `4`,
        count(if(`categoryID`='5',1,null)) AS `5`,
        count(if(`categoryID`='6',1,null)) AS `6`,
        count(if(`categoryID`='7',1,null)) AS `7`,
        count(if(`categoryID`='8',1,null)) AS `8`,
        count(if(`categoryID`='9',1,null)) AS `9`,
        count(if(`categoryID`='10',1,null)) AS `10`,
        count(if(`categoryID`='11',1,null)) AS `11`,
        count(if(`categoryID`='12',1,null)) AS `12`
        FROM `user_data` WHERE `typeID` = 1 AND `userID` ='{$uid}';";


if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {
        
        $spendings[$i]['0'] = $row['0'];
        $spendings[$i]['1'] = $row['1'];
        $spendings[$i]['2'] = $row['2'];
        $spendings[$i]['3'] = $row['3'];
        $spendings[$i]['4'] = $row['4'];
        $spendings[$i]['5'] = $row['5'];
        $spendings[$i]['6'] = $row['6'];
        $spendings[$i]['7'] = $row['7'];
        $spendings[$i]['8'] = $row['8'];
        $spendings[$i]['9'] = $row['9'];
        $spendings[$i]['10'] = $row['10'];
        $spendings[$i]['11'] = $row['11'];
        $spendings[$i]['12'] = $row['12'];

		$i++;
	}
	echo json_encode($spendings);
}
else {
	http_response_code(404);
}

?>