
$(document).ready(function(){
    setInterval(request_panel_info, 1000);
});


function request_panel_info(){
    
    $.ajax( {
        url:"dashboard_request.php",
        method: "POST",
        dataType:"text",
        data: {"dash_request":'1'}
    } )
    .done(function(msg){

    })
    .fail(function(){
        alert("dash panel request fail");
    })
    .always(function(){

    });





    
   return; 
}
