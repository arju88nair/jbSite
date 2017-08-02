function placeOrder(e) {
    logClick("Action","Rent",e);

    $(".spinner").show(), $.ajax({
        type: "GET", url: "/placeOrder?id=" + e, success: function (e) {
            console.log(e), "failure" === JSON.parse(e) ? ($(".spinner").hide(), toastr.error("Please sign in to order the book !"), $(window).scrollTop($("#signin").offset().top)) : ($(".spinner").hide(), e = JSON.parse(e), console.log(e.success), "false" === e.success ? toastr.warning(e.errors).css("width", "500px") : toastr.success("Successfully added !"))
        }
    })
}
function wishlistAdd(e) {
    logClick("Action","Wishlist",e);

    var t = localStorage.getItem("flag");
    return "false" === t ? (toastr.error("Please sign in to wish list a book !"), !1) : ($(".spinner").show(), void $.ajax({
        type: "GET",
        url: "/updateWishlist?id=" + e,
        success: function (e) {
            "failure" === JSON.parse(e) ? toastr.error("Please sign in to update wish list  !") : toastr.success("Successfully updated your wishlist !"), $(".spinner").hide()
        },
        error: function (e) {
            console.log(e), toastr.error("Something went wrong  !"), $(".spinner").hide()
        }
    }))
}
function logClick(e,page,reference) {
    $.ajax({
        type: "GET", url: "/insertLog?type=" + e+"&page="+page+"&refer="+reference, success: function (e) {
        }
    })
}
function searchClick() {
    var e = $("#srch-term").val();
    "" !== e && (window.location.href = "/search?q=" + e)
}

var membership, email;
$(document).ready(function () {
    $("#memberModel").on("hidden.bs.modal", function () {
        window.location.href = "/shelf"
    }), $("#save_member_value").click(function () {
        $(".spinner").show();
        var e = $("input[name='memberRadio']:checked").val();
        e ? $.ajax({
            type: "GET", url: "/updateMemberSession?membership=" + e, success: function (e) {
                $(".spinner").hide(), window.location.href = "/shelf"
            }, error: function (e) {
                $(".spinner").hide(), toastr.error("Something went wrong, Please try again !").css("width", "500px"), console.log(e.responseText)
            }
        }) : toastr.error("Please select a card number to proceed")
    });
    var e = new Bloodhound({
        datumTokenizer: function (e) {
            return Bloodhound.tokenizers.whitespace(e.value)
        }, queryTokenizer: Bloodhound.tokenizers.whitespace, remote: {
            url: "/typeahead?", replace: function (e, t) {
                return val = $("#srch-term").val(), val ? e + "text=" + encodeURIComponent(val) + "&page=1" : e
            }, filter: function (e) {
                return $.map(e, function (e) {
                    return {value: e.name, link: e.id}
                })
            }
        }, limit: 10
    });
    e.initialize(), $("#srch-term").typeahead(null, {
        displayKey: "value",
        source: e.ttAdapter(),
        templates: {
            empty: ['<div class="empty-message text-center">', "No titles found.<br>", '<a rel="external" data-ajax="false" href="/search" class="text-center">More Advanced Search</a>', "</div>"].join("\n"),
            suggestion: function (e) {
                return console.log(e), console.log(e.value), ['<p><a rel="external" data-ajax="false" href="/' + e.value.replace(/\s+/g, '-') + '/book_details/' + e.link + '">' + e.value + "</a></p>"].join("\n")
            }
        }
    }), $("#shareModal").on("show.bs.modal", function (e) {
        var t = $(e.relatedTarget).data("id"), o = $(e.relatedTarget).data("title");
        //$("#sharefb").attr("href", "http://www.facebook.com/sharer.php?u=http://justbooks.in/book_details/" + t + "/" + o + "&title=Reading " + o + ". I found"+ t +" Rented from Justbooks."), $("#sharegp").attr("href", "https://plus.google.com/share?url=http://justbooks.in/book_details/" + t + "/" + o), $("#sharetw").attr("href", "https://twitter.com/share?url=http://justbooks.in/book_details/" + t + "/" + o + "&amp;text=Reading %20" + o + ".Get%20it%20from%20JustBooks.in&amp;hashtags=justbookclc.com")
        $("#shareModal").on("show.bs.modal", function (e) {
            var t = $(e.relatedTarget).data("id"), o = $(e.relatedTarget).data("title");
            $("#sharefb").attr("href", "http://www.facebook.com/sharer.php?u=http://justbooks.in/book_details/" + t + "/" + o + "&title=I found " + o + " on JustBooks and thought you might find it interesting! Sign up today to read"),
            $("#sharegp").attr("href","https://plus.google.com/share?url=http://justbooks.in/book_details/" + t + "/" + o),
            $("#sharetw").attr("href", "https://twitter.com/share?url=http://justbooks.in/book_details/" + t  + "/" + o + "&amp;text=I found" + o + "  From @JustBooksCLC&amp;hashtags=justbookclc.com")
        });
    });
    var t = window.outerWidth;
    750 > t ? toastr.options = {
        closeButton: !0,
        debug: !1,
        newestOnTop: !1,
        progressBar: !1,
        positionClass: "toast-top-center",
        preventDuplicates: !1,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    } : toastr.options = {
        closeButton: !0,
        debug: !1,
        newestOnTop: !1,
        progressBar: !1,
        positionClass: "toast-bottom-center",
        preventDuplicates: !1,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    }, $("#srch-term").keypress(function (e) {
        var t = e.which;
        return 13 == t ? (searchClick(), !1) : void 0
    }), $(".loginPwd").keypress(function (e) {
        var t = e.which;
        return 13 == t ? (signupClick(), !1) : void 0
    }), $.ajax({
        type: "GET", url: "/getSessions", success: function (e) {
            e = JSON.parse(e), membership = e.session, localStorage.setItem("membership", membership), localStorage.setItem("email", e.email), console.log(membership)
        }
    })
}), $.ajax({
    type: "GET", url: "/loginValidate", success: function (e) {
        console.log(e)
    }, error: function (e) {
        toastr.error("Wrong credentials, Please try again !"), console.log(e.responseText)
    }
});

$(document).ready(function () {
    // on click SignIn Button checks for valid email and all field should be filled


    // on click signup It Hide Login Form and Display Registration Form
    $(".signup").click(function () {

        $(".loginDIv").slideUp("slow", function () {
            $(".login_form_fram_second").slideDown("slow");
        });
    });

    // on click signin It Hide Registration Form and Display Login Form
    $(".signin").click(function () {


        $(".login_form_fram_second").slideUp("slow", function () {
            $(".loginDIv").slideDown("slow");
        });
    });

});


function signupClick() {

    var username = $("#username").val();
    if (username == "" || username == 0) {
        toastr.error("Please enter an email !");
        return false;
    }

    var password = $("#password").val();
    if (password == "" || username == 0) {
        toastr.error("Please enter password !");
        return false;
    }
    $(".spinner").show();

    $.ajax({
        type: "GET",
        url: "/login/" + username + "/" + password + "",
        success: function (data) {
            $(".spinner").hide();


            if (!data || data === false || data === 'false' || data == 'null' || data.length === 0 || parseInt(data) === 0 ) {
                toastr.error('Wrong credentials, Please try again !');
                $(".spinner").hide();
                return false

            }
            else {
                data = JSON.parse(data)
                if (data.length === 1) {

                    $(".login_form_fram_one").hide();
                    $("#main").hide();
                    $("#first").hide();
                    $("#shelfButton").show();
                    toastr.success('Successfully signed in !');
                    localStorage.setItem("flag", true)
                    $("#first").hide();
                    $("#main").hide();
                    logClick("Log in click",'Login','User');
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

                    ga('create', 'UA-102352169-1', 'none');
                    ga('send', 'event', 'Clicks', 'Login of user ' + username + '', 'First Screen');

                    logClick('Login of user ' + username + '','Login',username);
                    window.location.href = "/shelf";

                    return false;
                }
                else{
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

                    ga('create', 'UA-102352169-1', 'none');
                    ga('send', 'event', 'Clicks', 'Login of user ' + username + '', 'First Screen');

                    logClick('Login of user ' + username + '','Login',username);

                    for(var i=0;i<data.length;i++)
                    {
                        console.log(data);console.log(data[i])

                        $("#memberContent").append('<div class="radio"><label><input type="radio" name="memberRadio" value="'+data[i]['MEMBERSHIP_NO']+'">'+data[i]['MEMBERSHIP_NO']+'</label></div>')

                    }
                    $('#memberModel').modal('show');



                }
            }


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
function signupClick2() {

    var username = $("#username2").val();
    if (username == "" || username == 0) {
        toastr.error("Please enter an email !");
        return false;
    }

    var password = $("#password2").val();
    if (password == "" || username == 0) {
        toastr.error("Please enter password !");
        return false;
    }
    $(".spinner").show();

    $.ajax({
        type: "GET",
        url: "/login/" + username + "/" + password + "",
        success: function (data) {
            $(".spinner").hide();


            if (data === false || data === 'false') {
                toastr.error('Wrong credentials, Please try again !');
                $(".spinner").hide();
                return false

            }
            else {
                data = JSON.parse(data)
                if (data.length === 1) {

                    $(".login_form_fram_one").hide();
                    $("#main").hide();
                    $("#first").hide();
                    $("#shelfButton").show();
                    toastr.success('Successfully signed in !');
                    localStorage.setItem("flag", true)
                    $("#first").hide();
                    $("#main").hide();
                    logClick("Log in click",'Login','User');
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

                    ga('create', 'UA-102352169-1', 'none');
                    ga('send', 'event', 'Clicks', 'Login of user ' + username + '', 'First Screen');

                    logClick('Login of user ' + username + '','Login',username);
                    window.location.href = "/shelf";

                    return false;
                }
                else{
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

                    ga('create', 'UA-102352169-1', 'none');
                    ga('send', 'event', 'Clicks', 'Login of user ' + username + '', 'First Screen');

                    logClick('Login of user ' + username + '','Login',username);
                    for(var i=0;i<data.length;i++)
                    {
                        $("#memberContent").append('<div class="radio"><label><input type="radio" name="memberRadio" value="'+data[i]['MEMBERSHIP_NO']+'">'+data[i]['MEMBERSHIP_NO']+'</label></div>')

                    }
                    $('#memberModel').modal('show');



                }
            }


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


function forgotPassword() {

    var email = $("#forgetEmail").val();
    if (email == "" || email == 0) {
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
function forgotPassword2() {

    var email = $("#forgetEmail2").val();
    if (email == "" || email == 0) {
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
