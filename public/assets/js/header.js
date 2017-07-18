function placeOrder(e) {
    $(".spinner").show(), $.ajax({
        type: "GET", url: "/placeOrder?id=" + e, success: function (e) {
            console.log(e), "failure" === JSON.parse(e) ? ($(".spinner").hide(), toastr.error("Please sign in to order the book !"), $(window).scrollTop($("#signin").offset().top)) : ($(".spinner").hide(), e = JSON.parse(e), console.log(e.success), "false" === e.success ? toastr.warning(e.errors).css("width", "500px") : toastr.success("Successfully added !"))
        }
    })
}
function wishlistAdd(e) {
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
function logClick(e) {
    $.ajax({
        type: "GET", url: "/insertLog?type=" + e, success: function (e) {
        }
    })
}
function searchClick() {
    var e = $("#srch-term").val();
    "" !== e && (window.location.href = "/search?q=" + e)
}
$(document).on("click", "a", function (e) {
    logClick("Navigation  clicked on " + $(this).attr("href")), ga("send", "event", "Navigation", $(this).attr("href"), "First Screen")
});
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
                return console.log(e.link), console.log(e.value), ['<p><a rel="external" data-ajax="false" href="/book_details/' + e.link + "/" + e.value + '">' + e.value + "</a></p>"].join("\n")
            }
        }
    }), $("#shareModal").on("show.bs.modal", function (e) {
        var t = $(e.relatedTarget).data("id"), o = $(e.relatedTarget).data("title");
        $("#sharefb").attr("href", "http://www.facebook.com/sharer.php?u=http://justbooks.in/book_details/" + t + "/" + o + "&title=Reading " + o + ". Get it from JustBooks.in"), $("#sharegp").attr("href", "https://plus.google.com/share?url=http://justbooks.in/book_details/" + t + "/" + o), $("#sharetw").attr("href", "https://twitter.com/share?url=http://justbooks.in/book_details/" + t + "/" + o + "&amp;text=Reading %20" + o + ".Get%20it%20from%20JustBooks.in&amp;hashtags=justbookclc.com")
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