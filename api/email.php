<?php 
header("Access-Control-Allow-Origin: *");

$sent = false;

//Get data
$name = isset($_GET['name']) ? $_GET['name'] : '';
$email = isset($_GET['email']) ? $_GET['email'] : '';
$ph = isset($_GET['ph']) ? $_GET['ph'] : '';
$type = isset($_GET['type']) ? $_GET['type'] : '';
$msg = isset($_GET['msg']) ? $_GET['msg'] : '';

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require 'PHPMailer/Exception.php';
// require 'PHPMailer/PHPMailer.php';
// require 'PHPMailer/SMTP.php';

// $mail = new PHPMailer;

// $mail->isSMTP();                      // Set mailer to use SMTP
// $mail->Host = 'smtp.elasticemail.com';       // Specify main and backup SMTP servers
// $mail->SMTPAuth = true;               // Enable SMTP authentication
// $mail->Username = 'support@pennytrack.com';   // SMTP username
// $mail->Password = '826F0C13CAE53685C1E8002EBEB4EE2CA583';   // SMTP password
// $mail->SMTPSecure = 'tls';            // Enable TLS encryption, `ssl` also accepted
// $mail->Port = 2525;                    // TCP port to connect to

// // Sender info
// $mail->setFrom('support@pennytrack.com', 'FromName');
// $mail->addReplyTo('0195529@student.kdupg.edu.my', 'ReplyName');

// // Add a recipient
// $mail->addAddress('0195529@student.kdupg.edu.my');

// // Set email format to HTML
// $mail->isHTML(true);

// // Mail subject
// $mail->Subject = 'Email from local host to test';

// // Mail body content
// $bodyContent = '<h1>How to Send Email from Localhost using PHP by InfoTech</h1>';
// $bodyContent .= '<p>This HTML email is sent from the localhost server using PHP by <b>TechWAR</b></p>';
// $mail->Body    = $bodyContent;

// // Send email 
// if(!$mail->send()) { 
//     echo 'Message could not be sent. Mailer Error: '.$mail->ErrorInfo; 
// } else { 
//     echo 'Message has been sent.'; 
// } 

//Preparing email
$to = "0195529@student.kdupg.edu.my"; // send mail target
$from = $email;

if ($type == 0) {
    $subject = "Penny Track Support Request"; //for Admin
    $subject2 = "Copy of Support Request"; // for Visitor

    //Email content layout
    $message = "Hello, Penny Track's Admin, \n\n" .
    "You have a support request." . "\n\n" . 
    "==================================================" . "\n" . 
    "From : " . $name . "\n" .
    "Contact Number : " . $ph . "\n" .
    "Email : " . $from . "\n\n" .
    "==================================================" . "\n\n" . 
    $msg;


    $message2 = "Dear " . $name . ", \n\n" .
    "Your support request had sent to Penney Track" . "\n".
    "Our support team will email to you soon." ."\n\n" . 
    "Here is a copy of Support Request : " . "\n" . 
    "==================================================" . "\n" . 
    "Your Contact Number : " . $ph . "\n\n" .
    "Your Email : " . $from . "\n" .
    "==================================================" . "\n\n" . 
    $msg . "\n\n\n" .
    "*This is an auto generated email, Please do no replay. Thank You.\n\n" ;

    $sent = true;

} else if ($type == 1) {
    $subject = "Penny Track Issues Feedback"; //for Admin
    $subject2 = "Copy of Your Issues Feedback"; // for Visitor

    //Email content layout
    $message = "Hello, Penny Track's Admin, \n\n" .
    "You have an issues feedback." . "\n\n" . 
    "==================================================" . "\n" . 
    "From : " . $name . "\n" .
    "Contact Number : " . $ph . "\n" .
    "Email : " . $from . "\n\n" .
    "==================================================" . "\n\n" . 
    $msg;


    $message2 = "Dear " . $name . ", \n\n" .
    "Your issues feedback had sent to Penney Track" . "\n".
    "Our team will review the feedback." ."\n\n" . 
    "Here is a copy of Issues Feedback : " . "\n" . 
    "==================================================" . "\n" . 
    "Your Contact Number : " . $ph . "\n\n" .
    "Your Email : " . $from . "\n" .
    "==================================================" . "\n\n" . 
    $msg . "\n\n\n" .
    "*This is an auto generated email, Please do no replay. Thank You.\n\n" ;

    $sent = true;
}


$headers = "From: Penny Track System"; 
$headers2 = "From: Penny Track Support [No Reply]";


mail ($to, $subject, $message, $headers); //Email to Admin
mail ($from, $subject2, $message2, $headers2); //Email to Visitor
    


if($sent == true) {
    http_response_code(201);

    echo json_encode("success");
}
else{
    http_response_code(422);
}

?>