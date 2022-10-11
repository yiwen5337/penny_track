<?php
function test() {
    return "test success";
}

function cur_datetime() {
    date_default_timezone_set("Asia/Kuala_Lumpur");
    $cur_date = date('d-m-Y H:i:s'); //Returns IST
    return $cur_date;
}

?>