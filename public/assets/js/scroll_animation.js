(function($) {

    $.fn.visible = function(partial) {

        var $t            = $(this),
            $w            = $(window),
            viewTop       = $w.scrollTop(),
            viewBottom    = viewTop + $w.height(),
            _top          = $t.offset().top,
            _bottom       = _top + $t.height(),
            compareTop    = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;

        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };

})(jQuery);


/* activate scrollspy menu */
$('body').scrollspy({
    target: '#navbar-collapsible',
    offset: 50
});

/* smooth scrolling sections */
$('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top - 50
            }, 1000);
            return false;
        }
    }
});


var aniClass = "pullDown";
$(".dropdown-menu li a").click(function(){
    var selText = $(this).text();
    $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
    aniClass = selText;
});


function applyAnimation(){
    var imagePos = $(this).offset().top;

    var topOfWindow = $(window).scrollTop();
    var repeat = false;
    if (imagePos < topOfWindow+500) {
        var ele = $(this);
        ele.addClass(aniClass);

        if (repeat) {
            setTimeout(function(){
                ele.removeClass(aniClass);
            },1000);
        }
    }
}

$('h1').each(applyAnimation);
$(window).scroll(function() {
    $('i,img,.list-group').each(applyAnimation);
});