<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../includes/functions.php';

session_start();
$app = init();
//
//$authenticate = function($request, $response, $next){
//    if(!isset($_SESSION['user'])){
//        return $response->withRedirect('/login/');
//    }else{
//        return $next($request, $response);
//    }
//};

$app->get('/',function(Request $request, Response $response){
    $response = $this->view->render($response, 'home.mustache');
    return $response;
});
$app->run();

?>
