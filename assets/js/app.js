!(function ($){

    "use strict"; // jsHint

    window.APPLICATION   = {};
    var App                  = window.APPLICATION;

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
        App.modals();
        App.animations();
    };

    /* SET ELEMENTS
    ------------------------------------------------------------------------ */
    App.setElements = function(){
        App.el = {
            
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
            // chrome_fix_2();
        }
    };



    
    /* EVENTS
    ------------------------------------------------------------------------ */
    App.events = function(){

       

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
                duration    = (target.offset().top - $(window).scrollTop());

            animate_scrollTop(target, duration, 'swing', 15);

        });
    };

    



    /* MODALS
    ------------------------------------------------------------------------ */
    App.modals = function() {

        var modals          = App.el.modal,
            modal_bay       = App.el.modal_bay,
            modal_trigger   = $('.modal-trigger'),
            modal_close     = $('.modal-close');
            

        // move all modals to modal bay
        if ( modals )
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


            if( input == secret ) {
                console.log('konami code fired!');
                
            }
        })
    }

    App.konamiCode();




    /* ANIMATE SCROLLTOP
    ------------------------------------------------------------------------ */
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




    /* DOCUMENT READY
    ------------------------------------------------------------------------ */
    $(document).ready(function(){
        
        App.init();


    });

    /* WINDOW LOAD
    ------------------------------------------------------------------------ */
    $(window).load(function(){
        

    });

    /* WINDOW SCROLL
    ------------------------------------------------------------------------ */
    $(window).on('scroll', function(){


    });


    /* WINDOW RESIZE
    ------------------------------------------------------------------------ */
    $(window).resize(function(){   
        


    }).trigger('resize');



    /* ORIENTATION CHANGE (requires jQuery mobile)
    ------------------------------------------------------------------------ */
    window.addEventListener("orientationchange", function() {
        
        

    }, false);



    /* SELF INVOKING ANONYMOUS FUNCTION(s)
    ------------------------------------------------------------------------ */
    (function(){ 

          

    })(); 

})(jQuery);