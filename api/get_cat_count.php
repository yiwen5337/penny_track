<?php
header("Access-Control-Allow-Origin: *");

include './db_connection.php';
require_once('./REST.php');

$counts = [];

$uid = isset($_GET['userid']) ? $_GET['userid'] : '';
$sort = isset($_GET['sort']) ? $_GET['sort'] : '';

if($sort == "0"){ //savings (`typeID` = 0)
    $sql = "SELECT count(*) AS `total`,
    count(if(`categoryID`='0',1,null)) AS `housing`,
    count(if(`categoryID`='1',1,null)) AS `trans`,
    count(if(`categoryID`='2',1,null)) AS `food`,
    count(if(`categoryID`='3',1,null)) AS `utilities`,
    count(if(`categoryID`='4',1,null)) AS `insurance`,
    count(if(`categoryID`='5',1,null)) AS `medical`,
    count(if(`categoryID`='6',1,null)) AS `invest`,
    count(if(`categoryID`='7',1,null)) AS `personal`,
    count(if(`categoryID`='8',1,null)) AS `sports`,
    count(if(`categoryID`='9',1,null)) AS `credit`,
    count(if(`categoryID`='10',1,null)) AS `loan`,
    count(if(`categoryID`='11',1,null)) AS `misc`,
    count(if(`categoryID`='12',1,null)) AS `income`
    FROM `user_data` WHERE `typeID` = 0 AND `userID` ='{$uid}';";

}elseif($sort == "1"){ //spendings (`typeID` = 1)
    $sql = "SELECT count(*) AS `total`,
    count(if(`categoryID`='0',1,null)) AS `housing`,
    count(if(`categoryID`='1',1,null)) AS `trans`,
    count(if(`categoryID`='2',1,null)) AS `food`,
    count(if(`categoryID`='3',1,null)) AS `utilities`,
    count(if(`categoryID`='4',1,null)) AS `insurance`,
    count(if(`categoryID`='5',1,null)) AS `medical`,
    count(if(`categoryID`='6',1,null)) AS `invest`,
    count(if(`categoryID`='7',1,null)) AS `personal`,
    count(if(`categoryID`='8',1,null)) AS `sports`,
    count(if(`categoryID`='9',1,null)) AS `credit`,
    count(if(`categoryID`='10',1,null)) AS `loan`,
    count(if(`categoryID`='11',1,null)) AS `misc`,
    count(if(`categoryID`='12',1,null)) AS `income`
    FROM `user_data` WHERE `typeID` = 1 AND `userID` ='{$uid}';";

}


if($result = mysqli_query($con,$sql)) {

	$i = 0;
	while($row = mysqli_fetch_assoc($result)) {
        $counts[$i]['total'] = $row['total'];

        $counts[$i]['housing'] = $row['housing'];
        $counts[$i]['trans'] = $row['trans'];
        $counts[$i]['food'] = $row['food'];
        $counts[$i]['utilities'] = $row['utilities'];
        $counts[$i]['insurance'] = $row['insurance'];
        $counts[$i]['medical'] = $row['medical'];
        $counts[$i]['invest'] = $row['invest'];
        $counts[$i]['personal'] = $row['personal'];
        $counts[$i]['sports'] = $row['sports'];
        $counts[$i]['credit'] = $row['credit'];
        $counts[$i]['loan'] = $row['loan'];
        $counts[$i]['misc'] = $row['misc'];
        $counts[$i]['income'] = $row['income'];

		$i++;
	}
	echo json_encode($counts);
}
else {
	http_response_code(404);
}

?>