function navjs(){ 
    
            if(window.innerWidth>480){
            $('#nav1 ul ul').css({'position':'relative',
                                  'left':0,
                                  'top':150,
                                  'opacity':0}).hide();
            $('#nav1>ul>li').hover(function(){
                $(this).children('ul').show().stop()
                    .animate({'top':0,
                              'opacity':1},500);
                
            },function(){
                $(this).children('ul').stop()
                       .animate({'opacity':0},500,
                                 function(){
                                    $(this).css({'top':150}).hide();
                                 });

            })
            }else{
                $('#nav1 ul ul').hide();
                $('#nav1>ul>li').click(function(){
                    $(this).children('ul').slideToggle();
                })
                  
            }
}

function setTabelLabel(tableClass){
        var headTr=$('.'+tableClass+' tr')
        var bodyTr=$('.'+tableClass+' tbody tr')
        var thText=new Array();
        var tdCount=headTr.eq(0).children('th').length;
        headTr.eq(0).children('th').each(function(){
            thText.push($(this).text())
        })
//        alert(thText);
        for(var i=0;i<bodyTr.length;i+=1)
            for(var j=0;j<tdCount;j+=1)
                bodyTr.eq(i).children('td').eq(j).attr('data-label',thText[j])

}
