function getCard(data, visibleCardCount, ids, wishlist) {
    var response = '', items = 0;
    var final_response = '';
    for (var i = 0; i < data.length; i++) {
        items++;
        var active = '';
        if (i == 0) {
            active = "active";
        }

        if (data[i].isbn == "NOISBN") {
            var img = "http://cdn2.justbooksclc.com/title/0.jpg";
        }
        else {
            var img = data[i].image_url;
        }

        if (ids.indexOf(data[i].id) != -1) {
            var text = "Rented";
            action = "";
        }
        else {
            var action = "\'placeOrder(" + data[i].id + ");\'"

            text = "Rent";
        }
        if (wishlist.indexOf(data[i].id) != -1) {
            var image = "../assets/img/Added_WL_Right.png"
            wish = "";
        }
        else {
            image = "../assets/img/Added_WL_50.png";
            var wish = "\'wishlistAdd(" + data[i].id + ");\'";
        }


        response += '<div class="col-md-2" style=width:18%;>' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><a href="/book_details/' + data[i].id + '"><img src="' + img + '" alt="Anna"></a></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i].title + '">' + data[i].title + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="fram_btn">' +
            '<a href="javascript:void(0)" class="shortcode_button btn_small btn_type1" title="Rent" onclick=' + action + ' id="rent_' + data[i].id + '">' + text + '</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick=' + wish + '><img id="wish_' + data[i].id + '" class="wishlist_btn" src=' + image + ' alt="Smiley face" height="25" width="25"></a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Share"  data-id="' + data[i].id + '" data-toggle="modal" data-target="#shareModal"><img  class="share_btn" src=../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +

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

function getCardMostRead(data, visibleCardCount, ids, wishlist) {
    var response = '', items = 0;

    var final_response = '';
    for (var i = 0; i < data.length; i++) {
        items++;
        var active = '';
        if (i == 0) {
            active = "active";
        }
        if (data[i].IMAGE == "http://cdn2.justbooksclc.com/medium/.jpg" || data[i].IMAGE ==
            "http://cdn2.justbooksclc.com/medium/NOISBN.jpg") {
            var img = "http://cdn2.justbooksclc.com/title/0.jpg";
        }
        else {
            var img = data[i].IMAGE;
        }


        if (ids.indexOf(parseInt(data[i].TITLEID)) != -1) {
            var text = "Rented";
            action = "";
        }
        else {
            var action = "\'placeOrder(" + data[i].TITLEID + ");\'"

            text = "Rent";
        }
        if (wishlist.indexOf(parseInt(data[i].TITLEID)) != -1) {
            var image = "../assets/img/Added_WL_Right.png"
            wish = "";
        }
        else {
            image = "../assets/img/Added_WL_50.png";
            var wish = "\'wishlistAdd(" + data[i].TITLEID + ");\'";
        }


        response += '<div class="col-md-2" style=width:18%;>' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><a href="/book_details/' + data[i].TITLEID + '"><img src="' + img + '" alt=""></a></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i].NAME + '">' + data[i].NAME + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="fram_btn">' +
            '<a    href="javascript:void(0)" class="shortcode_button btn_small btn_type1" title="Rent" onclick=' + action + ' id="rent_' + data[i].TITLEID + '">' + text + '</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick=' + wish + '><img id="wish_' + data[i].TITLEID + '" class="wishlist_btn" src=' + image + ' alt="Smiley face" height="25" width="25"></a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Share" data-id="' + data[i].TITLEID + '" data-toggle="modal" data-target="#shareModal"><img  class="share_btn" src=../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +

            // '<a href="/book_details/' + data[i].TITLEID + '" id="' + data[i].TITLEID + '" class="tiptip" title="Read">Read</a>' +
            '<div class="clear"></div>' +
            '</div></div></div></div></div>';

        //if( i > 0 && i % 3 == 0){
        if (items == visibleCardCount) {

            final_response += '<div class="item item_mostread ' + active + '">' + response + '</div>';
            response = "";
            items = 0;
        }

    }
    if (items < visibleCardCount && items > 0) {
        final_response += '<div class="item item_mostread ' + active + '">' + response + '</div>';
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


        response += '<div class="col-md-2" style="width: 18%;">' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><a href="/author_details/' + data[i].AUTHOR_ID + '"><img src="https://s3.amazonaws.com/prod.justbooksclc.com/authors/' + data[i].AUTHOR_ID + '.jpg" alt="Anna" onerror="this.src=\'../assets/img/user.png\'"></a></div>' +
            '<div class="carousel_body_author">' +
            '<div class="carousel_title_author"><h5 title="' + data[i].AUTHOR_NAME + '">' + data[i].AUTHOR_NAME + '</h5></div>' +
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
            console.log(cardData)

            var final_response = getCard(cardData['result'], 5, data['ids'], data['wishlist']);
            $('#newArrivals').append(final_response);
            $('.item').first().addClass('active');
            $("#myCarousel").carousel();

        },

    });


    $.ajax({
        type: "GET",
        url: "/getMostRead",
        success: function (data) {

            $("#frame_mostRead").hide();
            $("#loader_mostRead").hide();
            data = JSON.parse(data)
            console.log(data);
            cardData = data['data'];
            var final_response = getCardMostRead(cardData, 5, data['ids'], data['wishlist']);
            $('#mostRead').append(final_response);
            $('.item_mostread').first().addClass('active');
            $("#myCarousel1").carousel();
        },

    });

    $.ajax({
        type: "GET",
        url: "/getAuthor",
        success: function (data) {

            $("#frame_authorCarousel1").hide();
            $("#loader").hide();

            var final_response = getCardAuthor(JSON.parse(data), 5);
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
            console.log(val);
            var response = '';
            var i = 0;
            var plans = val;
            var colors = ['block personal fl', 'block professional fl', 'block business fl'];
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


                var sec_colors = ['#78CFBF', '#3EC6E0', '#E3536C']
                response += '   <div class="' + colors[i] + '">' +
                    '<h4 class="title">' + arr['PLAN_NAME'].toUpperCase() + '</h4>' +
                    ' <a href="/signup?planname=' + arr['PROMO'] + '&books=' + arr['NO_OF_BOOKS'] + '&months=' + arr['NO_OF_MONTHS'] + '"><div class="content_pt">' +
                    ' <p class="price"><sup>₹</sup><span> ' + Math.round(parseFloat(arr['READING_FEE'])) + '</span><sub></sub></p>' +
                    '<p class="hint">' + arr['MONTH_TAG'] + '</p></div></a><ul class="features">' +
                    '<li style="color: black;">' + arr['BOOK_TAG'] + '</li><li style="background-color: ' + sec_colors[i] + ';padding: 12px;color: white;">' + arr['SUITABLE_TAG'] + '</li><li style="color: black;">Security Deposit - ₹ ' + Math.round(parseFloat(arr['SECURITY_DEPOSIT'])) + ' </li>' +
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
            console.log(data['IMAGE']);
            console.log(data)
            for (var i = 0; i < data.length; i++) {
                $("#blogDiv").append('<li>  ' +
                    '<div class="item">' +
                    '<div class="img_block wrapped_img"><img style="width: 100%;height: 17em;" src="' + data[i]['IMAGE'] + '" alt="" width="270" height="170"></div>' +
                    '<div class="carousel_body">' +
                    '<div class="carousel_title">' +
                    '<h5><a href="#" style="margin-left: -7%;font-family: \'Playfair Display\'">' + data[i]['NAME'] + '</a></h5>' +
                    '</div>' +
                    '<div class="carousel_desc">' +
                    '<div class="exc" style="margin-left: -5%;font-family: \'Playfair Display\'">' + data[i]['DESCRIPTION'] + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<a href="' + data[i]['LINK'] + '" class="shortcode_button btn_small btn_type1">Read More</a>' +
                    '</div>' +
                    '</li>')
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
            console.log(data);
            console.log(JSON.parse(data));
            $(".spinner").hide();
            if (JSON.parse(data) === "failure") {
                toastr.error('Please sign in to update your wish list !');
                $(window).scrollTop($('#anchor2').offset().top);

            }
            else {
                $("#wish_" + id).attr("src", "../assets/img/Added_WL_Right.png")
                toastr.success('Successfully added into your wish list !');
            }
        },
        error: function (err) {
            console.log(err);
            toastr.error("Something went wrong.Please try again !")
        }

    });
}

function placeOrder(id) {
    $(".spinner").show();
    $.ajax({
        type: "GET",
        url: "/placeOrder?id=" + id,
        success: function (data) {
            console.log(data);
            if (JSON.parse(data) === "failure") {
                $(".spinner").hide();

                toastr.error('Please sign in to order the book !');
                $(window).scrollTop($('#anchor2').offset().top);

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


function signupClick() {
    $(".spinner").show();

    var username = $("#username").val();

    var password = $("#password").val();

    $.ajax({
        type: "GET",
        url: "/login/" + username + "/" + password + "",
        success: function (data) {
            $(".spinner").hide();

            console.log(data)

            if (data != false) {
                data = JSON.parse(data)
                $("#firstname").text(" Welcome " + data['name']);
                $(".userTile").show();
                $("ul#menuHeader").prepend("<li><a href=\"/shelf\">MY SHELF</a></li>");
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

            toastr.error('Something went wrong, Please try again !');
            console.log(err.responseText);
            $("#frame_sign_in").hide();
            $("#loader").hide();
        }


    });


}





