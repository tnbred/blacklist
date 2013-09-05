$(function() {

    // Load the Visualization API and the piechart package.
    setTimeout(function(){google.load('visualization', '1.0', {'callback':'', 'packages':['corechart']})}, 1);

    var data = $('#graph_data').data('graph');
    if(data == ""){
        display_current_week();
    }

    $('.all_time_user_stats').click(function() {
        display_all_time();
    });

    $('.current_week_user_stats').click(function() {
        display_current_week();
    });


    function display_current_week(){
        var url = "/lists/user_stat_api?list_id="+$('#graph_data').data('list')
        $.ajax({
            url: url,
            type: "GET",
            dataType: 'json',
            success: function (data, textStatus) {
                $('#graph_data').data('graph',data);
                setTimeout(function drawChart() {

                    // Create the data table.
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Name');
                    data.addColumn('number', 'Points');
                    data.addRows($('#graph_data').data('graph'));

                    // Set chart options
                    var options = {'title':'My votes this week',
                        'width':$('.breadcrumb').parent().width(),
                        'height':450};

                    // Instantiate and draw our chart, passing in some options.
                    var chart = new google.visualization.BarChart(document.getElementById('user_stat_div'));
                    chart.draw(data, options);
                },500);
                $('.current_week_stat_div').removeClass('hidden');
                $('.global_user_stat_div').addClass('hidden');
            },
            error: function(data,textStatus) {
            }
        });
    }

    function display_all_time(){
        var url = "/lists/user_stat_api?list_id="+$('#graph_data').data('list') + "&all_time=true"
        $.ajax({
            url: url,
            type: "GET",
            dataType: 'json',
            success: function (data, textStatus) {
                $('#graph_data').data('graph',data);
                setTimeout(function drawChart() {

                    // Create the data table.
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Name');
                    data.addColumn('number', 'Points');
                    data.addRows($('#graph_data').data('graph'));

                    // Set chart options
                    var options = {'title':'My votes this week',
                        'width':$('.breadcrumb').parent().width(),
                        'height':450};

                    // Instantiate and draw our chart, passing in some options.
                    var chart = new google.visualization.BarChart(document.getElementById('user_stat_div'));
                    chart.draw(data, options);
                },500);
                $('.current_week_stat_div').addClass('hidden');
                $('.global_user_stat_div').removeClass('hidden');
            },
            error: function(data,textStatus) {
            }
        });
    }






});
