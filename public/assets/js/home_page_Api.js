function getCard(data, visibleCardCount) {
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
        response += '<div class="col-md-2" style=width:18%;>' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><img src="' + img + '" alt="Anna"></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i].author + '">' + data[i].author + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="smallproflinks">' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick=\'wishlistAdd(' + data[i].id + ');\'>Wishlist</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Rent" onclick=\'placeOrder(' + data[i].id + ');\'>Rent</a>' +
            '<a href="/book_details/' + data[i].id + '" id="' + data[i].id + '" class="tiptip" title="Read">Read</a>' +
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

function getCardMostRead(data, visibleCardCount) {
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
        response += '<div class="col-md-2" style=width:18%;>' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><img src="' + img + '" alt=""></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i].NAME + '">' + data[i].NAME + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="smallproflinks">' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick=\'wishlistAdd(' + data[i].id + ');\'>Wishlist</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Rent" onclick=\'placeOrder(' + data[i].id + ');\'>Rent</a>' +
            '<a href="/book_details/' + data[i].TITLEID + '" id="' + data[i].TITLEID + '" class="tiptip" title="Read">Read</a>' +
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


        response += '<div class="col-md-2" style=width:18%;>' +
            '<div class="item item_shadow ">' +
            '<div class="img_block_books"><img src="' + data[i].IMAGE + '" alt="Anna" onerror="this.src=\'http://cdn2.justbooksclc.com/title/0.jpg\'"></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i].NAME + '">' + data[i].NAME + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="smallproflinks">' +
            '<a href="/author_details/' + data[i].ID + '" id="' + data[i].ID + '" class="tiptip" title="Read">Read</a>' +
            '<div class="clear"></div>' +
            '</div></div></div></div></div>';

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
data=JSON.parse(data);
            var final_response = getCard(data['result'], 5);
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
            $("#loader").hide();
            var final_response = getCardMostRead(JSON.parse(data), 5);
            $('#mostRead').append(final_response);
            $('.item_mostread').first().addClass('active');
            $("#myCarousel1").carousel();
        },

    });

    $.ajax({
        type: "GET",
        url: "/getAuthor",
        success: function (data) {
            console.log(JSON.parse(data));

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
            var colors = ['#EFAC54', '#347AB6', '#5BB85D', '#59C0E1'];
            plans.forEach(function (arr) {
                response += '<div class="price_item" style="width:33.33%">' +
                    '<div class="price_item_wrapper">' +
                    '<div class="price_item_title"><h5>' + arr['PLAN_NAME'].toUpperCase() + '</h5></div>' +
                    '<div class="item_cost_wrapper" style="background-color: ' + colors[i] + ';">' +
                    '<div class="price_item_title" style="background-color: ' + colors[i] + '; padding: 10px 10px 10px 10px;"><h4>Reading fee - Rs ' + Math.round(parseFloat(arr['READING_FEE'])) + ' </h4></div>' +
                    '</div>' +
                    '<div class="price_item_text">'+ arr['NO_OF_MONTHS'] +' months plan</div>' +
                    '<div class="price_item_text" id="price_item_text">Books - Rs  ' + arr['NO_OF_BOOKS'] + '</div>' +
                    '<div class="price_item_text">Regestration Fee - Rs ' + Math.round(parseFloat(arr['REGISTRATION_FEE'])) + ' </div>' +
                    '<div class="price_item_text" id="price_item_text">Security Deposit - Rs ' + Math.round(parseFloat(arr['SECURITY_DEPOSIT'])) + ' </div>' +
                    '<div class="price_item_btn" id="btn" style="background-color: ' + colors[i] + '"><a href="/signup?planname=' + arr['PROMO'] + '&books=' + arr['NO_OF_BOOKS'] + '">Get It Now !</a></div>' +
                    '</div></div>';
                i++;
                if (i >= colors.length) {
                    i = 0;
                }
            })

            $('#plansCard').append(response);
        },

    });

});

function wishlistAdd(id) {
    $(".spinner").show();

    $.ajax({
        type: "GET",
        url: "/updateWishlist?id="+id,
        success: function (data) {
            console.log(data);
            console.log(JSON.parse(data));
            $(".spinner").hide();
            if (JSON.parse(data) === "failure" ) {
                toastr.error('Please sign in to update your wish list !');
                $(window).scrollTop($('#anchor2').offset().top);

            }
            else {
                toastr.success('Successfully added into your wish list !');
            }
        },
        error:function(err)
        {
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
            if (JSON.parse(data) === "failure" ) {
                $(".spinner").hide();

                toastr.error('Please sign in to order the book !');
                $(window).scrollTop($('#anchor2').offset().top);

            }
            else {
                $(".spinner").hide();
                data=JSON.parse(data);
                console.log(data['success'])
                if(data['success'] === "false")
                {
                    toastr.warning(data['errors'])
                }else{
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
                $("ul#menuHeader").append("<li><a href=\"/shelf\">Your Shelf</a></li>");
                toastr.success('Successfully signed in !');
                localStorage.setItem("flag",true)
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


                return false;
            }
            toastr.error('Wrong credentials, Please try again !');
            $(".spinner").hide();


        },
        error: function (err) {
            $(".spinner").hide();

            toastr.error('Wrong credentials, Please try again !');
            console.log(err.responseText);
            $("#frame_sign_in").hide();
            $("#loader").hide();
        }


    });


}



