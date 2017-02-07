
$(document).ready(function(){
    request_panel_info();
    setInterval(request_panel_info, 1000);
});


function request_panel_info(){
    
    $.ajax( {
        url:"dashboard_request.php",
        method: "POST",
        dataType:"json",
        data: {"dash_request":'1'}
    } )
    .done(function(msg){
        $("#num_store").text(msg['num_store']);
        $("#num_call_material").text(msg['num_call_material']);
        $("#num_activity_store").text(msg['num_activity_store']);
        $("#num_user").text(msg['num_user']);

    })
    .fail(function(){
        console.log("dash panel request fail");
    })
    .always(function(msg){
        //console.log('dash panel request success');

    });
    
   return; 
}
