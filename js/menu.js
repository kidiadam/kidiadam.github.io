function menuEff(n,q){
    var menuUl=$('#spmenu ul');
        menuUl.find('ul').hide();
        menuUl.find('h3').click(function(){
            $(this).next().slideDown();
            $(this).parent().siblings().children('ul').slideUp();
        })
            menuUl.find('h3').eq(n).click();
            menuUl.children('li').eq(n).find('a').eq(q).addClass('thisPage');
}


function soaplist(xmlURL){
            $('#sppic').append('<ul></ul>')
        
        $.ajax({
            url:xmlURL,
            type:'get',
            datatype:'xml',
            error:function(){
                alert('err')
            },
            success:function(dataXML){
                $(dataXML).find('soap').each(function(){
                    var dat='<li><div class="imgwarp"><a data-fancybox="soap" data-caption="<h2>'+$(this).find('name').text()+'</h2>" href="SoapImg/'+$(this).find('photo').text()+'"><img src="SoapImg/small/'+$(this).find('photo').text()+'"></a></div>                    <h3>'+$(this).find('name').text()+'</h3>                                      <p>'+$(this).find('desc').text()+'</p>                                        <p>'+$(this).find('ingre').text()+'</p> </li>'
                    $('#sppic ul').append(dat);
                })
                $('[data-fancybox="soap"]').fancybox({
	               loop:true,
                    transitionEffect: "zoom",
                    });
            }
        })

    
}