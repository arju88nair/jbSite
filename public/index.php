<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../includes/functions.php';
define('API_URL', 'http://staging.justbooksclc.com:');
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

$app->get('/', function (Request $request, Response $response) {

    $con = $this->db;
    $query = "SELECT * FROM website_parameters";
    $result = oci_parse($con, $query);
    oci_execute($result);
    while ($row = oci_fetch_assoc($result)) {
        $final_data[] = $row;
    }
    $image = $final_data[0]['IMAGE_URL_1'];
    $address = $final_data[0]['ADDRESS'];;
    $response = $this->view->render($response, 'home.mustache', array('loggedIn' => "true", 'session' => $_SESSION['username'], 'image' => $image, 'address' => $address));
    return $response;
});

$app->get('/book_details/{titleid}', function (Request $request, Response $response, $args) {
    $titleid = $args['titleid'];
    $result1 = curlFunction("8990/api/v1/title_info.json?title_id=$titleid");
    $result1 = str_replace("NaN", 0, $result1);
//    echo json_encode($result1);die;
    $result = json_decode($result1, true)['result'];
//    echo json_encode($result);die;
//    echo json_decode($result1, true);die;
//    print_r(json_encode(json_decode($result1, true))) ;die;
//    $new_result = json_decode($result, true);
//    print_r($new_result['related_books'][0]);die;
//    $authorid = json_decode($result1)->authorid;
//    $result = curlFunction("8990/api/v1/author_info.json?id=$authorid");

    $response = $this->view->render($response, 'book_details.mustache', array('data' => $result, 'titleid' => $titleid));
    return $response;
});

$app->get('/author_details/{authorid}', function (Request $request, Response $response, $args) {
    $authorid = $args['authorid'];
    $con = $this->db;
    $final_data = [];
    $query = "select id,name,'http://cdn2.justbooksclc.com/authors/'||id||'.jpg' as image from authors where id='$authorid'";
    $result = oci_parse($con, $query);
    oci_execute($result);
    while ($row = oci_fetch_assoc($result)) {
        $final_data[] = $row;
    }

    $response = $this->view->render($response, 'author_details.mustache', array('data' => $final_data));
    return $response;
});

$app->get('/search', function (Request $request, Response $response) {

    $query = $_GET['q'];
    $result = curlFunction("8990/api/v1/search.json?q=$query&page=1&per_page=20");
    $count = count(json_decode($result)->result);
    $response = $this->view->render($response, 'search.mustache', array('data' => json_decode($result, true), 'query' => ucfirst($query), 'count' => $count));
    return $response;

});

$app->get('/shelf', function (Request $request, Response $response) {
    $response = $this->view->render($response, 'shelf.mustache');
    return $response;
})->add($authenticate);

$app->get('/signup/{planid}', function (Request $request, Response $response, $args) {
    $planid = $args['planid'];
    return $planid;
    $con = $this->db;

//    $query = "select p.name,p.security_deposit,p.registration_fee,p.reading_fee,p.magazine_fee,p.num_books,p.num_magazines,r.membership_months
//      from plans p join rebates r on p.rebate_category=r.category where p.id=$planid";
//    $result = oci_parse($con, $query);
//    oci_execute($result);
//    while ($row = oci_fetch_assoc($result)) {
//        $final_data[] = $row;
//    }


    $response = $this->view->render($response, 'signup.mustache', array('data' => "sd"));
    return $response;
});

$app->get('/getPlanFees', function (Request $request, Response $response) {
    $allGetVars = $request->getQueryParams();
    $planname = $allGetVars['planname'];
    $book = $allGetVars['book'];
    $months = $allGetVars['months'];

    $plan_data_curl = curlFunction('8990/api/v1/get_all_plans.json');
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

$app->get('/signup', function (Request $request, Response $response) {
    $allGetVars = $request->getQueryParams();

    $con = $this->db;
    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS where active = 1";
    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $planData[] = $row;
    }








    $plan_data_curl = curlFunction('8990/api/v1/get_all_plans.json');
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
    foreach ($data as $v) {
        if (strtoupper($v['web_signup_plan']['promo_code']) === strtoupper($planname) && $v['web_signup_plan']['books'] === (int)$books) {
            $planid=$v['web_signup_plan']['plan_id'];
        }

    }


    foreach ($data as $v) {
        if (strtoupper($v['web_signup_plan']['promo_code']) === strtoupper($planname) ) {
            array_push($temp_array, $v);
        }

    }

    $array = array_values($temp_array);


    $count = [];
    foreach ($array as $item) {


        array_push($count, $item['web_signup_plan']['books']);


    }

    $count = array_unique($count);
//    echo json_encode($count);die;
$monthsArray=[];
    foreach ($array as $item) {
        if ($item['web_signup_plan']['books'] == $books) {
            foreach ($item['web_signup_plan']['plan_durations'] as $plans) {

                                    array_push($monthsArray,$plans['plan_duration']['signup_months']);

            }
        }
    }
    foreach ($array as $item) {
        if ($item['web_signup_plan']['books'] == $books) {
            foreach ($item['web_signup_plan']['plan_durations'] as $plans) {

                if ($plans['plan_duration']['signup_months'] == $months) {

                    $response = $this->view->render($response, 'signup.mustache', array('plan_data' =>$planData,'plan_dataJ' => json_encode($array_data), 'planid' => $planid, 'plan_books' => $count, 'planname' => $planname, 'planid' => $planid,"total" => $plans['plan_duration']['totalAmount_with_convenience_fee'], 'reading_fee' => $plans['plan_duration']['reading_fee_for_term'], 'reg_fee' => $item['web_signup_plan']['registration_fee'], 'sec_deposit' => $item['web_signup_plan']['security_deposit'],'months'=>$monthsArray,'book'=>$books,'month'=>$months));
                    return $response;

                }
            }
        }
    }
    




})->setName('signup');

$app->get('/newArrivals', function (Request $request, Response $response) {

    $raw_data = curlFunction('8990/api/v1/new_arrivals.json');
    $data = json_decode($raw_data);
    echo json_encode($data);

});

$app->get('/getMostRead', function (Request $request, Response $response) {
    $con = $this->db;
    $query = "SELECT * FROM TEMP_MOSTREAD";
    $result = oci_parse($con, $query);
    oci_execute($result);
    while ($row = oci_fetch_assoc($result)) {
        $final_data[] = $row;
    }
    echo json_encode($final_data);
});

$app->get('/getAuthor', function (Request $request, Response $response) {
    $con = $this->db;
    $query = "SELECT * FROM temp_author";
    $result = oci_parse($con, $query);
    oci_execute($result);
    while ($row = oci_fetch_assoc($result)) {
        $final_data[] = $row;
    }
    echo json_encode($final_data);
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
    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS where active = 1";
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
    $result = curlFunction("8990/api/v1/wishlists/create.json?email=$email&membership_no=$membership_no&api_key=$api_key&title_id=$titleid");
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

    $amnt_data = curlFunction("8990/api/v1/web_signups/compute.json?plan_id=$plan_id&membership_duration=$duration&coupon_code=$coupon_code&gift_card_no=$gift_card_no&pin=$pin");
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


    $raw_data = curlFunction("8990/api/v1/web_signup_create.json?city_id=$city&branch_id=1008&email=$email&gender=$gender&dob_year=$dob_new[2]&dob_month=$dob_new[1]&dob_day=$dob_new[0]&first_name=$first_name&last_name=$last_name&address=$address&pincode=$zip&primary_phone=$mobile&alternate_phone=$mobile&referred_by=$referal&about_justbooks_source=11&plan_id=$plan_id&membership_duration=$duration&delivery_option=1&coupon_code=$coupon_code&gift_card_no=$gift_card_no&pin=$pin&total_amount=$total_amnt&redeemed_amount=$redeemed_amnt&qc_flag=false&sub_total=$sub_total&discount=$discount&convenience_fee=0&payment_mode=card&delivery_fees=$delivery_fee&coupon_id=$coupon_code&password=$password&password_confirmation=$password");

    $response_data = json_decode($raw_data);
    $data = $response_data->result;
    if ($response_data->success == true) {
        $data = json_decode(json_encode($data), True);
        $_SESSION['order_number'] = $data['transaction']['transaction']['order_number'];
        $_SESSION['amount'] = $data['transaction']['transaction']['amount'];
        echo json_encode($response_data);

    } else {
        echo json_encode($response_data);
    }


});

$app->post('/couponValidate', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $planid = $data['planid'];
    $coupon = $data['coupon'];
    $months = $data['months'];
    $result = curlFunction("8990/api/v1/apply_coupon.json?plan_id=$planid&coupon_code=$coupon&months=$months");
    echo json_encode($result);
});

$app->post('/giftcardValidate', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $gift_card = $data['gift_card'];
    $gift_card_pin = $data['gift_card_pin'];
    $amnt = $data['total_amnt'];
    $result = curlFunction("8990/api/v1/apply_gift_card.json?gift_card_no=$gift_card&pin=$gift_card_pin&total_amount=$amnt");
    echo json_encode($result);
});

$app->get('/getWishList', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $mail = $_SESSION['email'];
    $result = curlFunction("8990/api/v1/wishlists.json?email=$mail&membership_no=$membership_no&api_key=$api_key");
    echo $result;

});

$app->post('/removeWishList', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $membership_no = $_SESSION['membership_no'];
    $titleid = $data['titleid'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("8990/api/v1/wishlists/destroy.json?email=$email&membership_no=$membership_no&api_key=$api_key&id=$titleid");
    echo json_encode($result);
});

$app->get('/getOrderList', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("8990/api/v1/pending_delivery_order.json?email=$email&membership_no=$membership_no&api_key=$api_key");
    echo $result;
});

$app->get('/getCurrentReading', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("8990/api/v1/books_at_home.json?membership_no=$membership_no&api_key=$api_key&email=$email");
    echo $result;
});

$app->post('/placePickup', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $rental_id = $data['rental_id'];
    $title = $data['title'];
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
    $result = curlFunction("8990/api/v1/orders/place_pickup.json?email=$email&membership_no=$membership_no&api_key=$api_key&rental_id=$rental_id&title_id=$title");
    echo $result;
});

$app->get('/getPickupList', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $email = $_SESSION['email'];
//    echo "8787/api/v3/pending_pickup_order.json?membership_no=$membership_no&api_key=$api_key";
//    die;
    $result = curlFunction("8990/api/v1/pending_pickup_order.json?email=$email&membership_no=$membership_no&api_key=$api_key");
    echo $result;
});

$app->post('/cancelOrder', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $id = $data['id'];
    $cancelId = $data['cancelId'];

    $idName = '';
    if (strlen($id) > 10) {
        $idName = 'rental_id';
        $status='pickup';
    } else {
        $idName = 'order_id';
        $status='delivery';
    }
    $email = $_SESSION['email'];
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
   $result = curlFunction("8990/api/v1/orders/order_cancel.json?email=$email&membership_no=$membership_no&api_key=$api_key&$idName=$cancelId&title_id=$id&order_status=$status");
    echo $result;
});

$app->get('/getMyProfile', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("8787/api/v3/pending_pickup_order.json?membership_no=$membership_no&api_key=$api_key");
    echo $result;
});

$app->get('/getSubscription', function (Request $request, Response $response) {
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $mail = $_SESSION['email'];
        $result = curlFunction("8990/api/v1/subscription_details.json?membership_no=$membership_no&api_key=$api_key&email=$mail");
    $final_result['curent_plan'] = json_decode($result, true);
    $email = $_SESSION['email'];
    $result1 = curlFunction("8990/api/v1/get_change_plan_terms.json?email=$email&membercard=M103604&for_mobile=true");
    $terms=curlFunction("8990/api/v1/get_renewal_terms.json?email=$email&membercard=$membership_no");
    $final_result['change_plan'] = json_decode($result1, true);
    $termData=json_decode($terms,true);
    $main=array();
    foreach ($termData['result'] as $data)
    {
       $main[]=array("months"=>$data['renewal_month']['term_description'],'fee'=>$data['renewal_month']['renewal_amount'],'term'=>$data['renewal_month']['signup_months']);
    }

    $final_result['terms']=$main;



    echo json_encode($final_result);
});

$app->post('/addWishlist', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $title_id =
    $membership_no = $_SESSION['membership_no'];
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("8787/api/v3/subscription_details.json?membership_no=$membership_no&api_key=$api_key");
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
    $result = curlFunction("8990/api/v1/orders/place_delivery.json?email=$email&membership_no=$membership_no&api_key=$api_key&title_id=$titleid");
    echo $result;
});


$app->get('/login/{username}/{password}', function (Request $request, Response $response, $args) {
    $username = $args['username'];
    $password = $args['password'];
    $result = curlFunction("8990/api/v1/sessions_email.json?email=$username&password=$password");
    if (json_decode($result)->success == true) {
        $authToken = json_decode($result)->auth_token;
        $_SESSION['api_key'] = $authToken;
        $data = json_decode($result)->result;
        $arr = json_decode($data, TRUE);
        $_SESSION['username'] = $username;
        $_SESSION['uniqueId'] = uniqid();
        $_SESSION['membership_no'] = $arr[0]['membership_no'];
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
echo "8990/api/v1/orders/order_cancel.json?email=$email&api_key=$api_key&membership_no=$membership&order_status=pickup&order_id=$id&title_id=$titleId";
    $result = curlFunction("8990/api/v1/orders/order_cancel.json?email=$email&api_key=$api_key&membership_no=$membership&order_status=pickup&order_id=$id&title_id=$titleId");
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

    $plan_data_curl = curlFunction('8990/api/v1/get_all_plans.json');
    $plan_data = json_decode($plan_data_curl);
    $data = $plan_data->result;


    $data = json_decode(json_encode($data), True);

    $temp_array_main = array();
    foreach ($data as &$v) {

        if (!isset($temp_array_main[$v['web_signup_plan']['promo_code']]))
            $temp_array_main[$v['web_signup_plan']['promo_code']] =& $v;
    }

    $array_data = array_values($temp_array_main);


    $planid = $allGetVars['id'];
    $planname = $allGetVars['planname'];


    $temp_array = array();
    foreach ($data as $v) {
        if ($v['web_signup_plan']['promo_code'] === $planname) {
            array_push($temp_array, $v);
        }

    }

    $array = array_values($temp_array);


    $count = [];
    foreach ($array as $item) {


        array_push($count, $item['web_signup_plan']['books']);


    }

    $count = array_unique($count);


    $response = $this->view->render($response, 'change_plan.mustache', array('plan_data' => $array_data, 'planid' => $planid, 'plan_books' => $count, 'planname' => $planname, 'planid' => $planid));
    return $response;
})->add($authenticate);


$app->get('/getPlanYears', function (Request $request, Response $response, $args) {
    $book = $_GET['book'];
    $planname = $_GET['planname'];

    $plan_data_curl = curlFunction('8990/api/v1/get_all_plans.json');
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
            $planId = $item['web_signup_plan']['coupon_id'];

            if (count($item['web_signup_plan']['plan_durations']) > 1) {
                foreach ($item['web_signup_plan']['plan_durations'] as $plans) {
                    array_push($count, $plans['plan_duration']['signup_months']);
                }
            } else {
                echo json_encode(array('planID' => $planId, "status" => "1st", "total" => $item['web_signup_plan']['plan_durations'][0]['plan_duration']['totalAmount_with_convenience_fee'], 'reading_fee' => $item['web_signup_plan']['plan_durations'][0]['plan_duration']['reading_fee_for_term'], 'reg_fee' => $item['web_signup_plan']['registration_fee'], 'sec_deposit' => $item['web_signup_plan']['security_deposit'], 'month' => $item['web_signup_plan']['plan_durations'][0]['plan_duration']['signup_months']));
                die;
            }
        }
    }


    echo json_encode(array('data' => array_unique($count), 'status' => '2nd', 'planID' => $planId));
});


$app->get('/test', function (Request $request, Response $response) {
    $response = $this->view->render($response, 'blah.mustache');
    return $response;
});

$app->post('/callback/', function (Request $request, Response $response) {
    $response = $this->view->render($response, 'blah.mustache');
    return $response;
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

    $response = $this->view->render($response, 'renew.mustache');
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
            $query = "update website_parameters set $option = '$target_file'  where id = 1 ";
            $compiled = oci_parse($con, $query);
            oci_execute($compiled);
            return $response->withRedirect('/AdminHome/');


            echo "The file " . basename($_FILES["fileToUpload"]["name"]) . " has been uploaded.";
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
    $data = array('Title' => 'Just Books', 'Body' => 'A harmless test body', 'Id' => 666, 'Action' => 'Navigation', 'Image' => null, 'Author' => null);
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

    return $this->view->render($response, 'faq.mustache');

});


$app->get('/contactUs', function (Request $request, Response $response) {

    return $this->view->render($response, 'contactUs.mustache');

});
$app->get('/franchise', function (Request $request, Response $response) {

    return $this->view->render($response, 'franchise.mustache');

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
    $result = curlFunction("8990/api/v1/check_title_availability.json?email=$mail&api_key=$api_key&membership_no=$membership_no&title_id=$titleid");
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
    $result = curlFunction("8990/api/v1/rate_title.json?email=$mail&api_key=$api_key&membership_no=$membership_no&stars=$stars&title_id=$title");
    $resultReview = curlFunction("8990/api/v1/reviews/create.json?email=$mail&api_key=$api_key&membership_no=$membership_no&title_id=$title&header=hello&content=$review");
    echo json_encode(array('result' => $result, 'review' => $resultReview));
});


$app->get('/rentalHistory', function (Request $request, Response $response) {
    $mail = $_SESSION['email'];
    $membership_no = $_SESSION['membership_no'];
    if ($membership_no == "" && empty($membership_no) || !isset($_SESSION['membership_no'])) {
        return json_encode("failure");
    }
    $api_key = $_SESSION['api_key'];
    $result = curlFunction("8990/api/v1/rental_history.json?email=$mail&api_key=$api_key&membership_no=$membership_no");
    echo $result;
});


$app->get('/adminCardsView', function (Request $request, Response $response) {
    $con = $this->db;
    $query_city = "SELECT *  FROM memp.FN_HOME_PAGE_PLANS where active = 1";
    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $data[] = $row;
    }


    return $this->view->render($response, 'adminCards.mustache', array('data'=>$data));

})->add($adminAuthenticate);



$app->post('/deleteBID', function (Request $request, Response $response) {
    $id=$_POST['id'];
    $con = $this->db;
    $query = "update memp.FN_HOME_PAGE_PLANS set active=0 where id =$id";
    $compiled = oci_parse($con, $query);
    oci_execute($compiled);
    echo json_encode("success");


})->add($adminAuthenticate);



$app->post('/deleteBlog', function (Request $request, Response $response) {
    $id=$_POST['id'];
    $con = $this->db;
    $query = "update memp.ADMIN_BLOG_PARAMETERS set active=0 where id =$id";
    $compiled = oci_parse($con, $query);
    oci_execute($compiled);
    echo json_encode("success");


})->add($adminAuthenticate);


$app->post('/submitAdminOffer', function (Request $request, Response $response) {
    $name=$_POST['name'];
    $category=$_POST['category'];
    $registraiton=(int)$_POST['registration'];
    $reading=(int)$_POST['reading'];
    $security=(int)$_POST['security'];
    $books=(int)$_POST['books'];
    $months=(int)$_POST['months'];
    $promo=$_POST['promo'];



    $con = $this->db;
    $query = "insert into  memp.FN_HOME_PAGE_PLANS(PLAN_NAME,CATEGORY,REGISTRATION_FEE,READING_FEE,SECURITY_DEPOSIT,NO_OF_BOOKS,NO_OF_MONTHS,PROMO) values ('$name','$category',$registraiton,$reading,$security,$books,$months,'$promo') ";
    $compiled = oci_parse($con, $query);
    oci_execute($compiled);
    echo json_encode("success");


})->add($adminAuthenticate);



$app->post('/submitAdminBlog', function (Request $request, Response $response) {
    $name=$_POST['name'];
    $image=$_POST['image'];
    $description=$_POST['description'];
    $link=$_POST['link'];




    $con = $this->db;
    $query = "insert into  memp.ADMIN_BLOG_PARAMETERS(NAME,DESCRIPTION,IMAGE,LINK) values ('$name','$description','$image','$link') ";

    $compiled = oci_parse($con, $query);
    oci_execute($compiled);
    echo json_encode("success");


})->add($adminAuthenticate);

$app->get('/adminBlogs', function (Request $request, Response $response) {
    $con = $this->db;
    $query_city = "SELECT *  FROM memp.ADMIN_BLOG_PARAMETERS where active = 1";
    $result_city = oci_parse($con, $query_city);
    oci_execute($result_city);
    while ($row = oci_fetch_assoc($result_city)) {
        $data[] = $row;
    }

    return $this->view->render($response, 'adminBlog.mustache', array('data'=>$data));


})->add($adminAuthenticate);


$app->get('/getBlog', function (Request $request, Response $response) {
    $con = $this->db;
    $query = "SELECT *  FROM memp.ADMIN_BLOG_PARAMETERS where active = 1";
    $result = oci_parse($con, $query);
    oci_execute($result);
    while ($row = oci_fetch_assoc($result)) {
        $final_data[] = $row;
    }
    echo json_encode($final_data);
});
$app->post('/updateProfile', function (Request $request, Response $response) {
    $address=$_POST['address'];
    $pincode=$_POST['pincode'];
    $city=$_POST['city'];
    $state=$_POST['state'];
    $phone=$_POST['phone'];
    $mail=$_SESSION['email'];
    $api_key=$_SESSION['api_key'];
    $membership_no=$_SESSION['membership_no'];




    $result = curlFunction("8990/api/v1/update_personal_info.json?email=$mail&api_key=$api_key&membership_no=$membership_no&address1=$address&address2=&address3=&city=$city&state=$state&pincode=$pincode&lphone=$phone");
    echo $result;
});



$app->run();

?>
