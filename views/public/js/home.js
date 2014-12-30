$(function() {



    var listHandlingEvents = function( ) {
        $('.add_point_button button').click(function( event ) {
            var pointsLeft = $(this).attr('pointsLeft');
            if( pointsLeft > 0 ){
                $(this).parent().parent().find('.add_point_div').removeClass('hidden')
                $(this).parent().addClass('hidden')
            }
            else{
                var tr_id  = $(this).parent().parent().parent().attr('id');
                $('#'+tr_id).find('.message').html("You have 0 point left!");
                $('#'+tr_id).find('.message').addClass('alert-danger');
                $('#'+tr_id).find('.message').removeClass('hidden')
            };
        });


        $('.valid_vote').click(function() {
            var tr_id         = $(this).parent().parent().parent().attr('id');
            var points        = $('#'+tr_id).find('select').find(":selected").text();
            var list_id       = $('#list_table').attr('list_id');
            var user_to_id    = $('#'+tr_id).attr('user_to_id');
            var votesThisWeek = $(this).attr('votesThisWeek');
            var vote          = {"list_id":list_id,"user_to_id":user_to_id, "points":points , "votesThisWeek": votesThisWeek};
            
            $.ajax({
                url: "/votes",
                data: {
                    "vote":vote,
                    "tr_id": tr_id,
                },
                type: "POST",
                dataType: 'json',
                success: function (data, textStatus) {
                    var error = data['error'];
                    if( error ){ handleVoteResponse(data,'alert-danger') }
                        else{ handleVoteResponse(data,'alert-success') };
                    var tr_id         = data['tr_id'];
                    var points_left   = data['points_left'];
                    var new_vote      = parseInt(data['points']);
                    var points        = parseInt($('#'+tr_id).find('.item_points').text());
                    var votes_this_week = parseInt( data['votesThisWeek'] + new_vote )
                    if( votes_this_week > 0 ){
                        new_points = points + new_vote
                        html_item_points = new_points+' points <small>(<span class="glyphicon glyphicon-arrow-up"></span>+'+votes_this_week+' this week)</small>'
                    }
                    else{
                        html_item_points = new_points+' points <small>(<span class="glyphicon glyphicon-arrow-right"></span>No change this week)</small>'
                    }
                    $('#'+tr_id).find('.item_points').html( html_item_points);
                    $('#'+tr_id).find('.valid_vote').attr('votesThisWeek',votes_this_week)
                    var new_option_html = ""
                    for (var i=1;i<=points_left;i++)
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
    $('#'+tr_id).find('.message').removeClass('hidden')
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



$('.like-comment').click(function() {
    var comment_id = $(this).attr('comment_id');
    var button_id = $(this).attr('button_id');
    var likes = $(this).attr('likes');

    $.ajax({
        url: "/comments/like",
        data: {
            "comment_id":comment_id,
            "button_id":button_id,
            "likes":likes
        },
        type: "POST",
        dataType: 'json',
        success: function (data, textStatus) {
            var button_id = data['button_id'];
            var likes = data['likes'];

            $('#button_id_'+button_id).find('.likes').text(likes);
            $('#button_id_'+button_id).addClass('disabled');
        }
    });
});


$('.displayReplies').click(function() {
    var button_rep_id    = $(this).attr('button_rep_id');
    var textDisplayReply = $(this).attr('textDisplayReply');
    var replieslength    = $(this).attr('replieslength');
    if( textDisplayReply == 'hide replies' ){
        if( replieslength > 1 ){ textDisplayReply  = 'Click to see the '+replieslength+' replies'; };
        if( replieslength == 1 ){ textDisplayReply  = 'Click to see the reply'; };
    }
    else{ textDisplayReply = 'hide replies'; }
    $.ajax({
        url: "/comments/reply",
        data: {
            "button_rep_id":button_rep_id,
            "textDisplayReply": textDisplayReply
        },
        type: "POST",
        dataType: 'json',
        success: function (data, textStatus) {
            var button_rep_id  = data['button_rep_id'];
            var textDisplayReply     = data['textDisplayReply'];
            $('#button_rep_id_'+button_rep_id).find('.textDisplayReply').text(textDisplayReply);
            $('#button_rep_id_'+button_rep_id).attr('textDisplayReply',textDisplayReply);
        }
    });
});

var itemsCount = 5,
itemsMax   = $('.nbComment').attr('id');

for (var i = 5; i < itemsMax; i++) {
    $('.comment'+i).hide();
}

function showNextItems() {
    var pagination = 5;
    
    if( $('.showMore').text()=='hide' ){
        for (var i = 5; i < itemsMax; i++) {
            $('.comment'+i).hide();
            $('.showMore').text('Show More');
            itemsCount = 5;
        }
    }
    else{
        for (var i = itemsCount; i < (itemsCount + pagination); i++) {
            $('.comment'+i).show();
        }        
        itemsCount += pagination;

        if (itemsCount > itemsMax) {
            $('.showMore').text('hide');
        }
    }
};

$('.showMore').on('click', function (e) {
    e.preventDefault();
    showNextItems();
});



$('.delete_comment').click(function() {
    var comment_id = $(this).attr('comment_id');
    $.ajax({
        url: "/comments/delete",
        data: {
            "comment_id": comment_id
        },
        type: "POST",
        dataType: 'json',
        success: function (data) {
            comment_id = data["comment_id"];
            $('#delete_comment_link_'+comment_id).parent().parent().hide()
        }
    });
});

$('.delete_reply').click(function() {
    var reply_id = $(this).attr('reply_id');
    $.ajax({
        url: "/comments/deleteReply",
        data: {
            "reply_id": reply_id
        },
        type: "POST",
        dataType: 'json',
    });
});

$('.tutorial').click(function() {
    var id_to_hide = $(this).parent().parent().parent().parent().attr('id');
    var id_to_show = parseInt( id_to_hide ) + 1;
    if (id_to_hide < 5) {
            $('#'+id_to_hide).addClass('hidden');
            $('#'+id_to_show).removeClass('hidden');
    }

});

});


