$(document).ready(function() {
    $("#myCarousel1").swiperight(function() {
        $(this).carousel('prev');
    });
    $("#myCarousel1").swipeleft(function() {
        $(this).carousel('next');
    }); $("#myCarousel2").swiperight(function() {
        $(this).carousel('prev');
    });
    $("#myCarousel2").swipeleft(function() {
        $(this).carousel('next');
    }); $("#myCarousel").swiperight(function() {
        $(this).carousel('prev');
    });
    $("#myCarousel").swipeleft(function() {
        $(this).carousel('next');
    });
});

$(document).ready(function () {
    var $myGroup = $('#myGroup');
    $myGroup.on('show', '.collapse', function () {
        $myGroup.find('.collapse.in').collapse('hide');
    });
    $('#shelfMenu').addClass('current-menu-parent');

    $.ajax({
        type: "GET",
        url: "/newArrivals",
        success: function (data) {
            data = JSON.parse(data);
            cardData = data['data'];

            var w = window.outerWidth;
            var h = window.outerHeight;
            if(w<750){
                var final_response = getCard(cardData, 2, data['ids'], data['wishlist']);
            }else{
                var final_response = getCard(cardData, 5, data['ids'], data['wishlist']);
            }

            // var final_response = getCard(cardData, 5, data['ids'], data['wishlist']);

            $('#newArrivalsShelf').append(final_response);
            $('.item_shelf_new').first().addClass('active');
            $("#myCarouselnew").carousel();
            if(w<750){
                $("div#shelfNewArr").css('margin-left','6%')
            }
            $("#frame_new_arr").hide();
            $("#loader").hide();
        },

    });


    $.ajax({
        type: "GET",
        url: "/getShelfRecommendedBooks",
        success: function (data) {
            data = JSON.parse(data);

            cardData = data['data'];

            var w = window.outerWidth;
            var h = window.outerHeight;
            if(w<750){
                var final_response = getRecommend(cardData, 2, data['ids'], data['wishlist']);
            }else{
                var final_response = getRecommend(cardData, 5, data['ids'], data['wishlist']);
            }
            // var final_response = getRecommend(cardData, 5, data['ids'], data['wishlist']);

            $('#recommendedShelf').append(final_response);
            $('.item_shelf_rec').first().addClass('active');
            $("#myCarousel").carousel();
            $("#frame_recomm").hide();
            $("#loader_rec").hide();
            if(w<750){
                $("div#leftRecommned").css("margin-left"," 10% ")
            }

        },
        error: function (err) {
            $(".spinner").hide();

            console.log(err.responseText);
            return false;

        }
    });


    $.ajax({
        type: "GET",
        url: "/getMostRead",
        success: function (data) {


            data = JSON.parse(data)
            cardData = data['data'];
            var w = window.outerWidth;
            var h = window.outerHeight;
            if(w<750){
                var final_response = getCardMostRead(cardData, 2, data['ids'], data['wishlist']);
            }else{
                var final_response = getCardMostRead(cardData, 5, data['ids'], data['wishlist']);
            }
            // var final_response = getCardMostRead(cardData, 5, data['ids'], data['wishlist']);

            $('#mostRead').append(final_response);
            $('.item_mostread_shelf').first().addClass('active');
            $("#frame_mostRead").hide();
            $("#loader_mostRead").hide();
            $("#myCarousel2").carousel();
        },

    });

})

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


        response += '<div class="col-xs-6 col-sm-2 col-md-2 col-lg-2 sliderDIv">' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><a rel="external" data-ajax="false" href="/book_details/' + data[i]['_source'].title_id + '/' + data[i]['_source'].title + '"><img src="' + img + '" onerror="this.src=\'../../assets/images/Default_Book_Thumbnail.png\'"></a></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i]['_source'].title + '">' + data[i]['_source'].title + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="fram_btn">' +
            '<a href="javascript:void(0)" class="shortcode_button btn_small btn_type1" title="Rent" onclick=' + action + ' id="rent_' + data[i]['_source'].title_id + '">' + text + '</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick=' + wish + '><img id="wish_' + data[i]['_source'].title_id + '" class="wishlist_btn" src=' + image + ' alt="Smiley face" height="25" width="25"></a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Share"  data-id="' + data[i]['_source'].title_id + '" data-toggle="modal" data-target="#shareModal"><img  class="share_btn" src=../../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +

            // '<a href="/book_details/' + data[i].id + '" id="' + data[i].id + '" class="tiptip" title="Read">Read</a>' +
            '<div class="clear"></div>' +
            '</div></div></div></div></div>';

        //if( i > 0 && i % 3 == 0){
        if (items == visibleCardCount) {

            final_response += '<div class="item item_shelf_new' + active + '">' + response + '</div>';
            response = "";
            items = 0;
        }

    }
    if (items < visibleCardCount && items > 0) {
        final_response += '<div class="item item_shelf_new ' + active + '">' + response + '</div>';
    }
    return final_response;
}
function getRecommend(data, visibleCardCount, ids, wishlist) {
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


        response += '<div class="col-xs-6 col-sm-2 col-md-2 col-lg-2 sliderDIv">' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><a rel="external" data-ajax="false" href="/book_details/' + data[i]['_source'].title_id + '/' + data[i]['_source'].title + '"><img src="' + img + '" onerror="this.src=\'../../assets/images/Default_Book_Thumbnail.png\'"></a></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i]['_source'].title + '">' + data[i]['_source'].title + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="fram_btn">' +
            '<a href="javascript:void(0)" class="shortcode_button btn_small btn_type1" title="Rent" onclick=' + action + ' id="rent_' + data[i]['_source'].title_id + '">' + text + '</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick=' + wish + '><img id="wish_' + data[i]['_source'].title_id + '" class="wishlist_btn" src=' + image + ' alt="Smiley face" height="25" width="25"></a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Share"  data-id="' + data[i]['_source'].title_id + '" data-toggle="modal" data-target="#shareModal"><img  class="share_btn" src=../../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +

            // '<a href="/book_details/' + data[i].id + '" id="' + data[i].id + '" class="tiptip" title="Read">Read</a>' +
            '<div class="clear"></div>' +
            '</div></div></div></div></div>';

        //if( i > 0 && i % 3 == 0){
        if (items == visibleCardCount) {

            final_response += '<div class="item item_shelf_rec' + active + '" style="">' + response + '</div>';
            response = "";
            items = 0;
        }

    }
    if (items < visibleCardCount && items > 0) {
        final_response += '<div class="item item_shelf_rec ' + active + '" style="">' + response + '</div>';
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
        if (data[i]['_source'].image_url === null) {
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
            '<div class="img_block_books"><a  rel="external" data-ajax="false" href="/book_details/' + data[i]['_source'].title_id + '/' + data[i]['_source'].title + '"><img src="' + img + '" onerror="this.src=\'../../assets/images/Default_Book_Thumbnail.png\'"></a></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i]['_source'].title + '">' + data[i]['_source'].title + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="fram_btn">' +
            '<a    href="javascript:void(0)" class="shortcode_button btn_small btn_type1" title="Rent" onclick=' + action + ' id="rent_' + data[i]['_source'].title_id + '">' + text + '</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick=' + wish + '><img id="wish_' + data[i]['_source'].title_id + '" class="wishlist_btn" src=' + image + ' alt="Smiley face" height="25" width="25"></a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Share" data-id="' + data[i]['_source'].title_id + '" data-toggle="modal" data-target="#shareModal"><img  class="share_btn" src=../../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +

            // '<a href="/book_details/' + data[i].TITLEID + '" id="' + data[i].TITLEID + '" class="tiptip" title="Read">Read</a>' +
            '<div class="clear"></div>' +
            '</div></div></div></div></div>';

        //if( i > 0 && i % 3 == 0){
        if (items == visibleCardCount) {

            final_response += '<div class="item item_mostread_shelf ' + active + '">' + response + '</div>';
            response = "";
            items = 0;
        }

    }
    if (items < visibleCardCount && items > 0) {
        final_response += '<div class="item item_mostread_shelf ' + active + '">' + response + '</div>';
    }
    return final_response;
}

$(document).ready(function () {
    $('li a#currently_reading').addClass('active');
    $('#profileUpdate').on('show.bs.modal', function (e) {
        console.log(e)
        //get data-id attribute of the clicked element
        var address1 = $(e.relatedTarget).data('address1');
        var dob = $(e.relatedTarget).data('datofbirth');
        var dobDate= moment(dob, "DD-MMM-YY").add(1, 'days').toDate();

        dobDate=dobDate.toISOString().replace(/T.*/,'').split('-').reverse().join('-');

        var address2 = $(e.relatedTarget).data('address2');
        var gender = $(e.relatedTarget).data('gender');
        var address3 = $(e.relatedTarget).data('address3');
        var state = $(e.relatedTarget).data('state');
        var city = $(e.relatedTarget).data('city');
        var pincode = $(e.relatedTarget).data('pin');
        var phone = $(e.relatedTarget).data('phone');
        var email = $(e.relatedTarget).data('email');
        $("#dob").datepicker({
            dateFormat: 'dd-mm-yy',
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+0",
            defaultDate: dobDate,
        }).val(dobDate);
        //populate the textbox
        $('#address1').val(address1);
        $('#gender').val(gender);
        $('#address2').val(address2);
        $('#address3').val(address3);
        $('#state').val(state);
        selct_district(state);
        $('#city').val(city);
        $('#zip').val(pincode);
        $('#phone').val(phone);
        $('#email').val(email);
    });


    $('#rateModal').on('show.bs.modal', function (e) {

        //get data-id attribute of the clicked element
        var id = $(e.relatedTarget).data('id');
        var title = $(e.relatedTarget).data('title');

        //populate the textbox
        $('#modalTitleRate').html("Rate <strong>'" + title + "'</strong>");
        $('#book_id').val(id);
    });


    $('form').submit(function (e) {
        $(".spinner").show();
        $.ajax({
            type: "POST",
            url: "/updateProfile",
            data: {
                'address1': $("#address1").val(),
                'address2': $("#address2").val(),
                'address3': $("#address3").val(),
                'state': $("#state").val(),
                'city': $("#city").val(),
                'pin': $("#zip").val(),
                'email': $("#email").val(),
                'phone': $("#phone").val(),
                'dob': $("#dob").val(),
                'gender': $("#gender").val(),

            },
            async: true,
            dataType: 'json',
            enctype: 'multipart/form-data',
            cache: false,
            success: function (data) {
                $(".spinner").hide();
                if (data === "Updated") {
                    toastr.success("Updated successfully !");
                    location.reload();
                    return false;
                }
                else {
                    toastr.error("Something went wrong !");
                    return false;
                }


                $(".spinner").hide();
                return false;

            },
            error: function (err) {
                $(".spinner").hide();

                console.log(err.responseText);
                return false;

            }
        });

        return false;


    });


    $('#change_plan').html('');

    $(".spinner").show();
    $("li a").removeClass('active');
    $("li a#currently_reading").addClass('active');
    $(".spinner").show();
    $.ajax({
        type: "GET",
        url: "/getCurrentReading",
        success: function (data) {

            $(".spinner").hide();
            var new_data = JSON.parse(data);
            $('#change_plan').html('');
            $("#left_menu_recommend").show();


            if (new_data['data']['result'].length == 0) {
                $('#shelf_data').html('');
                $("#left_menu_recommend").show();

                $("#emptyResult").show();
                $("#emptyResult").text("No books to show !");
                $('html, body').animate({
                    scrollTop: $('#shelf_data').offset().top - 150
                }, 800);

                return false;
            }
            $("#emptyResult").hide();
            $("#left_menu_recommend").show();
            var final_response = generateDIV(new_data['data']['result'], 'placePickup', 'rental_id', 'Return', 'none', new_data['wishlist'], '', 'none', 'margin-top: 34%;margin-left: -100%;', 'inline-block', 'block');
            $('#shelf_data').html('');
            $('#shelf_data').append(final_response);
            $('html, body').animate({
                scrollTop: $('#shelf_data').offset().top - 150
            }, 800);
            $("#left_menu_recommend").css('margin-top', '33%');


        },

    });

});


function generateDIV(arr, funcName, idName, btnTxt, style, ids, statusKey, statusStyle, shareStyle, wishStyle, custStyle) {
    $('#change_plan').html('');
    var response = '';
    arr.forEach(function (arr_data) {
//            console.log(arr_data['id']);
//            console.log(ids.indexOf(arr_data['id']))
        if (ids.indexOf(arr_data['id']) != -1) {
            var image = "../../assets/img/Added_WL_Right.png"
            wish = "";
        }
        else {
            image = "../../assets/img/Added_WL_50.png";
            var wish = "\'wishlistAdd(" + arr_data['id'] + ");\'";
        }

        response += '<div id="alertDiv" class="alert  alert-dismissable" style="display: none"><a  href="#" class="close"  aria-label="close" onclick="hideAlert()">&times;</a>' +
            '<span id="alertText"></span></div><div id="div' + arr_data['id'] + '" class="col-md-6 col-xs-6 module_cont module_shelf shadow1" style="height: 180px;">' +
            '<div class="col-md-5 col-xs-5">' +
            '<a rel="external" data-ajax="false" href="/book_details/' + arr_data['id'] + '/' + arr_data['title'] + '">' +
            '<img src="' + arr_data['image_url'] + '" class="img-responsive" alt="..." style="margin-top: -20px;height: 145px" onerror="this.src=\'../../assets/images/Default_Book_Thumbnail.png\'">' +
            '</a>' +
            '</div>' +

            '<div class="col-md-7 col-xs-7" id="module_shelf">' +
            '<h4 style=" width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">' + arr_data['title'] + '</h4>' +
            '<p>' + arr_data['author'] + '</p>' +
            '<br><div class="rating" id="rating1">' +
            '</div>' +
            // '<p><a href="/book_details/' + arr_data['id'] + '">Rate/Review</a></p>' +
            '<div class="shelf_sicial">' +
            '<div class="col-md-3 col-xs-2" style="cursor:pointer;margin-right: 26%;margin-top: 4%;margin-left:-9%">' +
            '<a class="shortcode_button btn_small btn_type10"  data-toggle="modal" data-id=' + arr_data['id'] + ' data-title="' + arr_data['title'] + '"  data-target="#rateModal" style="cursor:pointer;">Rate/Review</a>' +
            '</div>' +
            '<div class="col-md-3 col-xs-2 shelf_return_btn" style="margin-right: -8%;margin-top: 4%;display: ' + custStyle + '">' +
            '<a href="javascript:void(0)" class="shortcode_button btn_small btn_type10" onclick="' + funcName + '(this,' + arr_data['id'] + ')"  id="' + arr_data[idName] + '">' + btnTxt + '</a>' +
            '</div>' +
            '</div></div>' +
            '<a onclick="statusCheck(this,' + arr_data[statusKey] + ')" id="status_' + arr_data['id'] + '" style="text-decoration: underline; display:' + style + '" href="javascript:void(0)">Track Status</a><p id="message_' + arr_data[statusKey] + '" style="display: none;color:green;font-weight: bold" ></p>' +
            '<div class="col-md-4 col-xs-6 shelf_logos" style="float: left;' + shareStyle + '">' +
            '<a href="javascript:void(0)" class="tiptip" title="Share" data-id="' + arr_data['id'] + '" data-title="' + arr_data['title'] + '" data-toggle="modal" data-target="#shareModal" style="margin-left: 10%">' +
            '<img class="share_btn" src=../../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +
            '<a   style="display:' + wishStyle + ';class="tiptip" onclick="addWishlist(' + arr_data['id'] + ')"  id="' + arr_data[idName] + '"><img id="wish_' + arr_data['id'] + '" class="wishlist_btn" src=' + image + ' alt="Smiley face" height="25" width="25"></a>' +
            '</div>' +
            '</div>';
    });
    return response;
}
function generateWishDIV(arr,ids,rent) {
    $('#change_plan').html('');
    var response = '';
    arr.forEach(function (arr_data) {
//            console.log(arr_data['id']);
//            console.log(ids.indexOf(arr_data['id']))
//         if (ids.indexOf(arr_data['id']) != -1) {
//             var image = "../../assets/img/Added_WL_Right.png"
//             wish = "";
//         }
//         else {
//             image = "../../assets/img/Added_WL_50.png";
//             var wish = "\'wishlistAdd(" + arr_data['id'] + ");\'";
//         }

        if (rent.indexOf(parseInt(arr_data['id'])) != -1) {
            var text = "Rented";
            action = "";
        }
        else {
            var action = "\'placeOrder(" + arr_data['id'] + ");\'"

            text = "Rent";
        }
        response += '<div id="alertDiv" class="alert  alert-dismissable" style="display: none"><a  href="#" class="close"  aria-label="close" onclick="hideAlert()">&times;</a>' +
            '<span id="alertText"></span></div><div id="div' + arr_data['id'] + '" class="col-md-6 col-xs-6 module_cont module_shelf shadow1" style="height: 180px;">' +
            '<div class="col-md-5 col-xs-5">' +
            '<a rel="external" data-ajax="false" href="/book_details/' + arr_data['id'] + '/' + arr_data['title'] + '">' +
            '<img src="' + arr_data['image_url'] + '" class="img-responsive" alt="..." style="margin-top: -20px;height: 145px" onerror="this.src=\'../../assets/images/Default_Book_Thumbnail.png\'">' +
            '</a>' +
            '</div>' +

            '<div class="col-md-7 col-xs-7" id="module_shelf">' +
            '<h4 style=" width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">' + arr_data['title'] + '</h4>' +
            '<p>' + arr_data['author'] + '</p>' +
            '<br><div class="rating" id="rating1">' +
            '</div>' +
            // '<p><a href="/book_details/' + arr_data['id'] + '">Rate/Review</a></p>' +
            '<div class="shelf_sicial">' +
            '<div class="col-md-3 col-xs-2" style="cursor:pointer;margin-right: 26%;margin-top: 4%;margin-left:-9%">' +
            '<a class="shortcode_button btn_small btn_type10"  data-toggle="modal" data-id=' + arr_data['id'] + ' data-title="' + arr_data['title'] + '"  data-target="#rateModal" style="cursor:pointer;">Rate/Review</a>' +
            '</div>' +
            '<div class="col-md-3 col-xs-2 shelf_return_btn" style="margin-right: -8%;margin-top: 4%;display:inline-block">' +
            '<a href="javascript:void(0)" class="shortcode_button btn_small btn_type10" onclick=' + action + '  id="rent_' + arr_data['id'] + '">' + text + '</a>' +
            '</div>' +
            '</div></div>' +
            '<div class="col-md-4 col-xs-6 shelf_logos" style="float: left;margin-top: 37% ;margin-left: -100%">' +
            '<a href="javascript:void(0)" class="tiptip" title="Share" data-id="' + arr_data['id'] + '" data-title="' + arr_data['title'] + '" data-toggle="modal" data-target="#shareModal" style="margin-left: 10%">' +
            '<img class="share_btn" src=../../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +
            '&nbsp;<a   style="display:inline-block;cursor: default"class="tiptip" onclick="removeWishlist(this,' + arr_data['id'] + ')"  id="' + arr_data['id'] + '"><img class="share_btn" src=../../assets/img/Delete.png alt="Smiley face" height="23" width="23"></i>'+
            '</a>' +
            '</div>' +
            '</div>';
    });
    return response;
}

$('#wishlist').click(function (e) {
    $("li a").removeClass('active');
    $("li a#wishlist").addClass('active');
    $(".spinner").show();

    e.preventDefault();
    $.ajax({
        type: "GET",
        url: "/getWishList",
        success: function (data) {
            $('#change_plan').html('');

            $(".spinner").hide();
            var new_data = JSON.parse(data);
            console.log(new_data)

            if (new_data['data']['result'].length == 0) {
                $('#shelf_data').html('');

                $("#emptyResult").show();
                $("#emptyResult").text("No books to show !");
                $("#left_menu_recommend").css('margin-top', '33%');
                $('html, body').animate({
                    scrollTop: $('#shelf_data').offset().top - 150
                }, 800);
                $("#left_menu_recommend").show();

                return false;
            }
            $("#emptyResult").hide();

            var response = '';
            var i = 0;
            var final_response = generateWishDIV(new_data['data']['result'], new_data['wishlist'],new_data['ids']);
            $('#shelf_data').html('');
            $('#shelf_data').append(final_response);
            $("#left_menu_recommend").show();
            $('html, body').animate({
                scrollTop: $('#shelf_data').offset().top - 150
            }, 800);
            $("#left_menu_recommend").css('margin-top', '33%');

        },

    });
});

$('#ordered_books').click(function (e) {
    $("li a").removeClass('active');
    $("li a#ordered_books").addClass('active');
    $(".spinner").show();
    e.preventDefault();
    $.ajax({
        type: "GET",
        url: "/getOrderList",
        success: function (data) {
            $(".spinner").hide();
            $("#left_menu_recommend").show();

            $('#shelf_data').html('');
            var new_data = JSON.parse(data);
            if (new_data['data']['result'].length == 0) {
                $('#shelf_data').html('');
                $('#change_plan').html('');

                $("#emptyResult").show();
                $("#emptyResult").text("No books to show !");
                $('html, body').animate({
                    scrollTop: $('#shelf_data').offset().top - 150
                }, 800);
                $("#left_menu_recommend").css('margin-top', '33%');

                return false;
            }
            $("#emptyResult").hide();
            $('#change_plan').html('');

            if (new_data['data']['result'][0]['delivery_order_id'] == null) {
                var id = 'rental_id';
            } else {
                var id = 'delivery_order_id';
            }
            var final_response = generateDIV(new_data['data']['result'], 'cancelOrder', 'delivery_order_id', 'Cancel', 'inline-block', new_data['wishlist'], 'delivery_order_id', 'block', 'margin-top: 6% !important;margin-left: -40%', 'inline-block', 'block');
            $('#shelf_data').append(final_response);
            $('html, body').animate({
                scrollTop: $('#shelf_data').offset().top - 150
            }, 800);
            $("#left_menu_recommend").css('margin-top', '33%');

        },

    });
});

$('#currently_reading').click(function (e) {
    $("li a").removeClass('active');
    $("li a#currently_reading").addClass('active');
    $("#currently_reading").addClass('active');

    $(".spinner").show();

    e.preventDefault();
    $.ajax({
        type: "GET",
        url: "/getCurrentReading",
        success: function (data) {

            $(".spinner").hide();
            var new_data = JSON.parse(data);
            $('#change_plan').html('');
            $("#left_menu_recommend").show();


            if (new_data['data']['result'].length == 0) {
                $('#shelf_data').html('');
                $("#left_menu_recommend").show();

                $("#emptyResult").show();
                $("#emptyResult").text("No books to show !");
                $('html, body').animate({
                    scrollTop: $('#shelf_data').offset().top - 150
                }, 800);

                return false;
            }
            $("#emptyResult").hide();
            $("#left_menu_recommend").show();
            var final_response = generateDIV(new_data['data']['result'], 'placePickup', 'rental_id', 'Return', 'none', new_data['wishlist'], '', 'none', 'margin-top: 34%;margin-left: -100%;', 'inline-block', 'block');
            $('#shelf_data').html('');
            $('#shelf_data').append(final_response);
            $('html, body').animate({
                scrollTop: $('#shelf_data').offset().top - 150
            }, 800);
            $("#left_menu_recommend").css('margin-top', '33%');


        },

    });
});

$('#pick_up').click(function (e) {
    $("li a").removeClass('active');
    $("li a#pick_up").addClass('active');
    $(".spinner").show();

    e.preventDefault();
    $.ajax({
        type: "GET",
        url: "/getPickupList",
        success: function (data) {
            console.log(data)
            $(".spinner").hide();

            $("#left_menu_recommend").show();

            $('#change_plan').html('');

            var new_data = JSON.parse(data);
            if (new_data['data']['result'].length == 0) {
                $('#shelf_data').html('');

                $("#emptyResult").show();
                $("#emptyResult").text("No pickup requests !");
                $('html, body').animate({
                    scrollTop: $('#shelf_data').offset().top - 150
                }, 800);

                return false;
            }
            $("#emptyResult").hide();


            var final_response = generateDIV(new_data['data']['result'], 'cancelPickup', 'rental_id', 'Cancel', 'inline-block', new_data['wishlist'], 'delivery_order_id', 'block', 'margin-top: 6% !important;margin-left: -40%', 'inline-block', 'block');
            $('#shelf_data').html('');
            $('#shelf_data').append(final_response);
            $('html, body').animate({
                scrollTop: $('#shelf_data').offset().top - 150
            }, 800);
            $("#left_menu_recommend").css('margin-top', '33%');

        },
    });
});

$('#profile').click(function (e) {
    $("li a").removeClass('active');
    $("li a#profile").addClass('active');
    $(".spinner").show();
    e.preventDefault();
    $.ajax({
        type: "GET",
        url: "/getProfileDetails",
        success: function (data) {
            $("#emptyResult").hide();
            $("#left_menu_recommend").show();

            $(".spinner").hide();
            $('#shelf_data').html('');
            $('#change_plan').html('');

            var data_new = JSON.parse(data);


            $('#shelf_data').html('');
//


            $('#shelf_data').append(
                '<div class="jumbotron col-xs-11">' +
                '<div class="row">' +

                '<div class="column column-66" style="cursor:default;"> <div style="font-size: 18px; color:#000 !important; font-family: Playfair Display;margin-top: -3%" class="col-sm-10">  <span class="">' + data_new['data'][0]['FIRST_NAME'] + '</span>  <a class="shortcode_button btn_small btn_type1" style="float:right;" href="" data-toggle="modal" data-address="' + data_new['data'][0]['EMAIL_ID'] + '"  data-address1="' + data_new['data'][0]['ADDRESS1'] + '"  data-address2="' + data_new['data'][0]['ADDRESS2'] + '"  data-address3="' + data_new['data'][0]['ADDRESS3'] + '"  data-state="' + data_new['data'][0]['STATE'] + '"  data-city="' + data_new['data'][0]['CITY'] + '"data-pin="' + data_new['data'][0]['PINCODE'] + '" data-phone="' + data_new['data'][0]['MPHONE'] + '" data-email="' + data_new['data'][0]['EMAIL_ID'] + '"  data-datofbirth="' + data_new['data'][0]['DATE_OF_BIRTH'] + '"  data-gender="' + data_new['data'][0]['GENDER'] + '" data-target="#profileUpdate">Edit Profile</a></div></div>' + '<div class="column column-33"> <div class="card border-color-teal"> <table class="table table-striped" style="margin:0;font-family:Playfair Display;"> <tbody> <tr> <td>Member since</td> <td>' + data_new['data'][0]['REGISTER_TIME'] + '</td> </tr>   <tr> <td>E-mail</td> <td>' + data_new['data'][0]['EMAIL_ID'] + '</td> </tr>  <tr> <td>Date of birth</td> <td>' + data_new['data'][0]['DATE_OF_BIRTH'] + '</td> </tr>  <tr> <td>Phone No</td> <td>' + data_new['data'][0]['MPHONE'] + '</td> </tr> <tr> <td>Address</td>  <td>' + data_new['data'][0]['ADDRESS1'] + data_new['data'][0]['ADDRESS2'] + data_new['data'][0]['ADDRESS3'] + ", " + data_new['data'][0]['STATE'] + ", " + data_new['data'][0]['CITY'] + ", " + data_new['data'][0]['PINCODE'] + '</td>  </tr> </tbody> </table> </div> </div>' + '</div>' +
                '</div>'
            );
            $('html, body').animate({
                scrollTop: $('#shelf_data').offset().top - 150
            }, 800);
            $("#left_menu_recommend").css('margin-top', '15%');

        }

    });
});

$('#subscription').click(function (e) {
    $("#left_menu_recommend").css('margin-top', '33%');

    $("#datePickInput").datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        yearRange: "-100:+0",
        minDate: new Date()

    }).val();
    $("li a").removeClass('active');
    $("li a#subscription").addClass('active');


    $(".spinner").show();

    e.preventDefault();
    $.ajax({
        type: "GET",
        url: "/getSubscription",
        success: function (data) {
            $("#emptyResult").hide();

            $(".spinner").hide();
            $('#shelf_data').html('');
            var data_new = JSON.parse(data);
            var current_plan = data_new['curent_plan'];
            var change_plan = data_new['change_plan']
            var terms = data_new['terms'];
            $("#left_menu_recommend").show();

            console.log(data_new);
            $('#change_plan').html('');
            var response = '';
            var i = 0;
            var colors = ['#EFAC54', '#347AB6', '#5BB85D', '#59C0E1'];
            // if (change_plan.length === 0) {
            //     $("#emptyResult").text(change_plan['errors']);
            //     $("#emptyResult").show();
            //
            //     return false;
            // }


            $('#shelf_data').append('<br><div class="row" style="margin-left: 0px !important;">' +

                '<div class="col-sm-3">' +
                '<div class="gallery-view">' +
                '<div data-reveal-group="relations22" class="column column-50" data-sr-id="4">' +
                ' <div class="item clickable" style="margin:0;">' +
                '<div class="article border-color-" style="border-top: 4px solid black;">' +
                '<div class="article-body planIdDIV" id=' + current_plan['result']['member_cross_reference']['plan_id'] + '> ' +
                '<h4 style="font-family: Playfair Display; white-space:nowrap;height:35px;text-overflow:ellipsis;overflow:hidden;display:block; text-align:center;">Current Plan</h4> ' +
                '<div class="gray" style="white-space:nowrap;height:25px;text-overflow:ellipsis;overflow:hidden;display:block;text-align:center;">' + current_plan['result']['member_cross_reference']['plan_name'] + '</div> ' +
                ' </div> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div>' +

                '</div>' +

                '<div class="col-sm-3">' +
                '<div class="gallery-view">' +
                '<div data-reveal-group="relations22" class="column column-50" data-sr-id="4">' +
                ' <div class="item clickable" style="margin:0;">' +
                '<div class="article border-color-" style="border-top: 4px solid blue;">' +
                '<div class="article-body">' +
                '<h4 style="font-family: Playfair Display; white-space:nowrap;height:35px;text-overflow:ellipsis;overflow:hidden;display:block; text-align:center;">Duration</h4> ' +
                '<div class="gray" style="white-space:nowrap;height:25px;text-overflow:ellipsis;overflow:hidden;display:block;text-align:center;">' + Math.round(parseFloat(current_plan['result']['member_cross_reference']['term'])) + ' months</div> ' +
                ' </div> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div>' +
                '</div>' +

                '<div class="col-sm-3" >' +

                '<div class="gallery-view">' +
                '<div data-reveal-group="relations22" class="column column-50" data-sr-id="4">' +
                ' <div class="item clickable" style="margin:0;">' +
                '<div class="article border-color-" style="border-top: 4px solid red;">' +
                '<div class="article-body">' +
                '<h4 style="white-space:nowrap;height:35px;text-overflow:ellipsis;overflow:hidden;display:block; text-align:center; font-family: Playfair Display;">Renewal Date</h4> ' +
                '<div class="gray" style="white-space:nowrap;height:25px;text-overflow:ellipsis;overflow:hidden;display:block;text-align:center;">' + current_plan['result']['member_cross_reference']['expiry_date'] + '</div> ' +
                ' </div> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div>' +
                '</div>' +

                '<div class="col-sm-3" style="margin-top:3%">' +
                '<div class="text-right">' +
                '<button data-toggle="collapse" data-target="#demo" class="shortcode_button btn_small btn_type10" role="button" onclick="RenewButton()">Renew Plan &nbsp;&nbsp;</button>' +
                '<br><br><button  data-toggle="collapse" data-target="#break" class="shortcode_button btn_small btn_type10" role="button" onclick="breakButton()">Take a break</button>' +
                '</div></div></div><br><hr>');
            var response2 = '';
            terms.forEach(function (arr) {
                response2 += '<option value=' + arr['fee'] + ' id=' + arr['term'] + '>' + arr['months'] + '</option>';

            })
            var defValue = terms[0]['fee'];
//                console.log(response2);
//                $('#shelf_data').append('<br> <div class="collapse form-group" id=\"demo\" >' +
//                        '<label for="sel1">Select list:</label>' +
//                        '<select class="form-control" id="sel1" onchange="textChange()">'+response2+'' +
//                        '</select> </div><br><div ><span id="textSpan"></span></div> ')
            $('#shelf_data').append('<br><div id="myGroup"> <div id=\"break\" class="collapse"> <form class="form-inline" action="/action_page.php"><div class="form-group" style="margin-right: 3%;">' +
                ' <label for="sel1">Select Duration:</label><select class="form-control" id="monthSel"><option value="1">1 month</option>' +
                '<option value= "2">2 months</option><option value="3">3 months</option></select>' +
                '</div><div class="form-group" style="margin-right: 3%;">' +
                '<label for="pwd">Start Date:</label><input class="form-control" type="text" id="datePickInput" readonly required="required" name="datePickInput" required>' +
                '</div><button type="button" class="btn btn-default" onclick="breakValidate()">Submit</button><br><br><hr><p id="textSpanBreak" style="margin-left:0%;display:none;font-weight:bold;font-size:143%"></p><br><p id="textSpanBreakDate" style="margin-left:0%;display:none;font-weight:bold;font-size:143%"></p><br><button id="BreakBUtton" style="display: none;float: left;" type="button" class="shortcode_button btn_small btn_type10" onclick="proceedBreak()">Proceed</button><span class="breakAmount" style="display: none"></span><span class="breakAMountPay" style="display: none"></span><span class="breakDate" style="display: none"></span><br><br><br><br><hr style="display:none" id="hrTag"><div id="aboutBreak" style= "display:none" class="col-md-12"><p><b>What\'s \'Take a break\' ?</b></p><p>Through a feature called “Subscription Holiday”, JustBooksclc allows the member to pause the membership (temporary suspension), for a duration of 1 month, 2 months or 3 months before expiration of membership. During Subscription Holiday period, a member will not be able to use the library. To utilise this feature, a member is required to fill up the Subscription Holiday Form either at the branch or online. All issued books and magazines should be returned to the JustBooksclc branch before the start date of Subscription Holiday. Members who pay for Yearly and Half-yearly terms will receive free Subscription Holidays of 2 months and 1 month respectively, and are required to pay Rs. 50/- per month there after. Quarterly members are required to pay Rs. 50/- per month to avail the feature.</p></div></div></div></form></div>' +
                '<div class="row collapse" id=\"demo\" >' +
                '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> <form> <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> <div class="form-group" style="width:50%"> <label for="sel1">Select a renewal duration :</label> <select class="form-control" id="sel1" onchange="textChange()">'+response2+' </select> </div> </div> <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10"> <div class="form-group"> <input type="text" class="form-control" id="coupon_code" placeholder="Coupon code if any" name="coupon_code"> <span class="input-group-btn"> </div> </div> <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"> <div class="form-group"> <button type="button" class="btn btn-warning" id="coupon_submit" onclick="couponClick()">Apply</button> </div> </div> <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5"> <div class="form-group"> <input class="form-control" id="gift_card" placeholder="Gift Card No." name="gift_card" type="text"> </div> </div> <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5"> <div class="form-group"> <input class="form-control" id="gift_card_pin" placeholder="Gift Card Pin" name="gift_card_pin" type="text"> </div> </div> <div class="col-xs-6 col-sm-2 col-md-2 col-lg-2"> <div class="form-group"> <button type="button" class="btn btn-warning" id="gift_card_submit" onclick="couponClick()">Apply</button> </div> </div> <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"> <p style="font-weight: bold" id="textSpan"> You have to pay Rs ' + defValue + '</p> <button type="submit" class="shortcode_button btn_small btn_type10">Submit</button> </div> </form> </div></div><br>'
            )

            var colors = ['block personal fl', 'block professional fl', 'block business fl'];


            change_plan.forEach(function (arr) {
                var i = 0;
                var plan_durations = arr['change_plan_detail']['plan_durations'];
//                    response += '<h4>Upgrade your current plan</h4><div class="price_item" style="width:20%">' +
//                            '<div class="price_item_wrapper">' +
//                            '<div class="price_item_title"><h5>' + arr["change_plan_detail"]['plan_name'] + '</h5></div>' +
//                            '<div class="item_cost_wrapper" style="background-color: ' + colors[i] + ';">' +
//                            '</div>' +
//                            '<div class="price_item_text">3 months plan</div>' +
//                            '<div class="price_item_text" id="price_item_text">Books - ' + arr["change_plan_detail"]['books'] + '</div>' +
//                            '<div class="price_item_text">Regestration Fee - ' + arr["change_plan_detail"]['registration_fee'] + '</div>' +
//                            '<div class="price_item_text" id="price_item_text">Security Deposit - ' + arr["change_plan_detail"]['security_deposit'] + '</div>' +
//                            '<div class="price_item_btn" id="btn" style="background-color: ' + colors[i] + '"><a href="/change_plan?id=' + arr["change_plan_detail"]['plan_id'] + '&planname=' + arr["change_plan_detail"]['promo_code'] + '">Get It Now !</a></div>' +
//                            '</div></div>';
                response = "";
                if (plan_durations != null) {
                    response += '<div class="col-md-4" style="margin-top:2%; margin-bottom: 2%;"><div class="block personal fl" style="text-align: center;width:100%/*! height: 314px; */"><h4 class="title">' + arr["change_plan_detail"]['plan_name'] + '</h4> <a href="/change_plan?id=' + arr["change_plan_detail"]['plan_id'] + '&planname=' + arr["change_plan_detail"]['promo_code'] + '"><div class="content_pt" style="margin: -9%;"> <p class="price"><sup>₹</sup><span> ' + arr["change_plan_detail"]['reading_fee'] + '</span><sub></sub></p></div></a><ul class="features" style="margin-top: 8%;height: 130px;list-style-type: none !important;padding: 0;/*! margin: 0; */margin-left: -5%;"><li style="line-height: 39px;">No of books -   ' + arr["change_plan_detail"]['books'] + '</li><li style="line-height: 39px;">Security Deposit - Rs ' + arr["change_plan_detail"]['security_deposit'] + ' </li><li style="line-height: 39px;">Registration Fee - Rs ' + arr["change_plan_detail"]['registration_fee'] + '</li></ul><div class="pt-footer" style="padding-bottom: 1%"><h4><a rel="external" data-ajax="false" href="/change_plan?planname=' + arr["change_plan_detail"]['promo_code'] + '&books=' + arr["change_plan_detail"]['books'] + '&months=' + arr["change_plan_detail"]['plan_durations'][0]['plan_duration']['change_plan_months'] + '">UPGRADE NOW !</a></h4></div></div></div>';
                    i++;
                    if (i >= colors.length) {
                        i = 0;
                    }
                    $("#left_menu_recommend").css('margin-top', '3%');
                    $('#change_plan').append(response);
                    $('html, body').animate({
                        scrollTop: $('#shelf_data').offset().top - 150
                    }, 800);
                }
                else {
                    $("#left_menu_recommend").css('margin-top', '40%');
                }


            })

            $("#datePickInput").datepicker({
                dateFormat: 'dd-mm-yy',
                changeMonth: true,
                yearRange: "-100:+0",
                minDate: new Date()
            }).val();
//

            //                +
//                        '<div class="row">'+
//                '<h3>UPGRADE NOW</h3>'+
//                '<div class="columns">'+
//                '<ul class="price">'+
//                '<li class="header">Gold Kit</li>'+
//                '<li class="color2">Rs. 999</li>'+
//                '<li class="grey">Minimum 3 months plan</li>'+
//                '<li>Two books at a time</li>'+
//                '<li class="grey">One time Registration fee</li>'+
//                '<li>One time security deposit</li>'+
//                '<li class="color2"><a href="#" class="button">GET IT NOW !</a></li>'+
//                '</ul></div></div><br>


//                for(var i=0;i<change_plan['result'].length;i++)
//                {
//                    console.log(change_plan['result'][i]["change_plan_detail"]['plan_name']);
//                    $('#change_plan').append('<div class="row">'+
//                '<h3>UPGRADE NOW</h3>'+
//                '<div class="columns">'+
//                '<ul class="price">'+
//                '<li class="header">'+change_plan["result"][i]["change_plan_detail"]["plan_name"]+                '</li>'+
//                '<li class="color2">Rs. '+change_plan["result"][i]["change_plan_detail"]["registration_fee"]+'</li>'+
//                '<li class="grey">Minimum '+change_plan["result"][i]["change_plan_detail"]["plan_durations"][0]["change_plan_months"]+'  months plan</li>'+
//                '<li>'+change_plan["result"][i]["change_plan_detail"]["books"]+' books at a time</li>'+
//                '<li class="grey">One time Registration fee</li>'+
//                '<li>One time security deposit</li>'+
//                '<li class="color2"><a href="#" class="button">GET IT NOW !</a></li>'+
//                '</ul></div></div><br>');
//
//                }


        },

    });
})

function removeWishlist(elem, id) {

    var answer = confirm("Are you sure you want to return the book?");

    if (!answer) {
        return false;
    }
    $(".spinner").show();

    var id = id;
    $.ajax({
        type: "POST",
        url: "/removeWishList",
        data: {'titleid': id},
        success: function (data) {
            console.log(data)
            $(".spinner").hide();
            $("#alertDiv").addClass("alert-success");
            $("#alertDiv").show();
            $("#alertText").text("Successfully removed")
            $('#div' + id).closest('.module_shelf').remove();
            $('html, body').animate({
                scrollTop: $('#alertDiv').offset().top - 150
            }, 800);
            return false;


        },

    });
}

function placePickup(elem, title) {

    var answer = confirm("Are you sure you want to return the book?");

    if (!answer) {
        return false;
    }
    $(".spinner").show();

    var id = $(elem).attr('id');
    $.ajax({
        type: "POST",
        url: "/placePickup",
        data: {'rental_id': id, 'title': title},
        success: function (data) {
            $(".spinner").hide();
            console.log(JSON.parse(data));
            data = JSON.parse(data);
            if (data['success'] === "false") {
                $("#alertDiv").addClass("alert-danger");
                $("#alertDiv").show();
                $("#alertText").text(data['errors'])

            }
            if (data['success'] === 'true') {
                $("#alertDiv").addClass("alert-success");
                $("#alertDiv").show();
                $("#alertText").text("Successfully requested !")
                $('#' + id).closest('.module_shelf').remove();

            }
            else {

            }
        },

    });
}
function cancelOrder(elem, id) {
    var answer = confirm("Are you sure you want to canel the order?");

    if (!answer) {
        return false;
    }
    $(".spinner").show();

    var cancel = $(elem).attr('id');
    $.ajax({
        type: "POST",
        url: "/cancelOrder",
        data: {'id': id, 'cancelId': cancel},
        success: function (data) {
            $(".spinner").hide();
            data = JSON.parse(data)
            if (data['success'] == 'true') {
                $('#div' + id).closest('.module_shelf').remove();

                $("#alertDiv").addClass("alert-success");
                $("#alertDiv").show();
                $("#alertText").text("Successfully cancelled")
            }
            else {

                $("#alertDiv").addClass("alert-danger");
                $("#alertDiv").show();
                $("#alertText").text("Something went wrong! Please try againg !");
            }
        },

    });
}


function pastReads() {
    $("li a").removeClass('active');
    $("li a#pastreads").addClass('active');
    $(".spinner").show();

    $.ajax({
        type: "GET",
        url: "/rentalHistory",
        success: function (data) {
            $(".spinner").hide();
            data = JSON.parse(data);
            console.log(data);
            $("#left_menu_recommend").show();


            if (data['data']['result'].length == 0) {
                $('#shelf_data').html('');

                $("#emptyResult").show();
                $("#emptyResult").text("No past reads yet !");
                $("#left_menu_recommend").css('margin-top', '33%');
                $('html, body').animate({
                    scrollTop: $('#shelf_data').offset().top - 150
                }, 800);

                return false;
            }
            $("#emptyResult").hide();
            if (data['data']['success'] == true) {
                var final_response = generateDIV(data['data']['result'], 'placePickup', 'id', 'Pickup', 'none', data['wishlist'], '', 'none', 'margin-top: 34%;margin-left: -100%;', 'inline-block', 'none');
                $('#shelf_data').html('');
                $('#shelf_data').append(final_response);
                $('html, body').animate({
                    scrollTop: $('#shelf_data').offset().top - 150
                }, 800);
                $("#left_menu_recommend").css('margin-top', '33%');


            }
        },

    });
}


function cancelPickup(elem, title) {
    var answer = confirm("Are you sure you want to cancel a pickup?");

    if (!answer) {
        return false;
    }
    var id = $(elem).attr('id');
    $(".spinner").show();


    $.ajax({
        type: "POST",
        url: "/cancelPickup",
        data: {'id': id, 'title': title},
        success: function (data) {
            $(".spinner").hide();

            console.log(data)
            data=JSON.parse(data);
            if (data['success'] === true) {
                $('#' + id).closest('.module_shelf').remove();
                $("#alertDiv").addClass("alert-success");
                $("#alertDiv").show();
                $("#alertText").text("Successfully requested")
            }
        },

    });
}


function addWishlist(id) {
    $(".spinner").show();

    $.ajax({
        type: "GET",
        url: "/updateWishlist?id=" + id,
        success: function (data) {
            ;
            console.log(JSON.parse(data));
            $(".spinner").hide();
            if (JSON.parse(data) === "failure") {
                toastr.error('Please sign in to update your wish list !');

            }
            else {
                $("#wish_" + id).attr("src", "../../assets/img/Added_WL_Right.png")

                toastr.success('Successfully added into your wish list ');
            }
        },
        error: function (err) {
            console.log(err);
            toastr.error("Something went wrong.Please try again !")
        }

    });
}


function textChange() {

    $(".spinner").show();
    var coupon = $("#coupon_code").val();
    var gift = $("#gift_card").val();
    if (coupon == "") {
        coupon = "null";
    }

    if (gift == "") {
        gift = "null";
    }
    var termSelected = $('#sel1 option:selected').attr('id');
    if (termSelected === 0 || termSelected === null) {
        toastr.error("Please select a month to renew !");
        return false;
    }
    var fee = $("#sel1").val();
    var email = localStorage.getItem("email");
    var membership = localStorage.getItem("membership");

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/renewal_payment?term=" + termSelected + "&delivery_fees=" + fee + "&coupon_code=" + coupon + "&gift_card_no=" + gift + "",
        success: function (data_new) {
            console.log(data_new);

            $(".spinner").hide();
            if (data_new.success == true) {
                console.log(data_new.result.payable_amount);
                $("#textSpan").text("You have to pay Rs  " + data_new.result.payable_amount);
                $("#renewBUtton").show();

            }
            else {
                toastr.error("Something went wrong !")
            }


        },

    });


}


function proceedRenew() {
    $(".spinner").show();
    var coupon = $("#coupon_code").val();
    var gift = $("#gift_card").val();
    if (coupon == "") {
        coupon = "null";
    }

    if (gift == "") {
        gift = "null";
    }
    var termSelected = $('#sel1 option:selected').attr('id');
    if (termSelected === 0 || termSelected === null) {
        toastr.error("Please select a month to renew !");
        return false;
    }
    var fee = $("#sel1").val();
    var email = localStorage.getItem("email");
    var membership = localStorage.getItem("membership");

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/renewal_payment?term=" + termSelected + "&delivery_fees=" + fee + "&coupon_code=" + coupon + "&gift_card_no=" + gift + "",
        success: function (data_new) {
            console.log(data_new);

            if (data_new.success == true) {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: "/confirm_renewal?payable_amount=" + data_new.result.payable_amount + "&convenience_fee=" + data_new.result.convenience_fee + "&renewal_payment_type=" + data_new.result.renewal_payment_type + "&plan_id=" + data_new.result.plan_id + "&card_number=" + data_new.result.card_number + "&member_id=" + data_new.result.member_id + "&delivery_fees=" + data_new.result.delivery_fees + "&delivery_fees_dormant=" + data_new.result.delivery_fees_dormant + "&delivery_option=" + data_new.result.delivery_option + "&term=" + data_new.result.term + "&member_branch_id=" + data_new.result.member_branch_id + "&overdue_adjustment=" + data_new.result.overdue_adjustment + "&reward_points=" + data_new.result.reward_points + "&gift_card_no=" + data_new.result.gift_card_no + "&qc_flag=" + data_new.result.qc_flag + "&redeemed_amount=" + data_new.result.redeemed_amount + "&pin=" + data_new.result.pin + "",
                    success: function (data) {


                        if (data.success == true) {
                            var orderNumber = data.result.transaction.transaction.order_number;
                            var amount = data.result.transaction.transaction.amount;
                            console.log(orderNumber);
                            console.log(amount);
                            saveSession(orderNumber, amount);
                        }


                    },

                });

            }


        },

    });


}

function saveSession(order, amount) {
    $.ajax({
        type: "GET",
        url: "/saveSession?orderNumber=" + order + "&amount=" + amount,
        success: function (data_new) {
            ;
            if (data_new === "success") {
                window.location.href = "/PaytmKit/pgRedirect.php";
                return false;
            }

            window.location.href = "/PaytmKit/pgRedirect.php"


        },

    });
}
function couponClick() {
    $(".spinner").show();
    var coupon = $('#coupon_code').val();
    var planid = $(".planIdDIV").attr('id');
    var mon = $('#sel1 option:selected').attr('id');
    $.ajax({
        type: "POST",
        url: "/couponValidate",
        data: {'coupon': coupon, 'planid': planid, 'months': mon},
        success: function (data_new) {
            $(".spinner").hide();
            data_new = JSON.parse(data_new);
            console.log(data_new);
            if (data_new['success'] == true) {
                toastr.success('Coupon accepted !');
            }
            else {

                toastr.error(data_new['errors']);

            }


        },

    });
};
function GiftClick() {


    var gift_card = $('#gift_card').val();
    var gift_card_pin = $('#gift_card_pin').val();
    var total_amnt = $('#sel1').val();
    $.ajax({
        type: "POST",
        url: "/giftcardValidate",
        data: {'gift_card': gift_card, 'gift_card_pin': gift_card_pin, 'total_amnt': total_amnt},
        success: function (data_new) {
            data_new = JSON.parse(data_new);
            console.log(data_new);
            if (data_new['success'] == true) {
                toastr.success('Gift card accepted !');
            }
            else {

                toastr.error(data_new['errors']);

            }

        },

    });
};


function breakValidate() {
    $(".spinner").show();
    var month = $("#monthSel").val();
    if (month === "" || month === 0) {
        toastr.error("Please select a month");
        return false;
    }
    var date = $("#datePickInput").val();
    var email = localStorage.getItem("email");
    var membership = localStorage.getItem("membership");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/sh_payment?no_of_months=" + month + "&holiday_start_date=" + date + "",
        success: function (data_new) {
            console.log(data_new);

            $(".spinner").hide();
            if (data_new.success == true) {

                date = new Date(data_new.result.sh.subscription_holiday.holiday_end_date);
                console.log(date)
                var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
                // 01, 02, 03, ... 10, 11, 12
                var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
                // 1970, 1971, ... 2015, 2016, ...
                var yyyy = date.getFullYear();
                date = dd + "-" + MM + "-" + yyyy;

                $("#textSpanBreak").text("You have to pay Rs - " + data_new.result.sh.subscription_holiday.payable_amount);
                $("#textSpanBreakDate").text("Holiday end date - " + date);
                $(".breakAmount").text(data_new.result.sh.subscription_holiday.payable_amount);
                $(".breakDate").text(date);
                $(".breakAMountPay").text(data_new.result.sh.subscription_holiday.paid_amount);
                $("#BreakBUtton").show();
                $("#textSpanBreak").show();
                $("#textSpanBreakDate").show();
                $("#hrTag").show();
                $("#aboutBreak").show();

            }
            else {
                toastr.error(data_new.errors)
            }


        },

    });
}


function proceedBreak() {
    $(".spinner").show();
    var amount = $(".breakAmount").text();
    var paid = $(".breakAMountPay").text();
    if (paid === null) {
        paid = 0
    }
    var Enddate = $(".breakDate").text();
    var month = $("#monthSel").val();
    var date = $("#datePickInput").val();
    var email = localStorage.getItem("email");
    var membership = localStorage.getItem("membership");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/confirm_sh?&no_of_months=" + month + "&holiday_start_date=" + date + "&created_in=810&holiday_end_date=" + Enddate + "&paid_amount=" + paid + "&payable_amount=" + amount + "",
        success: function (data_new) {
            $(".spinner").hide();
            console.log(data_new);
            $(".spinner").hide();
            if (data_new.success == true) {
                orderNumber = data_new.result.transaction.transaction.order_number;
                amountTotal = data_new.result.transaction.transaction.amount;
                if(parseInt(amountTotal) ===0 )
                {
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: "/noAmountBreak?order=" + orderNumber,
                        success: function (data_new) {
                            console.log(data_new);
                            if(data_new=="success")
                            {
                                toastr.success('Successfully applied').css('width','500px')
                            }
                            else{
                                toastr.error('Something went wrong! ').css('width','500px')

                            }
                        },
                    });
                }
                saveSession(orderNumber, amount);

            }
            else {
                toastr.error(data_new.errors)
            }


        },

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


function hideAlert() {
    $("#alertDiv").hide();
}


function breakButton() {
    $("#demo").collapse('hide');
}
function RenewButton() {

    $("#break").collapse('hide');
}
function giveReviewStar() {
    var id = $("#book_id").val();
    var ratings = $("#ratings-hidden").val();
    var review = $("#new-review").val();

    if (ratings === "" || ratings === 0) {
        toastr.error('Please give a rating in order to submit!').css("width","500px");;
        return false;
    }
    if (review === "" || review === 0) {
        toastr.error('Please give a review in order to submit!').css("width","500px");;
        return false;
    }
    $(".spinner").show();

    $.ajax({
        type: "POST",
        url: "/submitReview",
        data: {'rate': ratings, 'review': review, 'title': id},

        success: function (data) {
            console.log(JSON.parse(data));
            $(".spinner").hide();
            $(".spinner").hide();
            if (JSON.parse(data) === "failure") {
                toastr.error('Please sign in to submit a review!').css("width","500px");;
                $('#rateModal').modal('hide');

                return false;
            }
            else {
                toastr.success('Successfully submitted your review, Thank you!') .css("width","500px");;
                $('#rateModal').modal('hide');

            }
            $(".spinner").hide();
        },
        error: function (err) {
            console.log(err);
            toastr.error('Something went wrong  !');
            $(".spinner").hide();

        }

    });
}


function statusCheck(elem, id) {
    $(".spinner").show();

    var idTag = $(elem).attr('id');

    $.ajax({
        type: "GET",
        url: "/getStatusDelivery?id=" + id,
        success: function (data_new) {
            $(".spinner").hide();
            data_new = JSON.parse(data_new);
            $("#" + idTag).hide();
            $("#message_" + id).css("display", 'inline-block');
            $("#message_" + id).text(data_new)

        },
        error: function (err) {
            console.log(err);
            toastr.error("Something went wrong.Please try again !")
        }

    });
};
