console.log("hello world- from ayongwh");

/********To control page routing*********/
(function ($) {

    var app = $.sammy('#app-body', function () {
        this.use('Template');

        this.get('#/usum-bt-helper', function (context) {
            var str = location.href.toLowerCase();

            ga('set', 'page', '/usum-bt-helper');
            ga('send', 'pageview');

            context.app.swap('');
            context.render('/pages/UsumBtHelper.template', {})
                .appendTo(context.$element());
        })

        this.get('#/', function (context) {
            var str = location.href.toLowerCase();

            ga('set', 'page', '/VGC20TeamSearcher');
            ga('send', 'pageview');

            context.app.swap('');
            context.render('/pages/VGC20TeamSearcher.template', {})
                .appendTo(context.$element());
        });

        this.get('#/vgc19', function (context) {
            var str = location.href.toLowerCase();

            ga('set', 'page', '/VGC19TeamSearcher');
            ga('send', 'pageview');

            context.app.swap('');
            context.render('/pages/VGC19TeamSearcher.template', {})
                .appendTo(context.$element());
        });

        this.get('#/privacy', function (context) {
            var str = location.href.toLowerCase();

            ga('set', 'page', '/PrivacyPolicy');
            ga('send', 'pageview');

            context.app.swap('');
            context.render('/pages/PrivacyPolicy.template', {})
                .appendTo(context.$element());
        });

        this.notFound = function () {
            // do something 
        }

        this.before('.*', function () {
            var hash = document.location.hash;
            console.log(hash)
            $('nav').find('a').removeClass('active');
            $('nav').find("a[href='" + hash + "']").addClass("active");
        });

    });

    $(function () {
        app.run('#/');
    });

})(jQuery);
/********** go to top*/
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        $("#goToTopBtn").css("display", "block");
    } else {
        $("#goToTopBtn").css("display", "none");
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


