function cajs(){
    $('#ca ul li').css({'position':'relative',
                            'overflow':'hidden'});
        $('#ca ul li p').css({'position':'absolute',
                              'left':0,
                              'background-color':'rgba(0, 0, 0, 0.46)',
                              'color':'white',
                              'padding':10,
                              'margin':0,})
                        .each(function(){
                            $(this).css({'bottom':-$(this).outerHeight(true)})
                        });
        $('#ca ul li').hover(function(){
            $(this).children('p').stop().animate({'bottom':0},500,'easeOutQuint')
        },function(){
            var thisp=$(this).children('p');
            thisp.stop().animate({'bottom':-thisp.outerHeight(true)},500,'easeOutBounce')
        });
        $(window).resize(function(){
            $('#ca ul li p').each(function(){
                            $(this).css({'bottom':-$(this).outerHeight(true)})
                        })
        })
}