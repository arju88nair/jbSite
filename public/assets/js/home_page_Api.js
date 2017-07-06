function getCard(data, visibleCardCount, ids, wishlist) {
    var response = '', items = 0;
    var final_response = '';
    for (var i = 0; i < data.length; i++) {
        items++;
        var active = '';
        if (i == 0) {
            active = "active";
        }

        if (data[i]['_source'].image_url == null) {
            // var img = "../../assets/images/Default_Book_Thumbnail.png";
            var img = "../../assets/images/Default_Book_Thumbnail.png";
        }
        else {
            var img = data[i]['_source'].image_url;
        }

        if (ids.indexOf(parseInt(data[i]['_source'].title_id)) != -1) {
            var text = "Rented";
            action = "";
        }
        else {
            var action = "\'placeOrder(" + data[i]['_source'].title_id + ");\'"

            text = "Rent";
        }


        if (wishlist.indexOf(parseInt(data[i]['_source'].title_id)) != -1) {
            var image = "../../assets/img/Added_WL_Right.png"
            wish = "";
        }
        else {
            image = "../../assets/img/Added_WL_50.png";
            var wish = "\'wishlistAdd(" + data[i]['_source'].title_id + ");\'";
        }


        response += '<div class="col-xs-6 col-sm-2 col-md-2 col-lg-2">' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><a href="/book_details/' + data[i]['_source'].title_id + '/' + data[i]['_source'].title + '"><img src="' + img + '" onerror="this.src=\'../../assets/images/Default_Book_Thumbnail.png\'"></a></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i]['_source'].title + '">' + data[i]['_source'].title + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="fram_btn">' +
            '<a href="javascript:void(0)" class="shortcode_button btn_small btn_type1" title="Rent" onclick=' + action + ' id="rent_' + data[i]['_source'].title_id + '">' + text + '</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick=' + wish + '><img id="wish_' + data[i]['_source'].title_id + '" class="wishlist_btn" src=' + image + ' alt="Smiley face" height="25" width="25"></a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Share"  data-id="' + data[i]['_source'].title_id + '" data-title="' + data[i]['_source'].title + '" data-toggle="modal" data-target="#shareModal"><img  class="share_btn" src=../../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +

            // '<a href="/book_details/' + data[i].id + '" id="' + data[i].id + '" class="tiptip" title="Read">Read</a>' +
            '<div class="clear"></div>' +
            '</div></div></div></div></div>';

        //if( i > 0 && i % 3 == 0){
        if (items == visibleCardCount) {

            final_response += '<div class="item ' + active + '">' + response + '</div>';
            response = "";
            items = 0;
        }

    }
    if (items < visibleCardCount && items > 0) {
        final_response += '<div class="item ' + active + '">' + response + '</div>';
    }
    return final_response;
}


function getCardAuthor(data, visibleCardCount) {
    var response = '', items = 0;

    var final_response = '';
    for (var i = 0; i < data.length; i++) {
        items++;
        var active = '';
        if (i == 0) {
            active = "active";
        }


        response += '<div class="col-xs-6 col-sm-2 col-md-2 col-lg-2">' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><a href="/author_details/' + data[i]['_source'].author_id + '/' + data[i]['_source'].author_name + '"><img src="'+ data[i]['_source'].image_url+ '" onerror="this.src=\'../../assets/img/user.png\'"></a></div>' +
            '<div class="carousel_body_author">' +
            '<div class="carousel_title_author"><h5 title="' + data[i]['_source'].author_name + '">' + data[i]['_source'].author_name + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="text-center">' +
            // '<a href="/author_details/' + data[i].ID + '" id="' + data[i].ID + '" class="shortcode_button btn_small btn_type1" title="Read">Read</a>' +
            '<div class="clear"></div>' +
            '</div>'+
            '</div></div></div></div>';

        //if( i > 0 && i % 3 == 0){
        if (items == visibleCardCount) {

            final_response += '<div class="item item_author ' + active + '">' + response + '</div>';
            response = "";
            items = 0;
        }

    }
    if (items < visibleCardCount && items > 0) {
        final_response += '<div class="item item_author ' + active + '">' + response + '</div>';
    }
    return final_response;
}

$(document).ready(function () {


    // Instantiate the Bootstrap carousel


    // for every slide in carousel, copy the next slide's item in the slide.
    // Do the same for the next, next item.
    $('.multi-item-carousel .item').each(function () {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        if (next.next().length > 0) {
            next.next().children(':first-child').clone().appendTo($(this));
        } else {
            $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
    });


    $.ajax({
        type: "GET",
        url: "/newArrivals",
        success: function (data) {
            $("#frame_new_arr").hide();
            $("#loader").hide();
            data = JSON.parse(data);
            cardData = data['data'];

            var w = window.outerWidth;
            var h = window.outerHeight;
            if(w<750){
                var final_response = getCard(cardData, 2, data['ids'], data['wishlist']);
            }else{
                var final_response = getCard(cardData, 5, data['ids'], data['wishlist']);
            }
            
            $('#newArrivals').append(final_response);
            $('.item').first().addClass('active');
            $("#myCarousel").carousel();

        },

    });



    $.ajax({
        type: "GET",
        url: "/getAuthor",
        success: function (data) {

            $("#frame_authorCarousel1").hide();
            $("#loader").hide();
            data=JSON.parse(data);

             var w = window.outerWidth;
            var h = window.outerHeight;
            if(w<750){
                var final_response = getCardAuthor(data['data'], 2);
            }else{
                var final_response = getCardAuthor(data['data'], 5);
            }


            // var final_response = getCardAuthor(data['data'], 5);

            $('#authorCarousel1').append(final_response);
            $('.item_author').first().addClass('active');
            $("#authorCarousel").carousel();
        },

    });

    $.ajax({
        type: "GET",
        url: "/getPlan",
        success: function (data) {
            $("#frame_membership").hide();
            $("#loader_plan").hide();
            var val = JSON.parse(data);
            ;
            var response = '';
            var i = 0;
            var plans = val;
            var colors = ['block personal fl', 'block professional fl', 'block business fl','block third fl'];
            plans.forEach(function (arr) {
                // response += '<div class="price_item" style="width:33.33%">' +
                //     '<div class="price_item_wrapper">' +
                //     '<div class="price_item_title"><h5>' + arr['PLAN_NAME'].toUpperCase() + '</h5></div>' +
                //     '<div class="item_cost_wrapper" style="background-color: ' + colors[i] + ';">' +
                //     '<div class="price_item_title" style="background-color: ' + colors[i] + '; padding: 10px 10px 10px 10px;"><h4>Reading fee - ₹ ' + Math.round(parseFloat(arr['READING_FEE'])) + ' </h4></div>' +
                //     '</div>' +
                //     '<div class="price_item_text">Number of months - '+ arr['NO_OF_MONTHS'] +' </div>' +
                //     '<div class="price_item_text" id="price_item_text">No of books -   ' + arr['NO_OF_BOOKS'] + '</div>' +
                //     '<div class="price_item_text">R </div>' +
                //     '<div class="price_item_text" id="price_item_text">Security Deposit - ₹ ' + Math.round(parseFloat(arr['SECURITY_DEPOSIT'])) + ' </div>' +
                //     '<div class="price_item_btn" id="btn" style="background-color: ' + colors[i] + '"><a href="/signup?planname=' + arr['PROMO'] + '&books=' + arr['NO_OF_BOOKS'] + '&months=' + arr['NO_OF_MONTHS'] + '">Get It Now !</a></div>' +
                //     '</div></div>';


                var sec_colors = ['#78CFBF', '#3EC6E0', '#E3536C','#7470b9']
                response += '   <div class="block personal fl">' +
                    '<h4 class="title">' + arr['PLAN_NAME'].toUpperCase() + '</h4>' +
                    ' <a href="/signup?planname=' + arr['PROMO'] + '&books=' + arr['NO_OF_BOOKS'] + '&months=' + arr['NO_OF_MONTHS'] + '"><div class="content_pt">' +
                    ' <p class="price"><sup>₹</sup><span> ' + Math.round(parseFloat(arr['READING_FEE'])) + '</span><sub></sub></p>' +
                    '<p class="hint">' + arr['MONTH_TAG'] + '</p></div></a><ul class="features">' +
                    '<li style="color: black;">' + arr['BOOK_TAG'] + '</li><li style="background-color:#666666;padding: 12px;color: white;">' + arr['SUITABLE_TAG'] + '</li><li style="color: black;">Security Deposit - ₹ ' + Math.round(parseFloat(arr['SECURITY_DEPOSIT'])) + ' </li>' +
                    '<li style="color: black;">Registration Fee - ₹ ' + Math.round(parseFloat(arr['REGISTRATION_FEE'])) + '</li></ul><div class="pt-footer">' +
                    '<a href="/signup?planname=' + arr['PROMO'] + '&books=' + arr['NO_OF_BOOKS'] + '&months=' + arr['NO_OF_MONTHS'] + '"><h4>GET IT NOW !</h4></a></div></div>'


                i++;
                if (i >= colors.length) {
                    i = 0;
                }
            })

            $('#plansCard').append(response);
        },

    });

    $.ajax({
        type: "GET",
        url: "/getBlog",
        success: function (data) {
            $("#frame_blog").hide();
            $("#loader_blog").hide();
            data = JSON.parse(data);

            for (var i = 0; i < data.length; i++) {
                $("#blogDiv").append(

                    '<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 ">' +
                    '<div class="img_block wrapped_img"><img style="width: 100%;height: 17em;" src="' + data[i]['IMAGE'] + '" alt="" width="270" height="170"></div>' +
                    '<div class="carousel_body">' +
                    '<div class="carousel_title">' +
                    '<h5  style="margin-top:10px; text-align:left; font-family: \'Playfair Display\'">' + data[i]['NAME'] + '</h5>' +
                    '</div>' +
                    '<div class="carousel_desc">' +
                    '<div class="exc" style="margin-bottom:10px; text-align:left; font-family: \'Playfair Display\'">' + data[i]['DESCRIPTION'] + '</div>' +
                    '</div>' +
                    
                    '<a target="_blank" href="' + data[i]['LINK'] + '" class="shortcode_button btn_small btn_type1">Read More</a>' +
                    '</div>' +
                    '</div>'
                    )
            }

        },
        error: function (err) {
            console.log(err)
        }
    });

});

function wishlistAdd(id) {
    $(".spinner").show();

    $.ajax({
        type: "GET",
        url: "/updateWishlist?id=" + id,
        success: function (data) {
            ;
            $(".spinner").hide();
            if (JSON.parse(data) === "failure") {

                toastr.error('Please sign in to update your wish list');
                $('html, body').animate({
                    scrollTop: $('#membershipPlans').offset().top - 150
                }, 800);
            }
            else {
                $("#wish_" + id).attr("src", "../../assets/img/Added_WL_Right.png")
                toastr.success('Successfully added into your wish list !').css("width","500px");
            }
        },
        error: function (err) {
            console.log(err);
        }

    });
}

function placeOrder(id) {
    $(".spinner").show();
    $.ajax({
        type: "GET",
        url: "/placeOrder?id=" + id,
        success: function (data) {
            ;
            if (JSON.parse(data) === "failure") {
                $(".spinner").hide();

                toastr.error('Please sign in to order the book !');
                $('html, body').animate({
                    scrollTop: $('#membershipPlans').offset().top - 150
                }, 800);
                // $(window).scrollTop($('#membershipPlans').offset().top);

            }
            else {
                $(".spinner").hide();
                data = JSON.parse(data);
                console.log(data['success'])
                if (data['success'] === "false") {
                    toastr.warning(data['errors'])
                } else {
                    $("#rent_" + id).text("Rented")

                    toastr.success('Successfully added !');

                }
            }
        },

    });
}


$(document).ready(function(){
    // on click SignIn Button checks for valid email and all field should be filled



    // on click signup It Hide Login Form and Display Registration Form
    $(".signup").click(function(){

        $(".loginDIv").slideUp("slow", function(){
            $(".login_form_fram_second").slideDown("slow");
        });
    });

    // on click signin It Hide Registration Form and Display Login Form
    $(".signin").click(function(){

        

        $(".login_form_fram_second").slideUp("slow",function(){
            $(".loginDIv").slideDown("slow");
        });
    });

});




function signupClick() {

    var username = $("#username").val();
    if(username == "" || username == 0)
    {
        toastr.error("Please enter an email !");
        return false;
    }

    var password = $("#password").val();
    if(password == "" || username == 0)
    {
        toastr.error("Please enter password !");
        return false;
    }
    $(".spinner").show();

    $.ajax({
        type: "GET",
        url: "/login/" + username + "/" + password + "",
        success: function (data) {
            $(".spinner").hide();

            

            if (data != false) {
                data = JSON.parse(data)
                $("#welcomeId").text(" Welcome " + data['name']);
                $("#userTile").show();
                $(".login_form_fram_one").hide();
                $("#main").hide();
                $("#first").hide();
                $("#shelfButton").show();
                toastr.success('Successfully signed in !');
                localStorage.setItem("flag", true)
                $("#first").hide();
                $("#main").hide();
                logClick("Log in click");

                (function (i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function () {
                            (i[r].q = i[r].q || []).push(arguments)
                        }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

                ga('create', 'UA-93821751-1', 'none');
                ga('send', 'event', 'Clicks', 'Login of user ' + username + '', 'First Screen');

                logClick('Login of user ' + username + '');
                window.location.href = "/shelf";

                return false;
            }
            toastr.error('Wrong credentials, Please try again !');
            $(".spinner").hide();


        },
        error: function (err) {
            $(".spinner").hide();

            // toastr.error('Something went wrong, Please try again !');
            console.log(err.responseText);
            $("#frame_sign_in").hide();
            $("#loader").hide();
        }


    });


}



function forgotPassword()
{

    var email=$("#forgetEmail").val();
    if(email == "" || email == 0)
    {
        toastr.error("Please enter an email !");
        return false;
    }
$(".spinner").show();
    $.ajax({
        type: "GET",
        url: "/sendResetMail?email=" + email,
        success: function (data) {
            $(".spinner").hide();

            console.log(data)
            if (JSON.parse(data) === "success") {
                $(".spinner").hide();

                toastr.success('Please check your mail for further instructions!');

            }
            else {
                $(".spinner").hide();

                toastr.warning("Something went wrong!")


            }
        },

    });

}




