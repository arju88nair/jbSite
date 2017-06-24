
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
                $(window).scrollTop($('#signin').offset().top);

            }
            else {
                $("#wish_"+id).attr("src","../../assets/img/Added_WL_Right.png")
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
function checkAvailability(id) {
    var flag = localStorage.getItem("flag");
    if (flag === "false") {
        toastr.error("Please sign in to check availability of a book !");
        return false;
    }

    $(".spinner").show();
    $.ajax({
        type: "GET",
        url: "/checkAvailability?id=" + id,
        success: function (data) {
            $(".spinner").hide();

            data = JSON.parse(data);
            console.log(data)
            if (data['success'] === true) {
                toastr.success(data['result']['member_cross_reference']['status']);

            }
            if (data['success'] == "failure") {
                toastr.error('Please sign in to check availability  !');
            }

        },
        error: function (err) {
            console.log(err);
            toastr.error('Something went wrong  !');
            $(".spinner").hide();

        }

    });
}




function getCardRelated(data, visibleCardCount,ids,wishlist) {
    var response = '', items = 0;
    var final_response = '';
    for (var i = 0; i < data.length; i++) {
        items++;
        var active = '';
        if (i == 0) {
            active = "active";
        }

        if(ids.indexOf(parseInt(data[i]['_source'].title_id)) != -1)
        {
            var text="Rented";
            action="";
        }
        else{
            var action="\'placeOrder("+ data[i]['_source'].title_id + ");\'"

            text="Rent";
        }
        if(wishlist.indexOf(parseInt(data[i]['_source'].title_id)) != -1)
        {
            var images="../../assets/img/Added_WL_Right.png"
            wish="";
        }
        else{
            images="../../assets/img/Added_WL_50.png";
            var wish="\'wishlistAdd(" + data[i]['_source'].title_id + ");\'";
        }

        response += '<div class="col-md-2" style=width:18%;>' +
            '<div class="item item_shadow">' +
            '<div class="img_block_books"><a href="/book_details/' + data[i]['_source'].title_id + '/' + data[i]['_source'].title + '"><img src="' + data[i]['_source'].image_url + '"  onerror="this.src=\'../../assets/images/Default_Book_Thumbnail.png\'"></a></div>' +
            '<div class="carousel_body_book">' +
            '<div class="carousel_title_book"><h5 title="' + data[i]['_source'].title + '">' + data[i]['_source'].title + '</h5></div>' +
            '<div class="carousel_desc">' +
            '<div class="fram_btn">' +
            '<a    href="javascript:void(0)" class="shortcode_button btn_small btn_type1" title="Rent" onclick='+action+' id="rent_'+data[i]['_source'].title_id+'">'+text+'</a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Wishlist" onclick='+wish+'><img id="wish_'+data[i]['_source'].title_id+'" class="wishlist_btn" src='+images+' alt="Smiley face" height="25" width="25"></a>' +
            '<a href="javascript:void(0)" class="tiptip" title="Share" data-id="' + data[i]['_source'].title_id + '" data-toggle="modal" data-target="#shareModal"><img  class="share_btn" src=../../assets/img/Engage.png alt="Smiley face" height="25" width="25"></a>' +

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
                $(window).scrollTop($('#signin').offset().top);

            }
            else {
                $(".spinner").hide();
                data=JSON.parse(data);
                console.log(data['success'])
                if(data['success'] === "false")
                {
                    toastr.warning(data['errors'])
                }else{
                    $("#rent_"+id).text("Rented")

                    toastr.success('Successfully added !');

                }
            }
        },

    });
}

function placePickup(elem, title) {


    var id = $(elem).attr('id');

    $(".spinner").show();

    $.ajax({
        type: "POST",
        url: "/placePickup",
        data: {'rental_id': id, 'title': title},
        success: function (data) {
            $(".spinner").hide();
            console.log(JSON.parse(data));
            data = JSON.parse(data);
            if (data['success'] === "false") {

                toastr.error(data['errors'])

            }
            if (data['success'] === 'true') {

               toastr.success("Successfully requested !")

            }
            else {

            }
        },

    });
}
