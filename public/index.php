<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../includes/functions.php';
//define('API_URL', 'http://staging.justbooksclc.com:');
define('API_URL', 'http://justbooksclc.com/api/v1/');
define('API_URL_ES', 'http://rec.justbooksclc.com');
session_start();
//$_SESSION['membership_no'] = 'M191990';
//$_SESSION['api_key'] = 'FmCvJxNw6nCsLzCgwjFw';

$app = init();

$authenticate = function ($request, $response, $next) {
    if (!isset($_SESSION['username'])) {
//        $response = $this->view->render($response, 'home.mustache', array('loggedIn' => "false", 'session' => 'null'));
//        return $response;
        return $response->withRedirect('/');

    } else {
        return $next($request, $response);
    }
};


$adminAuthenticate = function ($request, $response, $next) {
    if (!isset($_SESSION['adminUser'])) {
//        $response = $this->view->render($response, 'login.mustache', array('loggedIn' => "false", 'session' => 'null'));
//        return $response;
        return $response->withRedirect('/adminLogin/');

    } else {
        return $next($request, $response);
    }
};


function curlFunction($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL . $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);            // No header in the result
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return, do not echo result
    $raw_data = curl_exec($ch);
    curl_close($ch);
    return $raw_data;
}

function curlFunctionEs($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL_ES . $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);            // No header in the result
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return, do not echo result
    $raw_data = curl_exec($ch);
    curl_close($ch);
    return $raw_data;
}

//function curlFunctionPost($url)
//{
//    $ch = curl_init();
//    curl_setopt($ch, CURLOPT_URL, API_URL_ES . $url);
//    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//    curl_setopt($ch, CURLOPT_POSTFIELDS, "isbn=$isbn&product_id=$product_id&author=$author&label=$label&price=$price&manufacturer=$manufacturer&pages=$pages&publicationdate=$publicationdate&publisher=$publisher&title=$title&image_url=$image_url&editorialreview=$editorialreview&description=$description&language=$language&category_string=$category_string");
//    $raw_data = curl_exec($ch);
//    curl_close($ch);
//    return $raw_data;
//}

$app->get('/', function (Request $request, Response $response) {

    $con = $this->db;
    $query = "SELECT * FROM website_parameters";
    $result = oci_parse($con, $query);
    oci_execute($result);
    while ($row = oci_fetch_assoc($result)) {
        $final_data[] = $row;
    }
    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }
    $image1 = $final_data[0]['IMAGE_URL_1'];
    $image2 = $final_data[0]['IMAGE_URL_2'];
    $image3 = $final_data[0]['IMAGE_URL_3'];
    $action1 = $final_data[0]['ACTION_1"'];
    $action2 = $final_data[0]['ACTI0N_2"'];
    $action3 = $final_data[0]['ACTION_3"'];
    $address = $final_data[0]['ADDRESS'];
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $response = $this->view->render($response, 'home.mustache', array('loggedIn' => "true", 'session' => $_SESSION['username'], 'image1' => $image1, 'image2' => $image2, 'image3' => $image3, 'action1' => $action1, 'action2' => $action2, 'action3' => $action3, 'address' => $address, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));
    return $response;
});

$app->get('/book_details/{titleid}/{name}', function (Request $request, Response $response, $args) {
    $titleid = $args['titleid'];
//    $result1 = curlFunction("8990/api/v1/title_info.json?title_id=$titleid");
//    $result1 = str_replace("NaN", 0, $result1);

    $raw_data = curlFunctionEs("/getTitleDetails?title_id=$titleid");
    $data = json_decode($raw_data);


    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("books_at_home.json?membership_no=$membership_no&api_key=$api_key&email=$email");
    $currentData = json_decode($result);
    $currentData = $currentData->result;
    $currentData = json_decode(json_encode($currentData), True);

    $currentID = [];
    foreach ($currentData as $current) {

        array_push($currentID, $current['id']);
    }
    $rental_id = "";
    $Currentflag = 0;
    if (in_array($titleid, $currentID)) {
        $Currentflag = 1;
        foreach ($currentData as $current) {

            if ($current['id'] == $titleid) {
                $rental_id = $current['rental_id'];
            }

        }
    }
    $ids = presentIds();
    $Wishflag = 1;
    if (in_array($titleid, $ids)) {
        $Wishflag = 0;

    }
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }

    $response = $this->view->render($response, 'book_details.mustache', array('data' => $data, 'titleid' => $titleid, 'Currentflag' => $Currentflag, 'rental' => $rental_id, 'wishFlag' => $Wishflag, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));
    return $response;
})->setName('book_details/');

$app->get('/author_details/{authorid}/{name}', function (Request $request, Response $response, $args) {
    $authorid = $args['authorid'];
//    $con = $this->db;
//    $final_data = [];
//    $query = "SELECT author_id,author_name,description ,'https://s3.amazonaws.com/prod.justbooksclc.com/authors/'||author_id||'.jpg' as image  FROM fn_author_details where author_id = $authorid";
//    $result = oci_parse($con, $query);
//    oci_execute($result);
//    while ($row = oci_fetch_assoc($result)) {
//        $final_data[] = $row;
//
//
//    }
    $raw_data = curlFunctionEs("/getAuthorDetails?author_id=$authorid");
    $data = json_decode($raw_data);

    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }


    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }

    $response = $this->view->render($response, 'author_details.mustache', array('data' => $data, 'id' => $authorid, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));
    return $response;
});

$app->get('/search', function (Request $request, Response $response) {

    $query = $_GET['q'];
//    $result = curlFunction("8990/api/v1/search.json?q=$query&page=1&per_page=20");
//    $count = count(json_decode($result)->result);
    $raw_data = curlFunctionEs("/getSuggestBooksDetails?text=$query&page=1");
    $data = json_decode($raw_data);
    $count = count($data);
    if ($data == "No Titles") {
        $count = 0;
    }

    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }

    $response = $this->view->render($response, 'search.mustache', array('data' => $data, 'query' => ucfirst($query), 'count' => $count, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));
    return $response;

});

$app->get('/shelf', function (Request $request, Response $response) {
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }

    $response = $this->view->render($response, 'shelf.mustache', array('flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));
    return $response;
})->add($authenticate);


$app->get('/getPlanFees', function (Request $request, Response $response) {
    $allGetVars = $request->getQueryParams();
    $planname = $allGetVars['planname'];
    $book = $allGetVars['book'];
    $months = $allGetVars['months'];

//    if(isset($_SESSION['branchID']))
//    {
//        $branch_id=$_SESSION['branchID'];
//        $plan_data_curl = curlFunction('get_all_plans.json?branch_id='.$branch_id);
//
//    }
//    else{
//        $plan_data_curl = curlFunction('get_all_plans.json');
//
//    }
    $plan_data_curl = curlFunction('get_all_plans.json');
    $plan_data = json_decode($plan_data_curl);
    $data = $plan_data->result;

    $data = json_decode(json_encode($data), True);


    $temp_array = array();
    foreach ($data as $v) {
        if ($v['web_signup_plan']['promo_code'] === $planname) {
            array_push($temp_array, $v);
        }

    }

    $array = array_values($temp_array);
    $count = [];
    foreach ($array as $item) {
        if ($item['web_signup_plan']['books'] == $book) {
            foreach ($item['web_signup_plan']['plan_durations'] as $plans) {

                if ($plans['plan_duration']['signup_months'] == $months) {
                    echo json_encode(array("total" => $plans['plan_duration']['totalAmount_with_convenience_fee'], 'reading_fee' => $plans['plan_duration']['reading_fee_for_term'], 'reg_fee' => $item['web_signup_plan']['registration_fee'], 'sec_deposit' => $item['web_signup_plan']['security_deposit']));
                    die;

                }
            }
        }
    }


});
$app->get('/getChangePlanFees', function (Request $request, Response $response) {
    $allGetVars = $request->getQueryParams();
    $planname = $allGetVars['planname'];
    $book = $allGetVars['book'];
    $months = $allGetVars['months'];

    $membership = $_SESSION['membership_no'];
    $email = $_SESSION['email'];
    $api_key = $_SESSION['api_key'];
    $plan_data_curl = curlFunction('get_change_plan_terms.json?email=' . $email . '&membercard=' . $membership . '&for_mobile=true');


    $plan_data = json_decode($plan_data_curl);
    $data = $plan_data->result;

    $data = json_decode(json_encode($data), True);

    $temp_array = array();
    foreach ($data as $v) {
        if (strtoupper($v['change_plan_detail']['promo_code']) === strtoupper($planname)) {
            array_push($temp_array, $v);
        }

    }

    $array = array_values($temp_array);
    $count = [];
    foreach ($array as $item) {
        if ($item['change_plan_detail']['books'] == $book) {
            foreach ($item['change_plan_detail']['plan_durations'] as $plans) {

                if ($plans['plan_duration']['change_plan_months'] == $months) {
                    echo json_encode(array("total" => $plans['plan_duration']['payable_amount'], 'reading_fee' => $item['change_plan_detail']['reading_fee'], 'available_balance' => $item['change_plan_detail']['available_balance'], 'balance_due' => $item['change_plan_detail']['balance_due']));
                    die;

                }
            }
        }
    }


});

$app->get('/signup', function (Request $request, Response $response) {
    $allGetVars = $request->getQueryParams();

    $con = $this->db;
//    if(isset($_SESSION['branchID']))
//    {
//        $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 and FOR_VIRTUAL = 0";
//
//    }
//    else{
//        $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 and FOR_VIRTUAL = 1";
//
//    }
    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 AND FOR_VIRTUAL = 1";

    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $planData[] = $row;
    }

//    if(isset($_SESSION['branchID']))
//    {
//        $branch_id=$_SESSION['branchID'];
//        $plan_data_curl = curlFunction('get_all_plans.json?branch_id='.$branch_id);
//
//    }
//    else{
//        $plan_data_curl = curlFunction('get_all_plans.json');
//
//    }
    $plan_data_curl = curlFunction('get_all_plans.json');

    $plan_data = json_decode($plan_data_curl);
    $data = $plan_data->result;

    $data = json_decode(json_encode($data), True);
    $temp_array_main = array();
    foreach ($data as &$v) {

        if (!isset($temp_array_main[$v['web_signup_plan']['promo_code']]))
            $temp_array_main[$v['web_signup_plan']['promo_code']] =& $v;
    }

    $array_data = array_values($temp_array_main);


    $books = $allGetVars['books'];
    $months = $allGetVars['months'];
    $planname = $allGetVars['planname'];

    $temp_array = array();
    foreach ($data as $indPlan) {
        if (strtoupper($indPlan['web_signup_plan']['promo_code']) === strtoupper($planname) && $indPlan['web_signup_plan']['books'] === (int)$books) {
            $monthTag = $indPlan['web_signup_plan']['frequency'];
            $namePlan = $indPlan['web_signup_plan']['plan_name'];
            $planid = $indPlan['web_signup_plan']['plan_id'];
        }

    }

    if ($monthTag == 'Y') {
        $monthTagText = "year(s)";
    } else {
        $monthTagText = "month(s)";
    }
    foreach ($data as $indPLan) {
        if (strtoupper($indPLan['web_signup_plan']['promo_code']) === strtoupper($planname)) {
            array_push($temp_array, $indPLan);
        }

    }


    $array = array_values($temp_array);


    $count = [];
    foreach ($array as $item) {


        array_push($count, (int)$item['web_signup_plan']['books']);


    }


    $count = array_values(array_unique($count, SORT_REGULAR));
    sort($count);

    $monthsArray = [];
    foreach ($array as $item) {
        if ($item['web_signup_plan']['books'] == $books) {
            foreach ($item['web_signup_plan']['plan_durations'] as $plans) {

                array_push($monthsArray, $plans['plan_duration']['signup_months']);

            }
        }
    }


    $monthsArray = array_values(array_unique($monthsArray));
    foreach ($array as $item) {
        if ($item['web_signup_plan']['books'] == $books) {
            foreach ($item['web_signup_plan']['plan_durations'] as $plans) {
                if ($plans['plan_duration']['signup_months'] == $months) {
                    if (isset($_SESSION['username'])) {
                        $flag = 1;
                        $slider = 0;
                        $name = $_SESSION['first_name'];
                    } else {
                        $flag = 0;
                        $slider = 1;
                        $name = "";
                    }

                    $con = $this->db;

                    $queryCat = "SELECT id,name FROM categories";
                    $resultCat = oci_parse($con, $queryCat);
                    oci_execute($resultCat);
                    while ($rowCat = oci_fetch_assoc($resultCat)) {
                        $Categories[] = $rowCat;
                    }

                    $response = $this->view->render($response, 'signup.mustache', array('plan_data' => $planData, 'plan_dataJ' => json_encode($array_data), 'planid' => $planid, 'plan_books' => $count, 'planname' => $planname, 'planid' => $planid, "total" => $plans['plan_duration']['totalAmount_with_convenience_fee'], 'reading_fee' => $plans['plan_duration']['reading_fee_for_term'], 'reg_fee' => $item['web_signup_plan']['registration_fee'], 'sec_deposit' => $item['web_signup_plan']['security_deposit'], 'months' => $monthsArray, 'book' => $books, 'month' => $months, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider, 'namePlan' => $namePlan, 'monthTagText' => $monthTagText,'cat'=>$Categories));
                    return $response;

                }
            }
        }
    }


})->setName('signup');

$app->get('/newArrivals', function (Request $request, Response $response) {

//    $raw_data = curlFunction('8990/api/v1/new_arrivals.json');
//    $data = json_decode($raw_data);

    $raw_data = curlFunctionEs('/getNewArrivalTitles');
    $data = json_decode($raw_data);
    $array = presentIds();
    $wishlist = wishlistIds();
    echo json_encode(array("data" => $data, 'ids' => (array)$array, 'wishlist' => (array)$wishlist));

});

$app->get('/getMostRead', function (Request $request, Response $response) {
//    $con = $this->db;
//    $query = "SELECT * FROM TEMP_MOSTREAD";
//    $result = oci_parse($con, $query);
//    oci_execute($result);
//    while ($row = oci_fetch_assoc($result)) {
//        $final_data[] = $row;
//    }

    $raw_data = curlFunctionEs('/getTopTitles');
    $data = json_decode($raw_data);
    $array = presentIds();
    $wishlist = wishlistIds();
    echo json_encode(array("data" => $data, 'ids' => (array)$array, 'wishlist' => (array)$wishlist));
});

$app->get('/getAuthor', function (Request $request, Response $response) {
//    $con = $this->db;
//    $query = "SELECT author_id,author_name,description  FROM fn_author_details WHERE rownum<=20";
//    $result = oci_parse($con, $query);
//    oci_execute($result);
//    while ($row = oci_fetch_assoc($result)) {
//        $final_data[] = $row;
//    }


    $raw_data = curlFunctionEs('/getPopularAuthors');
    $data = json_decode($raw_data);

    echo json_encode(array('data' => $data));
});

$app->get('/getPlan', function (Request $request, Response $response) {

//    $raw_data = curlFunction('8990/api/v1/get_all_plans.json');
//    $data = json_decode($raw_data);
//    $data = $data->result;
//
//    $data = json_decode(json_encode($data), True);
//
//    $temp_array = array();
//    foreach ($data as &$v) {
//
//        if (!isset($temp_array[$v['web_signup_plan']['promo_code']]))
//            $temp_array[$v['web_signup_plan']['promo_code']] =& $v;
//    }
//
//    $array = array_values($temp_array);

    $con = $this->db;
//    if(isset($_SESSION['branchID']))
//    {
//        $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 and FOR_VIRTUAL = 0";
//
//    }
//    else{
//        $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 and FOR_VIRTUAL = 1";
//
//    }
    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 AND FOR_VIRTUAL = 1";

    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $data[] = $row;
    }


    echo json_encode($data);

});

$app->get('/updateWishlist', function (Request $request, Response $response, $args) {
    $titleid = $_GET['id'];
    $membership_no = $_SESSION['membership_no'];
    if ($membership_no == "" && empty($membership_no) || !isset($_SESSION['membership_no'])) {
        return json_encode("failure");
    }
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("wishlists/create.json?email=$email&membership_no=$membership_no&api_key=$api_key&title_id=$titleid");
    echo $result;
});

$app->get('/getCitiesAndState', function (Request $request, Response $response) {
    $con = $this->db;

    $query_city = "SELECT cityid,cityname FROM jbprod.city";
    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $city[] = $row;
    }

    $query_state = "SELECT stateid,statename FROM jbprod.state";
    $result_state = oci_parse($con, $query_state);
    oci_execute($result_state);
    while ($row = oci_fetch_assoc($result_state)) {
        $state[] = $row;
    }

    $final_data[] = array('city' => $city, 'state' => $state);

    echo json_encode($final_data);

});

function valData($data)
{
    if (isset($data) || !empty($data)) {
        return $data;
    } else {
        return '';
    }
}

$app->post('/insertSignup', function (Request $request, Response $response) {
    $con = $this->db;
    $data = $request->getParsedBody();

    $data_new = json_decode($data['signup_data']);
    parse_str($data_new, $output);
//    echo json_encode($output);
    $first_name = valData($output['firstname']);
    $last_name = valData($output['lastname']);
    $address = valData($output['address']);
    $dob = valData($output['dob']);
    $gender = valData($output['gender']);
    $city = valData($output['city']);
    $state = valData($output['state']);
    $zip = valData($output['zip']);
    $email = valData($output['email']);
    $mobile = valData($output['mobile']);
    $password = valData($output['password']);
    $plan_id = valData($output['plan_id']);
    $duration = valData($output['duration']);
    $coupon_code = valData($output['coupon_code']);
    $gift_card_no = valData($output['gift_card']);
    $pin = valData($output['gift_card_pin']);
    $referal = valData($output['referral_code']);

//    echo $dob;
    $dob_new = explode('-', $dob);

    $amnt_data = curlFunction("web_signups/compute.json?plan_id=$plan_id&membership_duration=$duration&coupon_code=$coupon_code&gift_card_no=$gift_card_no&pin=$pin");
//    $total_amnt = $amnt_data['total_amount'];
//    $redeemed_amnt = $amnt_data['redeemed_amount'];
//    $sub_total = $amnt_data['sub_total'];
//    $delivery_fee = $amnt_data['delivery_fee'];
//    $discount = $amnt_data['discount'];

    $response_data = json_decode($amnt_data);
    $data = $response_data->result;
    $total_amnt = $data->total_amount;
    $redeemed_amnt = $data->redeemed_amount;
    $sub_total = $data->sub_total;
    $delivery_fee = $data->delivery_fee;
    $discount = $data->discount;


    $raw_data = curlFunction("web_signup_create.json?city_id=$city&branch_id=1008&email=$email&gender=$gender&dob_year=$dob_new[2]&dob_month=$dob_new[1]&dob_day=$dob_new[0]&first_name=$first_name&last_name=$last_name&address=$address&pincode=$zip&primary_phone=$mobile&alternate_phone=$mobile&referred_by=$referal&about_justbooks_source=11&plan_id=$plan_id&membership_duration=$duration&delivery_option=1&coupon_code=$coupon_code&gift_card_no=$gift_card_no&pin=$pin&total_amount=$total_amnt&redeemed_amount=$redeemed_amnt&qc_flag=false&sub_total=$sub_total&discount=$discount&convenience_fee=0&payment_mode=card&delivery_fees=$delivery_fee&coupon_id=$coupon_code&password=$password&password_confirmation=$password");
    $response_data = json_decode($raw_data);
    $data = $response_data->result;
    if ($response_data->success == true) {
        $data = json_decode(json_encode($data), True);
        $_SESSION['order_number'] = $data['transaction']['transaction']['order_number'];
        $_SESSION['amount'] = $data['transaction']['transaction']['amount'];
//        echo json_encode(array("success"=>true,'order'=>$data['transaction']['transaction']['order_number'],'amount'=>$data['transaction']['transaction']['amount']));
        echo json_encode($response_data);
        die;
    } else {
        echo json_encode($response_data);
    }


});

$app->post('/couponValidate', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $planid = $data['planid'];
    $coupon = $data['coupon'];
    $months = $data['months'];
    $result = curlFunction("apply_coupon.json?plan_id=$planid&coupon_code=$coupon&months=$months");
    echo $result;
});

$app->post('/giftcardValidate', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $gift_card = $data['gift_card'];
    $gift_card_pin = $data['gift_card_pin'];
    $amnt = $data['total_amnt'];
    $result = curlFunction("apply_gift_card.json?gift_card_no=$gift_card&pin=$gift_card_pin&total_amount=$amnt");
    echo $result;
});

$app->get('/getWishList', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $mail = $_SESSION['email'];
    $result = curlFunction("wishlists.json?email=$mail&membership_no=$membership_no&api_key=$api_key");
    $wishlist = wishlistIds();
    $array = presentIds();

    echo json_encode(array('data' => (array)json_decode($result), 'wishlist' => $wishlist,'ids'=>$array));
});

$app->post('/removeWishList', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $membership_no = $_SESSION['membership_no'];
    $titleid = $data['titleid'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
//    $result = curlFunction("wishlists/destroy.json?email=$email&membership_no=$membership_no&api_key=$api_key&id=$titleid");
    $result = curlFunctionEs("/removeWishlist?membership_no=$membership_no&title_id=$titleid");
    echo json_encode($result);
});

$app->get('/getOrderList', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("pending_delivery_order.json?email=$email&membership_no=$membership_no&api_key=$api_key");
    $wishlist = wishlistIds();
    echo json_encode(array('data' => (array)json_decode($result), 'wishlist' => $wishlist));
});

$app->get('/getCurrentReading', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("books_at_home.json?membership_no=$membership_no&api_key=$api_key&email=$email");
    $wishlist = wishlistIds();
    echo json_encode(array('data' => (array)json_decode($result), 'wishlist' => $wishlist));
});

$app->post('/placePickup', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $rental_id = $data['rental_id'];
    $title = $data['title'];
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("orders/place_pickup.json?email=$email&membership_no=$membership_no&api_key=$api_key&rental_id=$rental_id&title_id=$title");
    echo $result;
});

$app->get('/getPickupList', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("pending_pickup_order.json?email=$email&membership_no=$membership_no&api_key=$api_key");
    $wishlist = wishlistIds();
    echo json_encode(array('data' => (array)json_decode($result), 'wishlist' => $wishlist));
});

$app->post('/cancelOrder', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $id = $data['id'];
    $cancelId = $data['cancelId'];

    $idName = '';
    if (strlen($id) > 10) {
        $idName = 'rental_id';
        $status = 'pickup';
    } else {
        $idName = 'order_id';
        $status = 'delivery';
    }
    $email = $_SESSION['email'];
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("orders/order_cancel.json?email=$email&membership_no=$membership_no&api_key=$api_key&$idName=$cancelId&title_id=$id&order_status=$status");
    echo $result;
});

$app->get('/getMyProfile', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("pending_pickup_order.json?membership_no=$membership_no&api_key=$api_key");
    echo $result;
});

$app->get('/getSubscription', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $mail = $_SESSION['email'];
    $result = curlFunction("subscription_details.json?membership_no=$membership_no&api_key=$api_key&email=$mail");
    $final_result['curent_plan'] = json_decode($result, true);
    $email = $_SESSION['email'];
    $result1 = curlFunction("get_change_plan_terms.json?email=$email&membercard=$membership_no&for_mobile=true");
    $plan_data = json_decode($result1);
    $data = $plan_data->result;
    $data = json_decode(json_encode($data), True);
    $promoArray = [];
    foreach ($data as $plan) {
        array_push($promoArray, $plan['change_plan_detail']['promo_code']);
    }


    foreach ($data as &$v) {

        if (!isset($temp_array_main[$v['change_plan_detail']['promo_code']]))
            $temp_array_main[$v['change_plan_detail']['promo_code']] =& $v;
    }

    $array_data = array_values($temp_array_main);

    $terms = curlFunction("get_renewal_terms.json?email=$email&membercard=$membership_no");
    $final_result['change_plan'] = $array_data;
    $termData = json_decode($terms, true);
    $main = array();
    foreach ($termData['result'] as $data) {
        $main[] = array("months" => $data['renewal_month']['term_description'], 'fee' => $data['renewal_month']['renewal_amount'], 'term' => $data['renewal_month']['signup_months']);
    }

    $final_result['terms'] = $main;


    echo json_encode($final_result);
});

$app->post('/addWishlist', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $title_id =
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("subscription_details.json?membership_no=$membership_no&api_key=$api_key");
    echo $result;
});

$app->get('/placeOrder', function (Request $request, Response $response, $args) {
    $titleid = $_GET['id'];
    $membership_no = $_SESSION['membership_no'];
    if ($membership_no == "" && empty($membership_no) || !isset($_SESSION['membership_no'])) {
        return json_encode("failure");
    }
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("orders/place_delivery.json?email=$email&membership_no=$membership_no&api_key=$api_key&title_id=$titleid");
    echo $result;
});


$app->get('/login/{username}/{password}', function (Request $request, Response $response, $args) {
    $username = $args['username'];
    $password = $args['password'];
    $result = curlFunction("sessions_email.json?email=$username&password=$password");
    if (json_decode($result)->success == true) {
        $authToken = json_decode($result)->auth_token;
        $_SESSION['api_key'] = $authToken;
        $data = json_decode($result)->result;
        $arr = json_decode($data, TRUE);
        $_SESSION['username'] = $username;
        $_SESSION['uniqueId'] = uniqid();
        $_SESSION['membership_no'] = $arr[0]['membership_no'];
        $branchID = $arr[0]['branch_id'];
        $branchID = (int)substr($branchID, 0, strpos($branchID, '-'));
        $_SESSION['branchID'] = $branchID;
        $_SESSION['email'] = $arr[0]['email'];
        $_SESSION['first_name'] = $arr[0]['first_name'];
        echo json_encode(array('name' => ucfirst($arr[0]['first_name'])));
        die;
    } else {
        echo false;
        die;
    }

});


$app->post('/cancelPickup', function (Request $request, Response $response, $args) {
    $id = $_POST['id'];
    $titleId = $_POST['title'];
    $membership = $_SESSION['membership_no'];
    $email = $_SESSION['email'];
    $api_key = $_SESSION['api_key'];
//    echo "8990/api/v1/orders/order_cancel.json?email=$email&api_key=$api_key&membership_no=$membership&order_status=pickup&order_id=$id&title_id=$titleId";
//    die;
    $result = curlFunction("orders/order_cancel.json?email=$email&api_key=$api_key&membership_no=$membership&order_status=pickup&order_id=$id&title_id=$titleId");
    echo $result;


});


$app->get('/loginValidate', function (Request $request, Response $response, $args) {
    if (isset($_SESSION['username'])) {
        echo json_encode(array("name" => ucfirst($_SESSION['first_name'])));
        die;
    }

    echo "failure";
    die;

});


$app->get('/change_plan', function (Request $request, Response $response, $args) {
    $allGetVars = $request->getQueryParams();

    $membership = $_SESSION['membership_no'];
    $email = $_SESSION['email'];
    $api_key = $_SESSION['api_key'];
    $books = $allGetVars['books'];
    $months = $allGetVars['months'];
    $planname = $allGetVars['planname'];

    $con = $this->db;
//    if(isset($_SESSION['branchID']))
//    {
//        $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 and FOR_VIRTUAL = 0  and promo= '$planname'";
//
//    }
//    else{
//        $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 and FOR_VIRTUAL = 1  and promo= '$planname'";
//
//    }

//    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE ACTIVE = 1 and FOR_VIRTUAL = 1  and promo= '$planname'";
//
//
////    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE active = 1 and rownum<4 and promo= '$planname'";
//    $result_city = oci_parse($con, $query_city);
//    oci_execute($result_city);
//    while ($row = oci_fetch_assoc($result_city)) {
//        $planData[] = $row;
//    }
//    echo json_encode($planData);die;
    $plan_data_curl = curlFunction('get_change_plan_terms.json?email=' . $email . '&membercard=' . $membership . '&for_mobile=true');
    $plan_data = json_decode($plan_data_curl);
    $data = $plan_data->result;


    $data = json_decode(json_encode($data), True);
    $temp_array_main = array();
    foreach ($data as &$v) {

        if (!isset($temp_array_main[$v['change_plan_detail']['promo_code']]))
            $temp_array_main[$v['change_plan_detail']['promo_code']] =& $v;
    }

    $array_data = array_values($temp_array_main);


    $temp_array = array();
    foreach ($data as $v) {
        if (strtoupper($v['change_plan_detail']['promo_code']) === strtoupper($planname) && $v['change_plan_detail']['books'] === (int)$books) {

            $planid = $v['change_plan_detail']['plan_id'];
        }

    }

    foreach ($data as $v) {
        if (strtoupper($v['change_plan_detail']['promo_code']) === strtoupper($planname)) {
            array_push($temp_array, $v);
        }

    }


    $array = array_values($temp_array);


    $count = [];
    foreach ($array as $item) {


        array_push($count, (int)$item['change_plan_detail']['books']);


    }
    $count = array_values(array_unique((array)$count, SORT_REGULAR));
    sort($count);


    $monthsArray = [];
    foreach ($array as $item) {
        if ($item['change_plan_detail']['books'] == $books) {
            foreach ($item['change_plan_detail']['plan_durations'] as $plans) {

                array_push($monthsArray, $plans['plan_duration']['change_plan_months']);

            }
        }
    }
    $monthsArray = array_values(array_unique($monthsArray));
    sort($monthsArray);

    foreach ($array as $item) {
        if ($item['change_plan_detail']['books'] == $books) {
            foreach ($item['change_plan_detail']['plan_durations'] as $plans) {
                if ($plans['plan_duration']['change_plan_months'] == $months) {
                    if (isset($_SESSION['username'])) {
                        $flag = 1;
                        $slider = 0;
                        $name = $_SESSION['first_name'];
                    } else {
                        $flag = 0;
                        $slider = 1;
                        $name = "";
                    }


                    $con = $this->db;

                    $queryCat = "SELECT id,name FROM categories";
                    $resultCat = oci_parse($con, $queryCat);
                    oci_execute($resultCat);
                    while ($rowCat = oci_fetch_assoc($resultCat)) {
                        $Categories[] = $rowCat;
                    }

                    $response = $this->view->render($response, 'change_plan.mustache', array('plan_data' => strtoupper($planname), 'plan_dataJ' => json_encode($array_data), 'planid' => $planid, 'plan_books' => $count, 'planname' => $planname, 'planid' => $planid, "available_balance" => $item['change_plan_detail']['available_balance'], 'balance_due' => $item['change_plan_detail']['balance_due'], 'reading_fee' => $item['change_plan_detail']['reading_fee'], 'totalAMount' => $plans['plan_duration']['payable_amount'], 'months' => $monthsArray, 'book' => $books, 'month' => $months, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));
                    return $response;

                }
            }
        }
    }
})->add($authenticate);


$app->get('/getPlanYears', function (Request $request, Response $response, $args) {
    $book = $_GET['book'];
    $planname = $_GET['planname'];

//    if(isset($_SESSION['branchID']))
//    {
//        $branch_id=$_SESSION['branchID'];
//        $plan_data_curl = curlFunction('get_all_plans.json?branch_id='.$branch_id);
//
//    }
//    else{
//        $plan_data_curl = curlFunction('get_all_plans.json');
//
//    }
    $plan_data_curl = curlFunction('get_all_plans.json');

    $plan_data = json_decode($plan_data_curl);
    $data = $plan_data->result;

    $data = json_decode(json_encode($data), True);


    $temp_array = array();
    foreach ($data as $v) {
        if ($v['web_signup_plan']['promo_code'] === $planname) {
            array_push($temp_array, $v);
        }

    }

    $array = array_values($temp_array);
    $count = [];
    foreach ($array as $item) {
        if ($item['web_signup_plan']['books'] == $book) {
            $monthTag = $item['web_signup_plan']['frequency'];
            if ($monthTag == 'Y') {
                $monthTagText = " year(s)";
            } else {
                $monthTagText = " month(s)";

            }
            $planId = $item['web_signup_plan']['coupon_id'];

            if (count($item['web_signup_plan']['plan_durations']) > 1) {
                foreach ($item['web_signup_plan']['plan_durations'] as $plans) {
                    array_push($count, $plans['plan_duration']['signup_months']);
                }
            } else {
                echo json_encode(array('planID' => $planId, "status" => "1st", "total" => $item['web_signup_plan']['plan_durations'][0]['plan_duration']['totalAmount_with_convenience_fee'], 'reading_fee' => $item['web_signup_plan']['plan_durations'][0]['plan_duration']['reading_fee_for_term'], 'reg_fee' => $item['web_signup_plan']['registration_fee'], 'sec_deposit' => $item['web_signup_plan']['security_deposit'], 'month' => $item['web_signup_plan']['plan_durations'][0]['plan_duration']['signup_months'], 'monthTag' => $monthTagText));
                die;
            }
        }
    }


    echo json_encode(array('data' => array_unique($count), 'status' => '2nd', 'planID' => $planId, 'monthTag' => $monthTagText));
});


$app->get('/saveSession', function (Request $request, Response $response) {

    $orderNumber = $_GET['orderNumber'];
    $amount = $_GET['amount'];
    $_SESSION['order_number'] = $orderNumber;
    $_SESSION['amount'] = $amount;
    echo json_encode("success");
    die;

});


$app->get('/renewView', function (Request $request, Response $response) {

    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }

    $response = $this->view->render($response, 'renew.mustache', array('flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));
    return $response;


});


$app->get('/getSessions', function (Request $request, Response $response) {

    $member = $_SESSION['membership_no'];
    $email = $_SESSION['email'];
    echo json_encode(array('email' => $email, 'session' => $member));


});

$app->get('/insertLog', function (Request $request, Response $response) {

    $type = $_GET['type'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    $ip = $_SERVER['REMOTE_ADDR'];
    $referer = $_SERVER['HTTP_REFERER'];
    if (isset($_SESSION['uniqueId'])) {
        $uId = $_SESSION['uniqueId'];
    } else {
        $uId = uniqid();
        $_SESSION['uniqueId'] = $uId;
    }
    if (isset($_SESSION['username'])) {
        $userId = $_SESSION['username'];
    } else {
        $userId = "";
    }
    $con = $this->db;
    $query = "insert into memp.logs (UNIQUE_ID,USERAGENT,IPADDRESS,MAC_ADDRESS,MAKE,MODEL,ACTION_TYPE,APP_TYPE,REFERRER,DEVICE_OS,USER_ID,CREATED_AT) values('$uId','$userAgent','$ip','$ip','','','$type','Website','$referer','$userAgent','$userId',sysdate) ";
    $compiled = oci_parse($con, $query);
    oci_execute($compiled);
    echo json_encode("success");


});


//Admin Procedures


$app->get('/logout/', function (Request $request, Response $response) {
    session_destroy();
    return $response->withRedirect('/');

});


$app->get('/adminLogin/', function (Request $request, Response $response) {
    $response = $this->view->render($response, 'login.mustache');
    return $response;
});


$app->post('/login_validate', function (Request $request, Response $response) {
//    $con = $this->db;
    $data = $request->getParsedBody();
    $username = $data['username'];
    $password = $data['password'];
    if ($username != "" && $password != "") {
        $_SESSION['adminUser'] = $username;
        if ($username == "jbweb_admin" && $password == "admin_website") {
            return $response->withRedirect('/AdminHome/');
        } else {
            $response = $this->view->render($response, 'login.mustache');
            return $response;
        }


    } else {
        $response = $this->view->render($response, 'login.mustache');
        return $response;
    }
});


$app->get('/AdminHome/', function (Request $request, Response $response) {

    return $this->view->render($response, 'view.mustache');

})->add($adminAuthenticate);


$app->post('/updateURL/', function (Request $request, Response $response) {
    $con = $this->db;

    $url = $_POST['url'];
    $query = "update website_parameters set ADDRESS = '$url'  where id = 1 ";
    $compiled = oci_parse($con, $query);
    oci_execute($compiled);
    echo json_encode("success");

});

$app->post('/file_Upload/', function (Request $request, Response $response) {

    $option = $_POST['select'];
    if ($option == 'IMAGE_URL_1') {
        $url_option = 'ACTION_1';
    }
    if ($option == 'IMAGE_URL_2') {
        $url_option = 'ACTION_2';
    }
    if ($option == 'IMAGE_URL_3') {
        $url_option = 'ACTION_3';
    }
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

    $uploadOk = 1;
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
    if (isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if ($check !== false) {
            echo "File is an image - " . $check["mime"] . ".";
            $uploadOk = 1;
        } else {
            echo "File is not an image.";
            $uploadOk = 0;
        }
    }
// Check if file already exists
    if (file_exists($target_file)) {
        echo "Sorry, file already exists.";
        $uploadOk = 0;
    }
// Check file size
    if ($_FILES["fileToUpload"]["size"] > 500000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }
// Allow certain file formats
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif"
    ) {
        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        $uploadOk = 0;
    }
// Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            $con = $this->db;
            $url = $_POST['url'];
            $query = "update website_parameters set $option = '$target_file',$url_option = '$url'  where id = 1 ";
            $compiled = oci_parse($con, $query);
            oci_execute($compiled);
            echo "The file " . basename($_FILES["fileToUpload"]["name"]) . " has been uploaded.";

            return $response->withRedirect('/AdminHome/');


        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
});


$app->post('/insertPushNotification', function (Request $request, Response $response) {
    echo "fd";
    die;
    $memberId = $request->getParsedBody()['member_id'];
    $pushId = $request->getParsedBody()['push_id'];
    if (!isset($request->getParsedBody()['member_id']) || $request->getParsedBody()['member_id'] == '') {
        return json_encode(array('status' => 'error', 'code' => 0, 'message' => "Member ID is missing"));
    }


    if (!isset($request->getParsedBody()['push_id']) || $request->getParsedBody()['push_id'] == '') {
        return json_encode(array('status' => 'error', 'code' => 0, 'message' => "Sender ID is missing"));
    }


    $con = $this->db;
    $query = "select * from PUSH_NOTIFICATION_TABLE where MEMBER_ID = '$memberId'";
    $result = oci_parse($con, $query);
    oci_execute($result);
    while ($row = oci_fetch_assoc($result)) {
        $final_data[] = $row;
    };
    if (!empty($final_data) && $final_data != 0 && $final_data == null || count($final_data) == 0) {
        $query = "insert into PUSH_NOTIFICATION_TABLE (MEMBER_ID,PUSHNOTIFICATIONID) values ('$memberId','$pushId')";
        $compiled = oci_parse($con, $query);
        oci_execute($compiled);
        return json_encode(array('status' => 'success', 'code' => 1, 'message' => "Successfully added"));

    }

    $query = "update PUSH_NOTIFICATION_TABLE set PUSHNOTIFICATIONID = '$pushId' where MEMBER_ID = '$memberId'";
    $compiled = oci_parse($con, $query);
    oci_execute($compiled);
    return json_encode(array('status' => 'success', 'code' => 1, 'message' => "Successfully updated"));


});


$app->get('/sendPush', function (Request $request, Response $response) {
#API access key from Google API's Console
//    define('API_ACCESS_KEY', 'AIzaSyDxLuyoM-T8v5SKF2z_5cUKNjhTOJ90_PI');
//    $registrationIds ="cKWaI8ESqig:APA91bG3s_SxKVzRWctLjslrAeOqxkqSlUxJTzFVLrtFa6HfhdpynfCulfQuyqm4OPX5K3OcapxkKfU3geq-wFJj8vKVz-VYPGtVIRSZjgE4yVgmF-ooyHoXRpTD42emtPzZjcx4tZFh";
//#prep the bundle
//    $msg = array
//    (
//        'body' => 'Body  Of Notification',
//        'title' => 'Title Of Notification',
//        'id' => 24323,
//        'action' => 'Navigation'
//    );
//    $fields = array
//    (
//        'to' => (string)$registrationIds,
//        'notification' => $msg
//    );
//
//
//    $headers = array
//    (
//        'Authorization: key=' . API_ACCESS_KEY,
//        'Content-Type: application/json'
//    );
//#Send Reponse To FireBase Server
//    $ch = curl_init();
//    curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
//    curl_setopt($ch, CURLOPT_POST, true);
//    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
//    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
//    $result = curl_exec($ch);
//    curl_close($ch);
//#Echo Result Of FireBase Server
//    echo $result;
    $data = array('Title' => 'Just Books', 'Body' => 'A harmless test body', 'Id' => 666, 'Action' => 'Navigation', 'Image' => null, 'Author' => null, 'uId' => rand());
    $target = array('cKWaI8ESqig:APA91bG3s_SxKVzRWctLjslrAeOqxkqSlUxJTzFVLrtFa6HfhdpynfCulfQuyqm4OPX5K3OcapxkKfU3geq-wFJj8vKVz-VYPGtVIRSZjgE4yVgmF-ooyHoXRpTD42emtPzZjcx4tZFh');

    $url = 'https://fcm.googleapis.com/fcm/send';
//api_key available in Firebase Console -> Project Settings -> CLOUD MESSAGING -> Server key
    $server_key = 'AIzaSyDxLuyoM-T8v5SKF2z_5cUKNjhTOJ90_PI';

    $fields = array();
    $fields['data'] = $data;
    if (is_array($target)) {
        $fields['registration_ids'] = $target;
    } else {
        $fields['to'] = $target;
    }
//header with content_type api key
    $headers = array(
        'Content-Type:application/json',
        'Authorization:key=' . $server_key
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    $result = curl_exec($ch);
    if ($result === FALSE) {
        die('FCM Send Error: ' . curl_error($ch));
    }
    curl_close($ch);
    return $result;


});


$app->get('/faq', function (Request $request, Response $response) {
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }

    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }
    return $this->view->render($response, 'faq.mustache', array('flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));

});


$app->get('/contactUs', function (Request $request, Response $response) {
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }

    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }
    return $this->view->render($response, 'contactUs.mustache', array('flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));

});
$app->get('/franchise', function (Request $request, Response $response) {

    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }
    return $this->view->render($response, 'franchise.mustache', array('flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));

});
$app->get('/checkAvailability', function (Request $request, Response $response) {
    $titleid = $_GET['id'];
    $mail = $_SESSION['email'];
    $membership_no = $_SESSION['membership_no'];
    if ($membership_no == "" && empty($membership_no) || !isset($_SESSION['membership_no'])) {
        echo json_encode(array("success" => 'failure'));
        die;
    }
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("check_title_availability.json?email=$mail&api_key=$api_key&membership_no=$membership_no&title_id=$titleid");
    echo $result;
});

$app->post('/submitReview', function (Request $request, Response $response) {
    $stars = $_POST['rate'];
    $title = $_POST['title'];
    $review = $_POST['review'];
    $mail = $_SESSION['email'];
    $membership_no = $_SESSION['membership_no'];
    if ($membership_no == "" && empty($membership_no) || !isset($_SESSION['membership_no'])) {
        return json_encode("failure");
    }
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("rate_title.json?email=$mail&api_key=$api_key&membership_no=$membership_no&stars=$stars&title_id=$title");
    $resultReview = curlFunction("reviews/create.json?email=$mail&api_key=$api_key&membership_no=$membership_no&title_id=$title&header=hello&content=$review");
    echo json_encode(array('result' => $result, 'review' => $resultReview));
});


$app->get('/rentalHistory', function (Request $request, Response $response) {
    $mail = $_SESSION['email'];
    $membership_no = $_SESSION['membership_no'];
    if ($membership_no == "" && empty($membership_no) || !isset($_SESSION['membership_no'])) {
        return json_encode("failure");
    }
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("rental_history.json?email=$mail&api_key=$api_key&membership_no=$membership_no");
//    echo "rental_history.json?email=$mail&api_key=$api_key&membership_no=$membership_no";die;
    $wishlist = wishlistIds();
    echo json_encode(array('data' => (array)json_decode($result), 'wishlist' => $wishlist));
});


$app->get('/adminCardsView', function (Request $request, Response $response) {
    $con = $this->db;
    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE active = 1 ";
    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $data[] = $row;
    }

    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }
    return $this->view->render($response, 'adminCards.mustache', array('data' => $data, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));

})->add($adminAuthenticate);


$app->post('/deleteBID', function (Request $request, Response $response) {
    $id = $_POST['id'];
    $con = $this->db;
    $query = "update memp.FN_HOME_PAGE_PLANS set active=0 where id =$id";
    $compiled = oci_parse($con, $query);
    oci_execute($compiled);
    echo json_encode("success");


})->add($adminAuthenticate);


$app->post('/deleteBlog', function (Request $request, Response $response) {
    $id = $_POST['id'];
    $con = $this->db;
    $query = "update memp.ADMIN_BLOG_PARAMETERS set active=0 where id =$id";
    $compiled = oci_parse($con, $query);
    $res = oci_execute($compiled);
    if ($res) {
        echo json_encode("success");
        die;
    }
    echo json_encode("failure");


})->add($adminAuthenticate);


$app->post('/submitAdminOffer', function (Request $request, Response $response) {
    $name = $_POST['name'];
    $category = $_POST['category'];
    $registraiton = (int)$_POST['registration'];
    $reading = (int)$_POST['reading'];
    $security = (int)$_POST['security'];
    $books = (int)$_POST['books'];
    $months = (int)$_POST['months'];
    $promo = $_POST['promo'];
    $montTag = $_POST['monthTag'];
    $bookTag = $_POST['bookTag'];
    $suitable = $_POST['suitable'];
    $virtual = (int)$_POST['virtual'];


    $con = $this->db;
    $query = "insert into  memp.FN_HOME_PAGE_PLANS(PLAN_NAME,CATEGORY,REGISTRATION_FEE,READING_FEE,SECURITY_DEPOSIT,NO_OF_BOOKS,NO_OF_MONTHS,PROMO,MONTH_TAG,BOOK_TAG,SUITABLE_TAG,FOR_VIRTUAL) values ('$name','$category',$registraiton,$reading,$security,$books,$months,'$promo','$montTag','$bookTag','$suitable',$virtual) ";
    $compiled = oci_parse($con, $query);
    $res = oci_execute($compiled);
    if ($res) {
        echo json_encode("success");
        die;
    }
    echo json_encode("failure");
    die;


})->add($adminAuthenticate);


$app->post('/submitAdminBlog', function (Request $request, Response $response) {
    $name = $_POST['name'];
    $image = $_POST['image'];
    $description = $_POST['description'];
    $link = $_POST['link'];


    $con = $this->db;
    $query = "insert into  memp.ADMIN_BLOG_PARAMETERS(NAME,DESCRIPTION,IMAGE,LINK) values ('$name','$description','$image','$link') ";

    $compiled = oci_parse($con, $query);
    $res = oci_execute($compiled);
    if ($res) {
        echo json_encode("success");
        die;
    }
    echo json_encode("failure");
    die;


})->add($adminAuthenticate);

$app->get('/adminBlogs', function (Request $request, Response $response) {
    $con = $this->db;
    $query_city = "SELECT *  FROM memp.ADMIN_BLOG_PARAMETERS WHERE active = 1";
    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $data[] = $row;
    }
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }
    return $this->view->render($response, 'adminBlog.mustache', array('data' => $data, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));


})->add($adminAuthenticate);


$app->get('/getBlog', function (Request $request, Response $response) {
    $con = $this->db;
    $query = "SELECT *  FROM memp.ADMIN_BLOG_PARAMETERS WHERE active = 1 AND rownum <4 ORDER BY id DESC ";
    $result = oci_parse($con, $query);
    oci_execute($result);
    while ($row = oci_fetch_assoc($result)) {
        $final_data[] = $row;
    }
    echo json_encode($final_data);
});
$app->post('/updateProfile', function (Request $request, Response $response) {
    $address1 = $_POST['address1'];
    $address2 = $_POST['address2'];
    $address3 = $_POST['address3'];
    $state = $_POST['state'];
    $city = $_POST['city'];
    $zip = $_POST['pin'];
    $email = "";
    $phone = $_POST['phone'];
    $dob = $_POST['dob'];
    $gender = $_POST['gender'];
    $emaill=$_SESSION['email'];
//echo "/updateMemberProfile?email=$email&membership_no=$membership_no&address1=$address1&address2=$address2&address3=$address3&city=$city&state=$state&pincode=$zip&mphone=$phone";die;
    $api_key = $_SESSION['api_key'];
    $membership_no = $_SESSION['membership_no'];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL_ES . "/updateMemberProfile?");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "email=$email&membership_no=$membership_no&address1=$address1&address2=$address2&address3=$address3&city=$city&state=$state&pincode=$zip&mphone=$phone&dob=$dob&gender=$gender");
    $raw_data = curl_exec($ch);
    curl_close($ch);
//    if(json_decode($raw_data) == "Updated")
//    {
//        $_SESSION['email']=$email;
//    }
    echo json_encode(json_decode($raw_data));


//    $result = curlFunctionEs("/updateMemberProfile?email=$email&membership_no=$membership_no&address1=$address1&address2=$address2&address3=$address3&city=$city&state=$state&pincode=$zip&mphone=$phone");
//    echo json_decode(json_encode($result));
});


$app->get('/break', function (Request $request, Response $response) {

    $mail = $_SESSION['email'];
    $membership_no = $_SESSION['membership_no'];
    $result = curlFunction("get_change_plan_terms.json?email=$mail&membercard=$membership_no&for_mobile=true");
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }
    return $this->view->render($response, 'break.mustache', array('data' => $result, 'flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));


});

//$app->get('/getRelatedAuthors', function(Request $request, Response $response) {
//    $author_id = $request->getQueryParams()['author_id'];
//    $con = $this->db;
//    $query = "select * from fn
//
//_author_details_new where author_id=2780";
//    $result = oci_parse($con, $query);
//    oci_execute($result);
//    $query_construct_category = '';
//    $query_construct_laguage = '';
//    $final_query = '';
//    while ($row = oci_fetch_assoc($result)) {
//        $category = $row['AUTHOR_CATEGORY'];
//        $category_array = explode(',',$category);
//        foreach($category_array as $cat){
//            $final_category = explode('@',$cat);
//            if(!empty($final_category[0]))
//                $query_construct_category .= "author_category like '%".$final_category[0]."%' or ";
//        }
//
//        $language = $row['AUTHOR_LANGUAGES'];
//        $language_array = explode(',',$language);
//        foreach($language_array as $lan){
//            $final_language = explode('@',$lan);
//            if(!empty($final_language[0]))
//                $query_construct_laguage .= "author_languages like '%".$final_language[0]."%' or ";
//        }
//        if($query_construct_laguage == '' && $query_construct_category != '') {
//            $query_construct_category = rtrim($query_construct_category, ' or');
//        }elseif($query_construct_laguage != '' && $query_construct_category == ''){
//            $query_construct_laguage = rtrim($query_construct_laguage, ' or');
//        }elseif($query_construct_laguage != '' && $query_construct_category != ''){
//            $query_construct_laguage = rtrim($query_construct_laguage, ' or');
//        }elseif($query_construct_laguage == '' && $query_construct_category == ''){
//            $query_construct_category = " author_category like '%General%'";
//        }
//    }
//    $final_query = "select fad.author_id,fad.author_name,'https://s3.amazonaws.com/prod.justbooksclc.com/authors/'||fad.author_id||'.jpg' as image, fad.description from fn_author_details fad join fn_author_details_new fadn on fad.author_id=fadn.author_id where ".$query_construct_category.$query_construct_laguage;
//
//    $final_result = oci_parse($con, $final_query);
//    oci_execute($final_result);
//    while ($row = oci_fetch_assoc($final_result)) {
//        $final_data_Result[] = $row;
//    }
//    echo json_encode($final_data_Result);
//
//});

function presentIds()
{
    $array = [];
    if (isset($_SESSION['username'])) {

        $membership_no = $_SESSION['membership_no'];
        $api_key = $_SESSION['api_key'];
        $email = $_SESSION['email'];
        $result = curlFunction("books_at_home.json?membership_no=$membership_no&api_key=$api_key&email=$email");
        $plan_data = json_decode($result);
        $currentData = $plan_data->result;


        $currentData = json_decode(json_encode($currentData), True);

        foreach ($currentData as $current) {

            array_push($array, $current['id']);
        }
        $result = curlFunction("pending_delivery_order.json?email=$email&membership_no=$membership_no&api_key=$api_key");
        $orderData = json_decode($result);
        $OrderData = $orderData->result;


        $OrderData = json_decode(json_encode($OrderData), True);

        foreach ($OrderData as $order) {

            array_push($array, $order['id']);
        }
        $result = curlFunction("pending_pickup_order.json?email=$email&membership_no=$membership_no&api_key=$api_key");
        $pickupData = json_decode($result);
        $OrderData = $OrderData->result;


        $OrderData = json_decode(json_encode($OrderData), True);

        foreach ($OrderData as $order) {

            array_push($array, $order['id']);
        }
        $result = curlFunction("wishlists.json?email=$email&membership_no=$membership_no&api_key=$api_key");
        $pickupData = json_decode($result);
        $OrderData = $OrderData->result;


        $OrderData = json_decode(json_encode($OrderData), True);

        foreach ($OrderData as $order) {

            array_push($array, $order['id']);
        }
    }
    return $array;
}

function wishlistIds()
{
    $array = [];
    if (isset($_SESSION['username'])) {

        $membership_no = $_SESSION['membership_no'];
        $api_key = $_SESSION['api_key'];
        $email = $_SESSION['email'];

        $result = curlFunction("wishlists.json?email=$email&membership_no=$membership_no&api_key=$api_key");
        $wishlist = json_decode($result);
        $wishlist = $wishlist->result;


        $wishlist = json_decode(json_encode($wishlist), True);

        foreach ($wishlist as $wish) {

            array_push($array, $wish['id']);
        }
    }
    return $array;
}

$app->get('/getRelatedBooks', function (Request $request, Response $response) {

    $params = $request->getQueryParams();
    $id = $params['id'];
    $raw_data = curlFunctionEs("/getRelatedTitles?title_id=$id");
    $data = json_decode($raw_data);
    $array = presentIds();
    $wishlist = wishlistIds();
    echo json_encode(array("data" => $data, 'ids' => (array)$array, 'wishlist' => (array)$wishlist));

});
$app->get('/getAuthorRelatedBooks', function (Request $request, Response $response) {

    $params = $request->getQueryParams();
    $id = $params['id'];
    $resultRelated = curlFunction("author_info.json?id=$id");
    $plan_data = json_decode($resultRelated);
    $data = $plan_data->result;

    $data = json_decode(json_encode($data), True);
    $titles = $data['titles'];


    $array = presentIds();
    $wishlist = wishlistIds();


    echo json_encode(array("data" => $titles, 'ids' => (array)$array, 'wishlist' => (array)$wishlist));

});
$app->get('/getRelatedAuthors', function (Request $request, Response $response) {

    $params = $request->getQueryParams();
    $id = $params['id'];

//    $con = $this->db;
//    $query = "SELECT * FROM fn_author_details_new WHERE author_id=2780";
//    $result = oci_parse($con, $query);
//    oci_execute($result);
//    $query_construct_category = '';
//    $query_construct_laguage = '';
//    $final_query = '';
//    while ($row = oci_fetch_assoc($result)) {
//        $category = $row['AUTHOR_CATEGORY'];
//        $category_array = explode(',', $category);
//        foreach ($category_array as $cat) {
//            $final_category = explode('@', $cat);
//            if (!empty($final_category[0]))
//                $query_construct_category .= "author_category like '%" . $final_category[0] . "%' or ";
//        }
//
//        $language = $row['AUTHOR_LANGUAGES'];
//        $language_array = explode(',', $language);
//        foreach ($language_array as $lan) {
//            $final_language = explode('@', $lan);
//            if (!empty($final_language[0]))
//                $query_construct_laguage .= "author_languages like '%" . $final_language[0] . "%' or ";
//        }
//        if ($query_construct_laguage == '' && $query_construct_category != '') {
//            $query_construct_category = rtrim($query_construct_category, ' or');
//        } elseif ($query_construct_laguage != '' && $query_construct_category == '') {
//            $query_construct_laguage = rtrim($query_construct_laguage, ' or');
//        } elseif ($query_construct_laguage != '' && $query_construct_category != '') {
//            $query_construct_laguage = rtrim($query_construct_laguage, ' or');
//        } elseif ($query_construct_laguage == '' && $query_construct_category == '') {
//            $query_construct_category = " author_category like '%General%'";
//        }
//    }
//    $final_query = "SELECT fad.author_id,fad.author_name,'https://s3.amazonaws.com/prod.justbooksclc.com/authors/'||fad.author_id||'.jpg' AS image , fad.description FROM fn_author_details fad JOIN fn_author_details_new fadn ON fad.author_id=fadn.author_id WHERE " . $query_construct_category . $query_construct_laguage;
//
//    $final_result = oci_parse($con, $final_query);
//    oci_execute($final_result);
//    while ($row = oci_fetch_assoc($final_result)) {
//        $final_data_Result[] = $row;
//    }

    $raw_data = curlFunctionEs("/getRelatedAuthors?author_id=$id");
    $data = json_decode($raw_data);

    echo json_encode(array('related' => $data));

});

$app->get('/getRecommendedBooks', function (Request $request, Response $response) {

    $params = $request->getQueryParams();
    $id = $params['id'];
    $raw_data = curlFunctionEs("/getRelatedTitles?title_id=$id");
    $data = json_decode($raw_data);
    $array = presentIds();
    $wishlist = wishlistIds();
    echo json_encode(array("data" => $data, 'ids' => (array)$array, 'wishlist' => (array)$wishlist));

});
$app->get('/getStatusDelivery', function (Request $request, Response $response) {

    $params = $request->getQueryParams();
    $id = $params['id'];

    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $raw_data = curlFunction("get_order_details_for_mobile.json?email=$email&api_key=$api_key&membership_no=$membership_no&order_id=$id");
    $data = json_decode($raw_data);
    $data = $data->result;
    $data = json_decode(json_encode($data), True);
    if (count($data['order_details']) == 0) {
        echo json_encode("Tracking info not available !");
        die;
    }
    echo json_encode($data['order_details'][0]['message']);
    die;


});

$app->get('/getShelfRecommendedBooks', function (Request $request, Response $response) {

    $params = $request->getQueryParams();
    $id = $params['id'];
    $raw_data = curlFunctionEs("/getRecommendedTitles?membership_no=A000255");
    $data = json_decode($raw_data);
    $array = presentIds();
    $wishlist = wishlistIds();
    echo json_encode(array("data" => $data, 'ids' => (array)$array, 'wishlist' => (array)$wishlist));

});
$app->get('/sendResetMail', function (Request $request, Response $response) {
//    $token = bin2hex(openssl_random_pseudo_bytes(30));
//    $email = $params['email'];
//
//    $con = $this->db;
//    $query = "insert into memp.FORGOT_PASSWORD_TOKEN(EMAIL,AUTH_TOKEN,TIME_STAMP,FLAG) values('$email','$token',CURRENT_TIMESTAMP,0) ";
//    $compiled = oci_parse($con, $query);
//    $result=oci_execute($compiled);
//    if($result)
//    {
//echo json_encode("success");die;
//    echo json_encode("failure");die;
    $params = $request->getQueryParams();

    $email = $params['email'];

    $result = curlFunction("send_reset_email?email=$email");
    $data = json_decode($result);
    if ($data->success == true) {
        echo json_encode("success");
        die;
    }
    echo json_encode("failure");
    die;


});
$app->get('/verifyResetMail', function (Request $request, Response $response) {
    $params = $request->getQueryParams();
    $email = $params['email'];
    $passwrod = $params['password'];
    $result = curlFunction("reset_pwd?email=$email&password=$passwrod");
    $data = json_decode($result);
    if ($data->success == true) {
        echo json_encode("success");
        die;
    }
    echo json_encode("failure");
    die;

    echo json_encode($data->success);
    die;


});

$app->get('/locations', function (Request $request, Response $response) {
    $con = $this->db;
    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS WHERE active = 1";
    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $data[] = $row;
    }

    return $this->view->render($response, 'adminLocations.mustache', array('data' => $data));


});


$app->get('/users/password/edit', function (Request $request, Response $response) {
    $email = $_GET['email'];
    $token = $_GET['reset_password_token'];

    $con = $this->db;
    $query_city = "SELECT *  FROM webstore.users where  reset_password_token = '$token'";
    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $data[] = $row;
    }
    if (count($data) != 0 && $data != []) {
        $formFlag = 1;
        $errorFlag = 0;

    } else {
        $formFlag = 0;
        $errorFlag = 1;
    }

    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }

    $response = $this->view->render($response, 'forget-password.mustache', array('email' => $email, 'div' => $formFlag, 'error' => $errorFlag,'cat'=>$Categories,'flag' => (int)$flag, 'slider' => (int)$slider, 'name' => $name));
    return $response;

});


$app->get('/store-locator', function (Request $request, Response $response) {
    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }

    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }

    return $this->view->render($response, 'store_location.mustache', array('flag' => (int)$flag, 'slider' => (int)$slider, 'name' => $name,'cat'=>$Categories));


});

$app->get('/storeLocator', function (Request $request, Response $response) {
    $params = $request->getQueryParams();
    $lat = (float)$params['lat'];
    $long = (float)$params['lng'];
    $con = $this->db;
//    $query = "select branch_id id ,a.distance,jb.branchname name,branchaddress address,a.latitude,a.longitude,jb.EMAILID,jb.CONTACTNUMBERS from (SELECT branch_id, name, latitude, longitude,
//			((ACOS(SIN($lat * 3.14/ 180) * SIN(latitude * 3.14 / 180) + COS($lat * 3.14 / 180) * COS(latitude * 3.14 / 180) * COS(($long - longitude) * 3.14 / 180)) * 180 / 3.14) * 60 * 1.1515) AS distance
//		FROM JBGPS.V_STORELOCATIONS) a join memp.jb_branches jb on jb.id=a.branch_id
//		where a.distance <= 5
//		ORDER BY distance ASC";
    $query = "select branchid id,a.distance,jb.branchname name,branchaddress address,a.latitude,a.longitude,jb.EMAILID,jb.CONTACTNUMBERS 
from (

SELECT branchid, branchname,latitude,longitude,
             ( 3979 * acos( cos( radians($lat) ) * cos( RADIANS( latitude ) ) 
* cos( radians( longitude ) - radians($long) ) + sin( radians($lat) ) * sin(radians(latitude)) ) )
 AS distance  
      FROM JBGPS.branchlocations
      
      ) a join memp.jb_branches jb on jb.id=a.branchid where operational = 'Y'
        and a.distance <= 5 
        ORDER BY distance ASC
";
    $result_city = oci_parse($con, $query);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $row['distance_kilometers'] = round($row['DISTANCE']) . ' km';
        $row['distance_miles'] = round($row['DISTANCE'] / 1.6) . ' mi';
        $row['latitude'] = $row['LATITUDE'];
        $row['longitude'] = $row['LONGITUDE'];
        $row['name'] = $row['NAME'];
        if ($row['CONTACTNUMBERS'] == null) {
            $cont = "";
        } else {
            $cont = "<br> Phone - " . $row['CONTACTNUMBERS'];
        }

        $row['address'] = $row['ADDRESS'] . "<br> Contact: " . $row['EMAILID'] . $cont;
        $row['id'] = $row['ID'];


        $data[] = $row;
    }
    echo json_encode($data);


});
$app->post('/insertFranchisee', function (Request $request, Response $response) {
    $params = $request->getQueryParams();
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $city = $_POST['city'];
    $ticket = rand();
    $description = $_POST['description'];
    $con = $this->db;
    $query = "insert into webstore.franchise_enquiries (NAME,EMAIL,CONTACT_NO,TICKET,CREATED_AT,UPDATED_AT,CITY,LOCATION) values('$fname$lname','$email','$phone','$ticket',sysdate,sysdate,'$city','$city') ";
    $compiled = oci_parse($con, $query);
    $res = oci_execute($compiled);
    if ($res) {
        echo json_encode("success");
        die;
    }
    echo json_encode("failure");
    die;

});
$app->get('/getChangePlanYears', function (Request $request, Response $response) {
    $params = $request->getQueryParams();
    $book = $_GET['book'];
    $planname = $_GET['planname'];
    $membership = $_SESSION['membership_no'];
    $email = $_SESSION['email'];
    $api_key = $_SESSION['api_key'];
    $plan_data_curl = curlFunction('get_change_plan_terms.json?email=' . $email . '&membercard=' . $membership . '&for_mobile=true');

    $plan_data = json_decode($plan_data_curl);
    $data = $plan_data->result;

    $data = json_decode(json_encode($data), True);


    $temp_array = array();
    foreach ($data as $v) {
        if (strtoupper($v['change_plan_detail']['promo_code']) === strtoupper($planname)) {
            array_push($temp_array, $v);
        }

    }
    $array = array_values($temp_array);
    $count = [];
    foreach ($array as $item) {
        if ($item['change_plan_detail']['books'] == $book) {
            $monthTag = $item['change_plan_detail']['frequency'];
            if ($monthTag == 'Y') {
                $monthTagText = " year(s)";
            } else {
                $monthTagText = " month(s)";

            }
            $planId = $item['change_plan_detail']['plan_id'];
            if (count($item['change_plan_detail']['plan_durations']) > 1) {
                foreach ($item['change_plan_detail']['plan_durations'] as $plans) {

                    array_push($count, $plans['plan_duration']['change_plan_months']);
                }
                sort($count);
            } else {
                echo json_encode(array('planID' => $planId, "status" => "1st", "total" => $item['change_plan_detail']['plan_durations'][0]['plan_duration']['payable_amount'], "available_balance" => $item['change_plan_detail']['available_balance'], 'balance_due' => $item['change_plan_detail']['balance_due'], 'reading_fee' => $item['change_plan_detail']['reading_fee'], 'totalAMount' => $plans['plan_duration']['payable_amount'], 'monthTag' => $monthTagText));
                die;
            }
        }
    }


    echo json_encode(array('data' => array_unique($count), 'status' => '2nd', 'planID' => $planId, 'monthTag' => $monthTagText));


});
$app->get('/getProfileDetails', function (Request $request, Response $response) {

    $membership = $_SESSION['membership_no'];

    $plan_data_curl = curlFunctionEs('/getMemberProfile?membership_no=' . $membership);

    $plan_data = json_decode($plan_data_curl);
    echo json_encode(array('data' => $plan_data));


});
$app->get('/terms-and-condition', function (Request $request, Response $response) {

    if (isset($_SESSION['username'])) {
        $flag = 1;
        $slider = 0;
        $name = $_SESSION['first_name'];
    } else {
        $flag = 0;
        $slider = 1;
        $name = "";
    }
    $con = $this->db;

    $queryCat = "SELECT id,name FROM categories";
    $resultCat = oci_parse($con, $queryCat);
    oci_execute($resultCat);
    while ($rowCat = oci_fetch_assoc($resultCat)) {
        $Categories[] = $rowCat;
    }

    return $this->view->render($response, 'terms.mustache', array('flag' => (int)$flag, 'name' => $name, 'slider' => $slider,'cat'=>$Categories));


});
$app->get('/renewal_payment', function (Request $request, Response $response) {
    $term = $_GET['term'];
    $delivery_fees = $_GET['delivery_fees'];
    $coupon_code = $_GET['coupon_code'];
    $gift_card_no = $_GET['gift_card_no'];

    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];

    $raw_data = curlFunction("renewal_payment.json?email=$email&membercard=$membership_no&term=$term&delivery_option=null&delivery_fees=$delivery_fees&coupon_code=$coupon_code&gift_card_no=$gift_card_no&pin=null");
    $data = json_decode($raw_data);
    echo json_encode($data);


});
$app->get('/confirm_renewal', function (Request $request, Response $response) {

    $payable_amount = $_GET['payable_amount'];
    $convenience_fee = $_GET['convenience_fee'];
    $renewal_payment_type = $_GET['renewal_payment_type'];
    $plan_id = $_GET['plan_id'];
    $card_number = $_GET['card_number'];
    $member_id = $_GET['member_id'];
    $delivery_fees = $_GET['delivery_fees'];
    $delivery_fees_dormant = $_GET['delivery_fees_dormant'];
    $delivery_option = $_GET['delivery_option'];
    $term = $_GET['term'];
    $member_branch_id = $_GET['member_branch_id'];
    $overdue_adjustment = $_GET['overdue_adjustment'];
    $reward_points = $_GET['reward_points'];
    $gift_card_no = $_GET['gift_card_no'];
    $qc_flag = $_GET['qc_flag'];
    $redeemed_amount = $_GET['redeemed_amount'];
    $pin = $_GET['pin'];


    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
//echo "confirm_renewal.json?email=$email&membercard=$membership_no&payable_amount=$payable_amount&convenience_fee=$convenience_fee&renewal_payment_type=$renewal_payment_type&plan_id=$plan_id&card_number=$card_number&member_id=$member_id&delivery_fees=$delivery_fees&delivery_fees_dormant=$delivery_fees_dormant&delivery_option=$delivery_option&term=$term&member_branch_id=$member_branch_id&overdue_adjustment=$overdue_adjustment&reward_points=$reward_points&gift_card_no=$gift_card_no&qc_flag=$qc_flag&redeemed_amount=$redeemed_amount&pin=$pin&coupon_no=null&coupon_id=null&coupon_amount=null";die;
    $raw_data = curlFunction("confirm_renewal.json?email=$email&membercard=$membership_no&payable_amount=$payable_amount&convenience_fee=$convenience_fee&renewal_payment_type=$renewal_payment_type&plan_id=$plan_id&card_number=$card_number&member_id=$member_id&delivery_fees=$delivery_fees&delivery_fees_dormant=$delivery_fees_dormant&delivery_option=$delivery_option&term=$term&member_branch_id=$member_branch_id&overdue_adjustment=$overdue_adjustment&reward_points=$reward_points&gift_card_no=$gift_card_no&qc_flag=$qc_flag&redeemed_amount=$redeemed_amount&pin=$pin&coupon_no=null&coupon_id=null&coupon_amount=null");
    $data = json_decode($raw_data);
    echo json_encode($data);


});
$app->get('/sh_payment', function (Request $request, Response $response) {

    $holiday_start_date = $_GET['holiday_start_date'];
    $no_of_months = $_GET['no_of_months'];


    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $raw_data = curlFunction("sh_payment.json?email=$email&membercard=$membership_no&no_of_months=$no_of_months&holiday_start_date=$holiday_start_date");
    $data = json_decode($raw_data);
    echo json_encode($data);


});
$app->get('/confirm_sh', function (Request $request, Response $response) {

    $holiday_start_date = $_GET['holiday_start_date'];
    $no_of_months = $_GET['no_of_months'];
    $holiday_end_date = $_GET['holiday_end_date'];
    $paid_amount = $_GET['paid_amount'];
    $payable_amount = $_GET['payable_amount'];


    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $raw_data = curlFunction("confirm_sh.json?email=$email&membercard=$membership_no&no_of_months=$no_of_months&holiday_start_date=$holiday_start_date&created_in=810&holiday_end_date=$holiday_end_date&paid_amount=$paid_amount&payable_amount=$payable_amount");
    $data = json_decode($raw_data);
    echo json_encode($data);


});
$app->get('/change_plan_payment', function (Request $request, Response $response) {

    $term = $_GET['term'];
    $new_plan_id = $_GET['new_plan_id'];
    $coupon_code = $_GET['coupon_code'];
    $gift_card_no = $_GET['gift_card_no'];


    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $raw_data = curlFunction("change_plan_payment.json?email=$email&membercard=$membership_no&term=$term&new_plan_id=$new_plan_id&coupon_code=$coupon_code&gift_card_no=$gift_card_no&pin=null");
    $data = json_decode($raw_data);
    echo json_encode($data);


});
$app->get('/confirm_change_plan', function (Request $request, Response $response) {

    $member_id = $_GET['member_id'];
    $membership_no = $_GET['membership_no'];
    $amount=$_GET['amount'];
    $old_plan_id = $_GET['old_plan_id'];
    $new_plan_id = $_GET['new_plan_id'];
    $created_in = $_GET['created_in'];
    $member_branch_id = $_GET['member_branch_id'];
    $old_expiry_date = $_GET['old_expiry_date'];
    $term = $_GET['term'];
    $new_expiry_date = $_GET['new_expiry_date'];
    $old_security_deposit = $_GET['old_security_deposit'];
    $new_security_deposit = $_GET['new_security_deposit'];
    $old_reading_fee_balance = $_GET['old_reading_fee_balance'];
    $convenience_fee = $_GET['convenience_fee'];
    $delivery_fees = $_GET['delivery_fees'];
    $delivery_option = $_GET['delivery_option'];
    $overdue_adjustment = $_GET['overdue_adjustment'];
    $adjustment_narration = $_GET['adjustment_narration'];
    $reward_points = $_GET['reward_points'];
    $coupon_no = $_GET['coupon_no'];
    $coupon_id = $_GET['coupon_id'];
    $coupon_amount = $_GET['coupon_amount'];
    $change_plan_payment_type = $_GET['change_plan_payment_type'];



    $membership_no_s = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $raw_data = curlFunction("confirm_change_plan.json?email=$email&membercard=$membership_no_s&member_id=$member_id&membership_no=$membership_no&amount=$amount&old_plan_id=$old_plan_id&new_plan_id=$new_plan_id&term=$term&created_in=$created_in&member_branch_id=$member_branch_id&old_expiry_date=$old_expiry_date&new_expiry_date=$new_expiry_date&old_security_deposit=$old_security_deposit&new_security_deposit=$new_security_deposit&old_reading_fee_balance=$old_reading_fee_balance&convenience_fee=$convenience_fee&delivery_fees=$delivery_fees&delivery_option=$delivery_option&overdue_adjustment=$overdue_adjustment&adjustment_narration=$adjustment_narration&reward_points=$reward_points&coupon_no=$coupon_no&coupon_id=$coupon_id&coupon_amount=$coupon_amount&change_plan_payment_type=$change_plan_payment_type");
    $data = json_decode($raw_data);
    echo json_encode($data);


});$app->get('/noAmountBreak', function (Request $request, Response $response) {

    $order = $_GET['order'];


    $orderid = $_POST['ORDERID'];
    $url = "http://justbooksclc.com/api/v1/paytm_payment_callback.json?orderid=$order&response_code=01&payment_type=Paytm&branch_id=810";
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
        echo "success";
    }
    else{
        echo $_POST['RESPMSG'];
    }


});

$app->run();

?>
