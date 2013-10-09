!(function ($){

    "use strict"; // jsHint

    window.FIFTYFRAMEWORK = {};
    
    var FF      = window.FIFTYFRAMEWORK;
    var iOS     = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
    var DEBUG   = false;

    /* INITIATE FUNCTIONS
    ================================================== */
    FF.init = function(){
        FF.setElements();
        FF.setVars();
        FF.basics();
        FF.scroll();
        FF.modalEffects();
        FF.fauxPlaceholders();
        FF.regex();
        FF.lazyLoadVideo();
        FF.collapsableSidebar();
        FF.backStretch();
        FF.debugBox();
        FF.hamburgerNav();
    };

    /* SET ELEMENTS
    ================================================== */
    FF.setElements = function(){
        FF.el = {};
        FF.el.page_overlay          = $('.page-overlay');
        FF.el.page_wrap             = $('.page-wrap');
        FF.el.mobile_menu_btn       = $('#mobile-menu-toggle');
        FF.el.debug_box             = $('#debug_box');
    };


    /* SET VARIABLES
    ================================================== */
    FF.setVars = function() {
        // jquery easing plugin init
        jQuery.easing.def = "string";
    }
    

    /* BASICS
    ================================================== */
    FF.basics = function(){


    };


    /* SCROLL (requires .scroll class on anchor)
    ================================================== */
    FF.scroll = function(){

        var duration        = 500,
            easing          = 'swing',
            scroll_offset   = 15;

        // <a> method
        $('a[href^="#"].scroll').click(function(e){
            var $self = $(this);
            var destination = $($self.attr('href'));
            e.preventDefault();
            // if destination is valid, scroll to
            if(destination && destination.offset()){
                if(/(iPhone|iPod)\sOS\s6/.test(navigator.userAgent)){
                    $('html, body').animate({
                        scrollTop: $(destination).offset().top
                    }, duration, easing);
                } else {
                    $('html, body').animate({
                        scrollTop: $(destination).offset().top - (scroll_offset)
                    }, duration, easing);
                }
            }
        });
    };
    


    /* WP PLACEHOLDERS
    ================================================== */
    FF.fauxPlaceholders = function() {

        var comments_input      = $('#respond input[type="text"]'),
            comments_textarea   = $('#respond textarea');

        function labelAsPlaceholder(obj) {
            //check if exists
            if ( !obj.length ) { return; }

            //input as obj
            obj.each(function(){
                var $this = $(this);
                var input_label_text    = $this.siblings('label');
                $this.attr('placeholder', input_label_text.text()); // placeholder method
                input_label_text.hide();
            });
        }

        function labelAsValue(obj) {
            //check if exists
            if ( !obj.length ) { return; }

            //input as obj
            obj.each(function(){
                var $this = $(this);
                var input_label_text    = $this.siblings('label');
                $this.attr('value', input_label_text.text()); // value method
                input_label_text.hide();
            });
        }

        labelAsPlaceholder(comments_input);
        labelAsPlaceholder(comments_textarea);
    };


    /* MODAL EFFECTS
    ================================================== */
    FF.modalEffects = function() {

        var overlay = $('.md-overlay');

        if (!overlay) { return; }

        [].slice.call( $('.md-trigger') ).forEach( function(el, i) {

            var modal_id = $(el).attr('href'),
              modal = $( modal_id ),
              close = modal.find('.md-close');

            // remove modal
            function removeModal(hasPerspective) {
              modal.removeClass('md-show');

              if ( hasPerspective ) {
                  document.documentElement.removeClass('md-perspective');
              }
            }

            // remove handler
            function removeModalHandler() {
              removeModal( $(el).hasClass('md-setperspective') );
              overlay.removeClass('md-show');

              return false;
            }

            // scroll to top of modal on click
            function scrollModalOffset(id) {

                var md_id       = $(el).attr('href'),
                    md          = $( md_id ),
                    md_offset   = md.offset().top;

                    // console.log(md_id);

                    if(md && md.offset() && (md_id === '#MODAL_ID_1' || md_id === '#MODAL_ID_2') ){
                        if(/(iPhone|iPod)\sOS\s6/.test(navigator.userAgent)){
                            $('html, body').animate({
                                scrollTop: md.offset().top - 30
                            }, 250, 'swing');
                        } else {
                            $('html, body').animate({
                                scrollTop: md.offset().top - 30
                            }, 250, 'swing');
                        }
                    }
            }

            // open modal
            el.addEventListener( 'click', function( ev ) {

                ev.preventDefault();

                modal.addClass('md-show');
                overlay.addClass('md-show');
                overlay.unbind( 'click', removeModalHandler );
                overlay.bind( 'click', removeModalHandler );

                if( $(el).hasClass('md-setperspective') ) {
                    setTimeout( function() {
                        document.documentElement.addClass('md-perspective');
                    }, 25 );
                }

                scrollModalOffset();

            });

            // close modal
            close.click(function(ev){
                ev.stopPropagation();
                removeModalHandler();
            })
        });    
    };


    /* FLEXLOADER
    ================================================== */
    FF.flexLoader = function(obj, options){

        if ( !obj ) { return; }

        obj.flexslider(options);

    };


    /* SKROLLER
    ================================================== */
    FF.skrollr = function(opts) {
        var s = skrollr.init({
          edgeStrategy: 'set',
          easing: {
            WTF: Math.random,
            inverted: function(p) {
              return 1-p;
            }
          }
        });
    };


    /* REGEX
    ================================================== */
    FF.regex = function() {

        function urlToLink(obj) {
            var re = /(?:(?=[\s`!()\[\]{};:'".,<>?«»“”‘’])|\b)((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/|[a-z0-9.\-]+[.](?:com|org|net))(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))*(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]|\b))/gi;
            obj.html(obj.html().replace(re, '<a href="$1" target="_blank" title="">$1</a>'));
        }
        // urlToLink($('#content article'));
        
    }


    /* COLLAPSABLE SIDEBAR
    ================================================== */
    FF.collapsableSidebar = function() {

        var sidebar_default = $('#sidebar_default');

        $('#sidebar-toggle').toggle(function(){
            $('#sidebar-default').stop().animate({
                'width'     : '5%'
            }, function () {
                $('#content').animate({
                    'width'     : '92%'
                });
            });
            $('.sidebar-inner').stop().animate({
                'left'      : '-700px',
                'opacity'   : '0'
            }, 500);
            
        }, function() {
            $('#sidebar-default').animate({
                'width'     : '25%'
            }, function() {
                
            });
            $('.sidebar-inner').stop().animate({
                'left'      : '0px',
                'opacity'   : '1'
            });
            $('#content').animate({
                'width'     : '75%'
            }, 350);
        
        });
    }


    /* LAZYLOAD VIDEO
    ================================================== */
    FF.lazyLoadVideo = function() {

        $('.lazyload').click(function(){
            var $this           = $(this),
                video_id        = $this.data('video-id'),
                video_service   = $this.data('video-service'),
                width           = $this.width(),
                height          = $this.height();

                console.log(width, height);

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
            $this.find('img').remove();
            $this.find('.post-format-video-overlay').remove();

            // append the generated embed code
            $this.append(embed_code);
        });
    }


    /* LAZYLOAD IMAGE - Run at window onload & scroll
    ================================================== */
    FF.lazyLoadImage = function(method) {

        if ( method === 'delayed' ) {
            setTimeout(function(){
                $('.lazyload-img:in-viewport').addClass('show');
            }, 100);
        } else {
            $('.lazyload-img:in-viewport').addClass('show');
        }
    }



    /* BACKSTRETCH
    ================================================== */
    FF.backStretch = function() {

        $('.backstretch').each(function(i){
            var img_src = $(this).data('img-src');

            $(this).backstretch(img_src);
        });
    }


    /* HAMBURGER NAV
    ================================================== */
    FF.hamburgerNav = function() {

        FF.el.mobile_menu_btn.toggle(function(e){
            $(this).addClass('open');
            var nav = $(this).siblings('nav');
            nav.slideToggle(150);

        }, function(e){
            $(this).removeClass('open');
            var nav = $(this).siblings('nav');
            nav.slideToggle(150);
        });

    }


    /* DEBUG_BOX
    ================================================== */
    FF.debugBox = function(start) {

        var debug_box_toggle = FF.el.debug_box.find('button#debug_box-close'),
            debug_box_inner  = FF.el.debug_box.find('.debug_box-inner'),
            debug_button     = FF.el.debug_box.find('nav a');

        // toggle debug panel
        debug_box_toggle.toggle(function() {
            localStorage.setItem('FFW_debug_box_closed', true);
            FF.el.debug_box.removeClass('closed');
        }, function() {
            localStorage.setItem('FFW_debug_box_closed', false);
            FF.el.debug_box.addClass('closed');
        });

        // toggle individual vardumps/pretty prints
        debug_button.toggle(function(){
            var target = $(this).attr('name');

            $('#'+target).removeClass('hide');
            $(this).addClass('active');
        }, function(){
            var target = $(this).attr('name');

            $('#'+target).addClass('hide');
            $(this).removeClass('active');
        });
    }


    /* ================================================================ */
    /*                                                                  */
    /*                     DOCUMENT / WINDOW CALLS                      */
    /*                                                                  */
    /* ================================================================ */



    /* DOCUMENT READY
    ================================================== */
    $(document).ready(function(){
        
        // do stuff on document ready
        FF.init();


    });

    /* WINDOW LOAD
    ================================================== */
    $(window).load(function(){
        
        // do stuff once the page has finished loading
        FF.lazyLoadImage();

    });

    /* WINDOW SCROLL
    ================================================== */
    $(window).scroll(function(){

        // DEBUG - winY position
        if (DEBUG) { var winY = $(window).scrollTop(); console.log(winY);}

        FF.lazyLoadImage();

    });


    /* WINDOW RESIZE
    ================================================== */
    $(window).resize(function(){   
        
        // do stuff on window resize


    }).trigger('resize');   


    /* SELF INVOKING ANONYMOUS FUNCTION(s)
    ================================================== */
    (function(){ 

        FF.setVars(); // set variables
        //FF.skrollr(); // skroller init

        if(window.location.hash) {
            // puts hash in variable, and removes the # character
            var hash = window.location.hash.substring(1); 
            
            if (hash === 'CUSTOM_HASH_HERE') {
                // do something when custom hash is in url
            }
        } else {
            // no hash found, don't do anything
        }        

    })();

})(jQuery);

// Viewport selectors - URL: http://www.appelsiini.net/projects/viewport
(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);