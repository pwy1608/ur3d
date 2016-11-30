// Auto type effect at index Page

function autoType(elementClass, typingSpeed) {

    var thhis = $(elementClass);
    thhis.css({
        "position": "relative",
        "display": "inline-block"
    });

    thhis = thhis.find(".text-js");

    var text = thhis.text().trim().split('');
    var amntOfChars = text.length;
    var newString = "";
    var j = 0;
    thhis.text("|");

    do {
        setTimeout(function() {
            thhis.css("opacity", 1);
            thhis.prev().removeAttr("style");
            thhis.text("");
            for (var i = 0; i < amntOfChars; i++) {
                (function(i, char) {
                    setTimeout(function() {
                        newString += char;
                        thhis.text(newString);
                    }, i * typingSpeed);
                })(i + 1, text[i]);
            }
            setTimeout(function() { //Auto Scrolling when autoType finished
                location.href.onclick = $("#angleDown").click();
            }, amntOfChars * typingSpeed + 3000);
        }, 1500);
        j++;
    } while (j == 0)
}

(function($) {

    skel.breakpoints({
        wide: '(max-width: 1920px)',
        normal: '(max-width: 1680px)',
        narrow: '(max-width: 1280px)',
        narrower: '(max-width: 1000px)',
        mobile: '(max-width: 736px)',
        mobilenarrow: '(max-width: 480px)',
    });

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $header = $('#header'),
            $all = $body.add($header);

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 0);
        });


        //get plyControl.html file according to file name
        function getPlyControlHTML(fileName){
          switch(fileName){
            case 'dolphins.ply' : return 'plyControl.html';
            case 'Lucy100k.ply' : return 'plyControl2.html';
            case 'vase2.ply'    : return 'plyControl3.html';
            case 'dragon.ply'   : return 'plyControl4.html';
            default : return 'plyControl2.html'
          }
        }

        //append 3D file list
        $window.on('load', function() {
          var fileNames = document.getElementById('fileList').innerHTML.split(',');
          fileNames.splice(fileNames.length-1,1);
          fileNames.splice(0,1);
          var container = document.getElementById('3dContainer');
          if(fileNames != ""){
            for(var i = 0; i < fileNames.length; i+=2){
              // create elements of odd-numbered 3d file link
              var outerDiv = document.createElement('div');
              outerDiv.setAttribute('class','row 0% images');
              var innerDiv1 = document.createElement('div');
              innerDiv1.setAttribute('class','6u 12u(mobile)');
              var link3d1 = document.createElement('a');
              link3d1.setAttribute('class','image fit from-left');
              link3d1.setAttribute('href',getPlyControlHTML(fileNames[i]));
              link3d1.setAttribute('data-poptrox','iframe,1280x800');
              var thumbnail1 = document.createElement('img');
              thumbnail1.setAttribute('src','./images/logos/facebook.png');
              thumbnail1.setAttribute('title','Sculpture: ' + fileNames[i].split(".")[0]);
              thumbnail1.setAttribute('alt','""');

              //append odd-numbered elements
              link3d1.appendChild(thumbnail1);
              innerDiv1.appendChild(link3d1);
              outerDiv.appendChild(innerDiv1);

              // if even-numbered 3d file exist, create elements of its link
              if(fileNames[i+1]){
                var innerDiv2 = document.createElement('div');
                innerDiv2.setAttribute('class','6u 12u(mobile)');
                var link3d2 = document.createElement('a');
                link3d2.setAttribute('class','image fit from-right');
                link3d2.setAttribute('href',getPlyControlHTML(fileNames[i+1]));
                link3d2.setAttribute('data-poptrox','iframe,1280x800');
                var thumbnail2 = document.createElement('img');
                thumbnail2.setAttribute('src','./images/logos/mail.png');
                thumbnail2.setAttribute('title','Sculpture: ' + fileNames[i+1].split(".")[0]);
                thumbnail2.setAttribute('alt','""');

                //append even-numbered elements
                link3d2.appendChild(thumbnail2);
                innerDiv2.appendChild(link3d2);
                outerDiv.appendChild(innerDiv2);
              }
              container.appendChild(outerDiv);
            }
          }
        });

        // 터치 mode.
        skel.on('change', function() {

            if (skel.vars.mobile || skel.breakpoint('mobile').active)
                $body.addClass('is-touch');
            else
                $body.removeClass('is-touch');

        });

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on mobile.
        skel.on('+mobile -mobile', function() {
            $.prioritize(
                '.important\\28 mobile\\29',
                skel.breakpoint('mobile').active
            );
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9)
            $(':last-child').addClass('last-child');

        // gallery.
        $window.on('load', function() {

            $('.gallery').poptrox({
                baseZIndex: 10001,
                useBodyOverflow: false,
                usePopupEasyClose: false,
                overlayColor: '#1f2328',
                overlayOpacity: 0.65,
                usePopupDefaultStyling: false,
                usePopupCaption: true,
                popupLoaderText: '',
                windowMargin: (skel.breakpoint('mobile').active ? 5 : 50),
                usePopupNav: true
            });
        });

        // Section transitions.
        if (!skel.vars.mobile &&
            skel.canUse('transition')) {

            var on = function() {

                // Generic sections.
                $('.main.style1')
                    .scrollex({
                        mode: 'middle',
                        delay: 10,
                        initialize: function() {
                            $(this).addClass('inactive');
                        },
                        terminate: function() {
                            $(this).removeClass('inactive');
                        },
                        enter: function() {
                            $(this).removeClass('inactive');
                        },
                        leave: function() {
                            $(this).addClass('inactive');
                        }
                    });

                $('.main.style2')
                    .scrollex({
                        mode: 'middle',
                        delay: 10,
                        initialize: function() {
                            $(this).addClass('inactive');
                        },
                        terminate: function() {
                            $(this).removeClass('inactive');
                        },
                        enter: function() {
                            $(this).removeClass('inactive');
                        },
                        leave: function() {
                            $(this).addClass('inactive');
                        }
                    });

                // Work.
                $('#work')
                    .scrollex({
                        top: '40vh',
                        bottom: '30vh',
                        delay: 10,
                        initialize: function() {

                            var t = $(this);

                            t.find('.row.images')
                                .addClass('inactive');

                        },
                        terminate: function() {

                            var t = $(this);

                            t.find('.row.images')
                                .removeClass('inactive');

                        },
                        enter: function() {

                            var t = $(this),
                                rows = t.find('.row.images'),
                                length = rows.length,
                                n = 0;

                            rows.each(function() {
                                var row = $(this);
                                window.setTimeout(function() {
                                    row.removeClass('inactive');
                                }, 100 * (length - n++));
                            });

                        },
                        leave: function(t) {

                            var t = $(this),
                                rows = t.find('.row.images'),
                                length = rows.length,
                                n = 0;

                            rows.each(function() {
                                var row = $(this);
                                window.setTimeout(function() {
                                    row.addClass('inactive');
                                }, 100 * (length - n++));
                            });

                        }
                    });

                // Contact.
                $('#contact')
                    .scrollex({
                        top: '50%',
                        delay: 10,
                        initialize: function() {
                            $(this).addClass('inactive');
                        },
                        terminate: function() {
                            $(this).removeClass('inactive');
                        },
                        enter: function() {
                            $(this).removeClass('inactive');
                        },
                        leave: function() {
                            $(this).addClass('inactive');
                        }
                    });

            };

            var off = function() {

                // Generic sections.
                $('.main.style1')
                    .unscrollex();

                $('.main.style2')
                    .unscrollex();

                // Work.
                $('#work')
                    .unscrollex();

                // Contact.
                $('#contact')
                    .unscrollex();

            };

            skel.on('change', function() {

                if (skel.breakpoint('mobile').active)
                    (off)();
                else
                    (on)();

            });

        }

        // Events.
        var resizeTimeout, resizeScrollTimeout;

        $window
            .resize(function() {

                // animations/transitions 비활성화.
                $body.addClass('is-resizing');

                window.clearTimeout(resizeTimeout);

                resizeTimeout = window.setTimeout(function() {

                    // Scroll Speed & Update 라인. (변경 전, 800 이었음.)
                    $('a[href^=#]').scrolly({
                        speed: 600,
                        offset: $header.outerHeight() - 1
                    });

                    // Re-enable animations/transitions.
                    window.setTimeout(function() {
                        $body.removeClass('is-resizing');
                        $window.trigger('scroll');

                    }, 0);

                }, 100);

            })
            .load(function() {
                $window.trigger('resize');
            });

        $(function() {
            $(window).scroll(function() {
                if ($(this).scrollTop() > 540)
                    $('#float-icons').fadeIn();
                else
                    $('#float-icons').fadeOut();
            });

            $('#float-icons').click(function() {
                $('body,html').animate({
                    scrollTop: 0
                }, 600);
            });
        });

        $(function() {
            $(window).on("scroll", function() {

                var scrollHeight = $("#about").height();

                if ($(this).scrollTop() <= scrollHeight) {
                    $('header:first').removeClass('changeColor');
                } else {
                    $('header:first').addClass('changeColor');
                }
            });
        });

    });

    autoType(".type-js", 200);

})(jQuery);
