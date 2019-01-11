function setTopBtn(){
     $('body').append('<a id="topbtn" href="#">回到頂端</a>');
     $('#topbtn').click(function(){
            $('body,html').animate({'scrollTop':0},1000);
            })
     $(window).scroll(function(){
             var btnY=$(window).height()-$('#topbtn').height()*1.3+$(window).scrollTop();
     $('#topbtn').stop().animate({'top':btnY},400)
        })
        
     $(window).resize(function(){
            var btnY=$(window).height()-$('#topbtn').height()*1.3;
            $('#topbtn').css({'position':'absolute','top':btnY,'right':10})

        })
     $(window).resize();

}