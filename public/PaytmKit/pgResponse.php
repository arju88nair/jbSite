<?php
header("Pragma: no-cache");
header("Cache-Control: no-cache");
header("Expires: 0");

// following files need to be included
require_once("./lib/config_paytm.php");
require_once("./lib/encdec_paytm.php");

$paytmChecksum = "";
$paramList = array();
$isValidChecksum = "FALSE";

$paramList = $_POST;
$paytmChecksum = isset($_POST["CHECKSUMHASH"]) ? $_POST["CHECKSUMHASH"] : ""; //Sent by Paytm pg

//Verify all parameters received from Paytm pg to your application. Like MID received from paytm pg is same as your application�s MID, TXN_AMOUNT and ORDER_ID are same as what was sent by you to Paytm PG for initiating transaction etc.
$isValidChecksum = verifychecksum_e($paramList, PAYTM_MERCHANT_KEY, $paytmChecksum); //will return TRUE or FALSE string.


if ($isValidChecksum == "TRUE") {
    echo "<b>Checksum matched and following are the transaction details:</b>" . "<br/>";
    if ($_POST["STATUS"] == "TXN_SUCCESS") {
        echo "<b>Transaction status is success</b>" . "<br/>";
        //Process your transaction here as success transaction.
        //Verify amount & order id received from Payment gateway with your application's order id and amount.
    } else {
        echo "<b>Transaction status is failure</b>" . "<br/>";
    }

    if (isset($_POST) && count($_POST) > 0) {

        if ($_POST['STATUS'] == "TXN_SUCCESS") {
            $orderid = $_POST['ORDERID'];
            $url = "http://justbooksclc.com/api/v1/paytm_payment_callback.json?orderid=$orderid&response_code=01&payment_type=Paytm&branch_id=810";
echo $url;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HEADER, 0);            // No header in the result
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return, do not echo result
            $raw_data = curl_exec($ch);
            curl_close($ch);
            print_r($raw_data);
            if($raw_data['success']=true)
            {
                header("Location: /");
            }
            else{
                echo $_POST['RESPMSG'];
            }
        }

        foreach ($_POST as $paramName => $paramValue) {
            echo "<br/>" . $paramName . " = " . $paramValue;
        }
    }


} else {
    echo "<b>Checksum mismatched.</b>";
    //Process transaction as suspicious.
}

?>