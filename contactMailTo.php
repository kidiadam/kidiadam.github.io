<?php

$name=$_POST['name'];
$sex=$_POST['sex'];
$num=$_POST['num'];
$ct=implode(',',$_POST['ct']);
$email=$_POST['email'];

$to      = 'kidiadam@yahoo.com.tw';
$subject = "=?UTF-8?B?".base64_encode("Website Mail")."?=";
$message = '姓名：'.$name."\r\n".
           '性別：'.$sex."\r\n".
           '電話：'.$num."\r\n".
           '電子郵件：'.$email."\r\n".
           '聯絡時間：'.$ct;
$headers = 'From: kidiadam@yahoo.com.tw' . "\r\n" .
    'Reply-To: kidiadam@yahoo.com.tw' . "\r\n";

mail($to, $subject, $message, $headers)    
?>