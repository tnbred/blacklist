$(function() {

    // Load the Visualization API and the piechart package.
    setTimeout(function(){google.load('visualization', '1.0', {'callback':'', 'packages':['corechart']})}, 1);

    var data = $('#graph_data').data('graph');
    if(data == ""){
        display_current_week();
    }

    $('.all_time_list_stats').click(function() {
        display_all_time();
    });

    $('.current_week_list_stats').click(function() {
        display_current_week();
    });


    function display_current_week(){
        var url = "/lists/global_stat_api?list_id="+$('#graph_data').data('list')
        $.ajax({
            url: url,
            type: "GET",
            dataType: 'json',
            success: function (data, textStatus) {
                $('#graph_data').data('graph',data);
                setTimeout(function drawChart() {
                    var data = google.visualization.arrayToDataTable($('#graph_data').data('graph'));

                    var options = {
                        title: 'Votes on the list this week',
                        hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
                        vAxis: {minValue: 0}
                    };

                    var chart = new google.visualization.AreaChart(document.getElementById('list_stat_div'));
                    chart.draw(data, options);
                },500);
                $('.current_week_stat_div').removeClass('hidden');
                $('.global_list_stat_div').addClass('hidden');
            },
            error: function(data,textStatus) {
            }
        });
    }

    function display_all_time(){
        var url = "/lists/global_stat_api?list_id="+$('#graph_data').data('list') + "&all_time=true"
        $.ajax({
            url: url,
            type: "GET",
            dataType: 'json',
            success: function (data, textStatus) {
                $('#graph_data').data('graph',data);
                setTimeout(function drawChart() {
                    var data = google.visualization.arrayToDataTable($('#graph_data').data('graph'));

                    var options = {
                        title: 'Votes on the list this week',
                        hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
                        vAxis: {minValue: 0}
                    };

                    var chart = new google.visualization.AreaChart(document.getElementById('list_stat_div'));
                    chart.draw(data, options);
                },500);
                $('.current_week_stat_div').addClass('hidden');
                $('.global_list_stat_div').removeClass('hidden');
            },
            error: function(data,textStatus) {
            }
        });
    }






});
