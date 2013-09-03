$(function() {
    $('.add_point_button').click(function() {
    $(this).parent().find('.add_point_div').removeClass('hidden')
    $(this).addClass('hidden')
 });

$('.valid_vote').click(function() {
    $.ajax({
        url: "/list/vote",
        data: {
            list_id: 1,
            user_id: 1,
            points: 1
            },
        type: "POST",
        dataType: 'json',
        success: function (data, textStatus) {
            $("#sections tbody:last-child").last().before(data);
            $('.generate_batch_lines').parent().parent().find('.batch_add_nested_section').click();
        }
    });

});


});