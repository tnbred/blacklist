$(function() {

    var listHandlingEvents = function() {
        $('.add_point_button button').click(function() {
        $(this).parent().parent().find('.add_point_div').removeClass('hidden')
        $(this).parent().addClass('hidden')
    });

    $('.valid_vote').click(function() {
        var tr_id = $(this).parent().parent().parent().attr('id');
        var points = $('#'+tr_id).find('select').find(":selected").text();
        var list_id = $('#list_table').attr('list_id');
        var user_to_id = $('#'+tr_id).attr('user_to_id');
        var vote = {"list_id":list_id,"user_to_id":user_to_id, "points":points};

        $.ajax({
            url: "/votes",
            data: {
                "vote":vote,
                "tr_id": tr_id
            },
            type: "POST",
            dataType: 'json',
            success: function (data, textStatus) {
                handleVoteResponse(data,'alert-success');
                var tr_id = data['tr_id'];
                var points_left = data['points_left'];
                var new_vote = parseInt(data['points']);
                var points = parseInt($('#'+tr_id).find('.item_points').text());
                var variation = parseInt($('#'+tr_id).find('.item_variation').text());
                $('#'+tr_id).find('.item_points').text(points+new_vote);
                $('#'+tr_id).find('.item_variation').text(variation+new_vote);
                var new_option_html = ""
                for (var i=0;i<=points_left;i++)
                {
                    new_option_html+='<option value='+i+'>'+i+'</option>'
                }
                $('.add_point_div select').html(new_option_html)
            },
            error: function(data,textStatus) {
                handleVoteResponse(data.responseJSON,'alert-danger');
            }
        });
    });

    function handleVoteResponse(data,alert_class)
    {
        var tr_id = data['tr_id'];
        var message = data['message'];
        $('#'+tr_id).find('.add_point_div').addClass('hidden');
        $('#'+tr_id).find('.add_point_button').removeClass('hidden');
        $('#'+tr_id).find('.message').html(message);
        $('#'+tr_id).find('.message').addClass(alert_class);
    }
    }


    function getData(el,layout){
        var blacklistId = $(el).attr('blacklistid');
        var url = (layout===null)? "/user/listData?listId="+blacklistId : "/user/listData?listId="+blacklistId+"&layout="+layout;
        $.ajax({
            url: url,
            type: "GET",
            dataType: 'html',
            success: function (data, textStatus) {
                $(el).html(data);
                listHandlingEvents();
            }
        });
    }

    $('.blacklistToLoad').each(function(idx,el){
            getData(el,null);
    });


    $('.blacklistToLoadLayout').each(function(idx,el){
            getData(el,"list");
    });




});