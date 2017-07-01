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
                $(window).scrollTop($('#signin').offset().top);

            }
            else {
                $(".spinner").hide();
                data = JSON.parse(data);
                console.log(data['success'])
                if (data['success'] === "false") {
                    toastr.warning(data['errors'])
                } else {
                    toastr.success('Successfully added !');

                }
            }
        },

    });
}
function wishlistAdd(id) {
    var flag = localStorage.getItem("flag");
    if (flag === "false") {
        toastr.error("Please sign in to wish list a book !");
        return false;
    }

    $(".spinner").show();

    $.ajax({
        type: "GET",
        url: "/updateWishlist?id=" + id,
        success: function (data) {
            if (JSON.parse(data) === "failure") {
                toastr.error('Please sign in to update wish list  !');
            }
            else {
                toastr.success("Successfully updated your wishlist !")
            }
            $(".spinner").hide()
        },
        error: function (err) {
            console.log(err);
            toastr.error('Something went wrong  !');
            $(".spinner").hide();

        }

    });
}
function logClick(type) {
    $.ajax({
        type: "GET",
        url: "/insertLog?type=" + type + "",
        success: function (data) {
        },


    });
}


$(document).on('click', 'a', function (e) {
    logClick("Navigation  clicked on " + $(this).attr('href') + "");
    ga('send', 'event', 'Navigation', $(this).attr('href'), 'First Screen');

});


var membership;
var email;
function searchClick() {

    var term = $("#srch-term").val();
    if (term !== "") {
        window.location.href = "/search?q=" + term + "";

    }

}
$(document).ready(function () {

    //Instantiate the Bloodhound suggestion engine
    var books = new Bloodhound({
        datumTokenizer: function (datum) {
            return Bloodhound.tokenizers.whitespace(datum.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: 'https://rec.justbooks.in/getSuggestBooks?',
            replace: function (url, uriEncodedQuery) {

                val = $('#srch-term').val();
                if (!val) return url;
                return url + 'text=' + encodeURIComponent(val) + '&page=1'
            },
            filter: function (books) {
                // Map the remote source JSON array to a JavaScript object array
                return $.map(books, function (book) {
                    return {
                        value: book.name,
                        link: book.id
                    };
                });
            },

        },
        limit: 10,

    });

// Initialize the Bloodhound suggestion engine
    books.initialize();

// Instantiate the Typeahead UI
    $('#srch-term').typeahead(null, {
        displayKey: 'value',
        source: books.ttAdapter(),
        templates: {
            empty: [
                '<div class="empty-message text-center">',
                'No movies found.<br>',
                '<a href="/search" class="text-center">More Advanced Search</a>',
                '</div>',
            ].join('\n'),
            suggestion: function (data) {
                console.log(data.link)
                console.log(data.value)
                return ['<p><a href="/book_details/' + data.link + '/' + data.value + '">' + data.value + '</a></p>'].join('\n');
            },

        }

    });


//            var movies = new Bloodhound({
//                datumTokenizer: function (datum) {
//                    return Bloodhound.tokenizers.whitespace(datum.value);
//                },
//                queryTokenizer: Bloodhound.tokenizers.whitespace,
//                remote: {
//                    url: 'http://rec.justbooksclc.com/getSuggestBooks?',
//                    filter: function (movies) {
//                        // Map the remote source JSON array to a JavaScript object array
//                        return $.map(movies.results, function (movie) {
//                            console.log(movie.name)
//                            return {
//                                value: movie.name,
//                                link: movie.id
//                            };
//                        });
//                    }
//                }
//            });
//
//// Initialize the Bloodhound suggestion engine
//            movies.initialize();
//
//// Instantiate the Typeahead UI
//            $('#srch-term').typeahead(null, {
//                displayKey: 'value',
//                source: movies.ttAdapter(),
//                templates: {
//                    empty: [
//                        '<div class="empty-message text-center">',
//                        'No movies found.<br>',
//                        '<a href="/search" class="text-center">More Advanced Search</a>',
//                        '</div>',
//                    ].join('\n'),
//                    suggestion: function (data) {
//                        return ['<p><a href="' + data.link + '">' + data.value + '</a></p>'].join('\n');
//                    },
//                }
//            });
//
//
//


    $('#shareModal').on('show.bs.modal', function (e) {

        //get data-id attribute of the clicked element
        var id = $(e.relatedTarget).data('id');
        var title = $(e.relatedTarget).data('title');
        //populate the textbox
        $("#sharefb").attr("href", "http://www.facebook.com/sharer.php?u=http://justbooks.in/book_details/" + id + "/" + title + "&title=Reading " + title + ", rented from JustBooks");
        $("#sharegp").attr("href", "https://plus.google.com/share?url=http://justbooks.in/book_details/" + id + "/" + title);
        $("#sharetw").attr("href", "https://twitter.com/share?url=http://justbooks.in/book_details/" + id + "/" + title + "&amp;text=Reading %20" + title + "%20,%20rented%20from%20JustBooks&amp;hashtags=justbookclc.com");
        // $("#shareen").attr("href", "mailto:me@domain.com?subject=Hi, This might interest you ! http://justbooksclc.com/book_details/"+id);
        // $("#sharefb").attr("href", "http://www.facebook.com/sharer.php?u=http://justbooksclc.com/book_details/"+id);
    });


    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    $('#srch-term').keypress(function (e) {
        var key = e.which;
        if (key == 13) // the enter key code
        {
            searchClick();
            return false;
        }
    });

    $('.loginPwd').keypress(function (e) {
        var key = e.which;
        if (key == 13) // the enter key code
        {
            signupClick();
            return false;
        }
    });


//            $('header nav ul.menu > li > a').click(function(e) {
//                var $this = $(this);
//                $this.parent().siblings().removeClass('current-menu-parent').end().addClass('current-menu-parent');
//                e.preventDefault();
//            })
//

    $.ajax({
        type: "GET",
        url: "/getSessions",
        success: function (data) {
            data = JSON.parse(data);
            membership = data.session;
            localStorage.setItem("membership", membership);
            localStorage.setItem("email", data.email);
            console.log(membership);
        },

    });
});

$.ajax({
    type: "GET",
    url: "/loginValidate",
    success: function (data) {
        console.log(data);


    },
    error: function (err) {
        toastr.error('Wrong credentials, Please try again !');
        console.log(err.responseText)
    }

});

