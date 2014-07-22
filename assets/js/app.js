!(function ($){

    "use strict"; // jsHint

    window.THROWBACKSUMMER   = {};
    var App                  = window.THROWBACKSUMMER;

    // user-agent && user-agent helper methods
    var ua                        = navigator.userAgent;
    var regex_apple_webkit        = new RegExp(/AppleWebKit\/([\d.]+)/);
    var result_apple_webkit_regex = regex_apple_webkit.exec(ua);
    var apple_webkit_version      = (result_apple_webkit_regex === null ? null : parseFloat(regex_apple_webkit.exec(ua)[1]));

    // global variables
    var GLOBALS = {
        // debug toggles
        debug           : true,

        // user-agents
        user_agent : {
          iOS         : (ua.match(/(iPad|iPhone|iPod)/g) ? true : false),
          iphone      : (ua.match(/(iPhone|iPod)/g) ? true : false),
          ipad        : (ua.match(/(iPad)/g) ? true : false),
          android     : (ua.match(/(Android)/g) ? true : false),
          mobile      : ((/Mobile|iPhone|iPod|BlackBerry|Windows Phone/i).test(ua || navigator.vendor || window.opera) ? true : false),
          mobile_all  : ((/Mobile|Android|iPhone|iPod|BlackBerry|Windows Phone/i).test(ua || navigator.vendor || window.opera) ? true : false)
        },

        browser : {
          // desktop_chrome   : (ua.indexOf('Android') <= -1 && ua.indexOf('iPhone') <= -1 && ua.indexOf('iPod') <= -1 && ua.indexOf('Mobile') <= -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') > -1),
          desktop_chrome   : (window.chrome ? true : false),
          iphone_chrome    : ((ua.match(/(iPod|iPhone|iPad)/) && ua.match(/AppleWebKit/) && ua.match('CriOS')) ? true : false),
          iphone_safari    : ((ua.match(/(iPod|iPhone|iPad)/) && ua.match(/AppleWebKit/) && !ua.match('CriOS')) ? true : false),
          android_native   : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') <= -1),
          android_chrome   : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') > -1),
          android_samsung  : (ua.indexOf('Android') > -1 && ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') > -1 && ua.indexOf('SCH') > -1)
        }
    }


    /* INITIATE FUNCTIONS
    ------------------------------------------------------------------------ */
    App.init = function(){
        App.setElements();
        App.initScripts();
        App.fixes();
        App.userAgentDetection();
        App.events();
        App.scroll();
        App.lazyLoadVideo();
        App.lightbox();
        App.modals();
        App.animations();
        App.sticky();
        App.headroom();
        App.hamburgerNav();
        App.tooltip();
    };

    /* SET ELEMENTS
    ------------------------------------------------------------------------ */
    App.setElements = function(){
        App.el = {
            wrap                : $('#wrap'),
            header              : $('#header'),
            mobile_menu_btn     : $('#mobile-menu-toggle'),
            mobile_nav_close    : $('#mobile-nav-close'),
            mobile_nav          : $('#mobile-nav'),
            tiles               : $('#tiles'),
            modal               : $('.modal'),
            modal_bay           : $('#modals'),
            vote_btn            : $('.btn-vote-ajax')
        };
    };


    /* PRE
    ------------------------------------------------------------------------ */
    App.initScripts = function(){

        // WOW.js
        if ( !window.WOW ) { 
            return false; 
        } else {
            new WOW().init();
        }


    }



    /* FIXES
    ------------------------------------------------------------------------ */
    App.fixes = function() {
        // invisible font fix for chrome
        if ( GLOBALS.browser.desktop_chrome ) {

            var chrome_fix_2 = function() {
                var orig_body_offset = $('body').offset();
                $('body').offset(orig_body_offset);
            }
            // Invoke Method 2
            chrome_fix_2();
        }
    };



    
    /* EVENTS
    ------------------------------------------------------------------------ */
    App.events = function(){

        // Already voted
        $('.voted').click(function (e) { 
            e.preventDefault();

            $(this).addClass('animated animated-500 shakeFast')
            console.log('Youve already voted.');
        });

        // isotope filters
        $('.isotope-filter').click(function (event) {
            event.preventDefault();

            var tiles       = $('#tiles'),
                cat_filter  = $(this).data('filter');

            $('#tiles').isotope({
                filter : cat_filter
            })
        })


    };




    /* USERAGENT
    ------------------------------------------------------------------------ */
    App.userAgentDetection = function(){

        if ( GLOBALS.user_agent.mobile ) {
            $('body').addClass('is_mobile');
        } else {
            $('body').addClass('non_mobile');
        }

    };



    /* ANIMATIONS
    ------------------------------------------------------------------------ */
    App.animations = function() {

        $('.bounceInUp')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
              $(this).toggleClass('animated bounceInUp');
            });
    }


    /* SCROLL (requires .scroll class on anchor)
    ------------------------------------------------------------------------ */
    App.scroll = function(){

        // <a> method manual
        $('a.scroll, li.scroll > a').click(function(e){
            e.preventDefault();

            var $this       = $(this),
                target_id   = $this.attr('href'),
                target      = $(target_id),
                // duration    = (target.offset().top - $(window).scrollTop());
                duration    = 500;

            animate_scrollTop(target, duration, 'swing', 15);

            // console.log(duration);

        });
    };

    

    /* LIGHTBOX
    ------------------------------------------------------------------------ */
    App.lightbox = function() {

        var lightbox = $('#lightbox');

        $('*[data-lightbox-bg-img]').click(function (e){
            var img = $(this);

            $('.page-overlay').addClass('show');
            setTimeout(function() {
                lightbox.addClass('show');
            }, 299)

            lightbox.empty();
            lightbox.append('<img src="'+img.attr('data-img-src')+'">');
        });
    }




    /* MODALS
    ------------------------------------------------------------------------ */
    App.modals = function() {

        var modals          = App.el.modal,
            modal_bay       = App.el.modal_bay,
            modal_trigger   = $('.modal-trigger'),
            modal_close     = $('.modal-close');
            

        // move all modals to modal bay
        modals.appendTo(modal_bay);

        modal_trigger.click(function (event) {
            event.preventDefault();

            var $this           = $(this),
                modal_target    = $($this.attr('href')),
                modal_cat_color = $('[data-cat-color]') ? $('[data-cat-color]').data('cat-color') : null;

            // if trigger also has class of 'modal-trigger-auth' ( modal only needs to fire is user is logged out )
            if ( $(this).hasClass('modal-trigger-auth') ) {
                if ( App.current_user.is_logged_in ) {
                    console.log('User is logged in so not firing modal');
                } else {
                    console.log('User is not logged in so firing auth modal');
                    modalEffects(modal_target);
                    $('input[name="cag_user_email"').focus();
                }
            } else {
                modalEffects(modal_target);
            }

            function modalEffects(target) {

                modal_bay.addClass('show');

                App.el.wrap.addClass('blur');

                target.addClass('show '+ modal_cat_color);

                // close via button
                modal_close.click(function() {
                    // App.el.wrap.removeClass('blur');
                    target.removeClass('show');
                    modal_bay.removeClass('show');
                });
                // close via esc key
                $(window).on('keydown', function (event) {

                    if ( event.keyCode == 27) {
                        // App.el.wrap.removeClass('blur');
                        target.removeClass('show');
                        modal_bay.removeClass('show');
                    }
                });
            }
        });

    }






    /* LAZYLOAD VIDEO
    ------------------------------------------------------------------------ */
    App.lazyLoadVideo = function() {

        $('.lazyload').click(function(){
            var $this           = $(this),
                video_id        = $this.data('video-id'),
                video_service   = $this.data('video-service'),
                width           = $this.width(),
                height          = $this.height();

                // console.log(width, height);

            // embed code builder function
            function buildEmbed(service, id) {
                if (service === 'youtube') {
                    var embed = '<iframe width="'+width+'" height="'+height+'" src="//www.youtube.com/embed/'+video_id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>';
                    return embed;
                }
                if (service === 'vimeo') {
                    var embed = '<iframe src="//player.vimeo.com/video/'+video_id+'?title=0&amp;autoplay=1&amp;byline=0&amp;portrait=0&amp;badge=0" width="'+width+'" height="'+height+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                    return embed;
                }
            }

            // build the embed code
            var embed_code = buildEmbed(video_service, video_id);

            // remove inner elements
            $this.find('iframe').remove();
            $this.find('img').remove();
            $this.find('.media-image-overlay').css('opacity', 0);
            $this.find('.media-image-icon').hide();
            $this.css('background-image', '');
            $this.find('.post-format-video-overlay').remove();

            // append the generated embed code
            if ( $this.find('iframe').length <= 0 ) {
                $this.append(embed_code);
            } else {
                // nothing
            }
        });
    }


    /* LAZYLOAD IMAGE - Run at window onload & scroll
    ------------------------------------------------------------------------ */
    App.lazyLoadImage = function(method) {

        if ( $('.lazyload').length <= 0 ) { return; }

        if ( method === 'delayed' ) {
            setTimeout(function(){
                $('.lazyload:in-viewport').addClass('show');
            }, 100);
        } else {
            $('.lazyload:in-viewport').addClass('show');
        }
    }


    /* STICKY JS
    ------------------------------------------------------------------------ */
    App.sticky = function() {

        if ( $('.sticky').length > 0 ) {
            $(window).scrollTop($(window).scrollTop()+1);
        } else {
            return false;
        }

        $('.sticky').each(function (item) {

            var offset = $(this).data('sticky-offset');

            if ( offset != null || offset !== '' ) {
                $(this).sticky({ topSpacing: offset });
            } else {
                $(this).sticky();
            }
        });
    }


    /* HEADROOM
    ------------------------------------------------------------------------ */
    App.headroom = function() {

        // $('body.is_mobile #header').headroom({
        //     tolerance : {
        //         up : 5,
        //         down : 25
        //     },
        // });
    }

    


    /* HAMBURGER NAV
    ------------------------------------------------------------------------ */
    App.hamburgerNav = function() {

        App.el.mobile_menu_btn.on('touchend', function (e){
            
            $(this).addClass('brown');

            App.el.mobile_nav.addClass('show');
            App.el.wrap.addClass('mobile-nav-show');
            App.el.header.addClass('mobile-nav-show');

        });

        App.el.mobile_nav_close.on('touchend', function (e) {

            $(this).removeClass('brown');

            App.el.mobile_nav.removeClass('show');
            App.el.wrap.removeClass('mobile-nav-show');
            App.el.header.removeClass('mobile-nav-show');

        });

        // App.el.mobile_nav.on('swipeleft', function (e) {

        //     App.el.mobile_nav.removeClass('show');
        //     App.el.wrap.removeClass('mobile-nav-show');

        // });

    }



    /* TOOLTIP
    ------------------------------------------------------------------------ */
    App.tooltip = function() {

        $('.help-tooltip').hover(function (event) {

            var $this           = $(this),
                tooltip_text    = $this.data('tooltip');

            // append el inside tooltip
            $this.html('<div class="help-tooltip-content">'+tooltip_text+'</div>');


        }, function (event) {
            $(this).find('.help-tooltip-content').remove();
        });

    }



    /* LOCATION HASH
    ------------------------------------------------------------------------ */
    App.locationHash = function(hash_string) {

        if( window.location.hash ) {
            var hash = window.location.hash.substring(1); 
            
            if ( hash === hash_string ) {
                return true;
            }
        } else {
            return false;
        }
    }




    /* KONAMI
    ------------------------------------------------------------------------ */
    App.konamiCode = function() {

        var secret = '38403840373937396665',
            input  = '',
            timer;

        $(document).keyup(function (e) {

            input += e.which;

            clearTimeout(timer);

            timer = setTimeout(function() {
                input = '';
            }, 500);

            // console.log(e.which, input);

            if( input == secret ) {
                console.log('konami code fired!');
                $('#e').append('<div class="mario"></div>');
            }
        })
    }

    App.konamiCode();




    // animate_scrollTop();
    function animate_scrollTop(target, duration, easing, offset){
        if(target){
            if(/(iPhone|iPod)\sOS\s6/.test(navigator.userAgent)){
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, duration, easing);
            } else {
                $('html, body').animate({
                    scrollTop: target.offset().top - (offset)
                }, duration, easing);
            }
        }
    }

    function elementInViewport(el) {
      var top = el.offsetTop;
      var left = el.offsetLeft;
      var width = el.offsetWidth;
      var height = el.offsetHeight;

      while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }

      return (
        top < (window.pageYOffset + window.innerHeight) &&
        left < (window.pageXOffset + window.innerWidth) &&
        (top + height) > window.pageYOffset &&
        (left + width) > window.pageXOffset
      );
    }




    /* DOCUMENT READY
    ------------------------------------------------------------------------ */
    $(document).ready(function(){
        
        App.init();


    });

    /* WINDOW LOAD
    ------------------------------------------------------------------------ */
    $(window).load(function(){
        
        App.lazyLoadImage();

        /**
         * Flexslider Init
         */
        $('.flexslider').flexslider({});


    });

    /* WINDOW SCROLL
    ------------------------------------------------------------------------ */
    $(window).on('scroll', function(){

        // App.lazyLoadImage();


    });


    /* WINDOW RESIZE
    ------------------------------------------------------------------------ */
    $(window).resize(function(){   
        


    }).trigger('resize');



    /* ORIENTATION CHANGE (requires jQuery mobile)
    ------------------------------------------------------------------------ */
    window.addEventListener("orientationchange", function() {
        
        // console.log('Orientation is: ', window.orientation);

    }, false);



    /* SELF INVOKING ANONYMOUS FUNCTION(s)
    ------------------------------------------------------------------------ */
    (function(){ 

          

    })(); 

})(jQuery);
