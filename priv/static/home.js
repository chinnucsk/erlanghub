$(function () {

    var timestamp = 0;
    var pullUrl = "/pull";

    var opts = {
      lines: 10, // The number of lines to draw
      length: 5, // The length of each line
      width: 2, // The line thickness
      radius: 6, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      color: '#000', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('Spinner');
    var spinner = new Spinner(opts).spin(target);

    // bind events for the messages area

    var EventsDisplay = {
        print: function (messages) {
            $.each(messages, function (index, value) {

                // work with value
                msg = value.replace("\\", "");
                obj = JSON.parse(msg);
                $("#msgList").prepend('<li>' + obj.type + " in "  + obj.repo.name + " by: " + obj.actor.login + '</li>');
                //$.getJSON(obj.repo.url, function (data) {
                //    $("#msgList").prepend('<li>' + obj.type + " : " + data.name + " @ <a href='" + data.html_url + "'>" + obj.repo.name + "</a> Language: " + data.language + '</li>');
                //});

            });
        },
        error: function (error) {
            $("#msgList").prepend('<li><span class="error">' + error + '</span></li>');
        }
    };

    $('#Events').bind({
        'pull': function () {
            $.ajax({
                url: pullUrl + "/?since=" + timestamp,
                dataType: "json",
                method: "GET",
                success: function (data) {
                    if (data.timestamp) {
                        timestamp = data.timestamp;
                        if (data.timeout == "true") {
                            // means that a timeout was trigered on the server
                            $('#Events').triggerHandler("pull")
                        } else {
                            EventsDisplay.print(data.messages);
                            $('#Events').triggerHandler("pull")
                        }
                    }
                    else {
                        EventsDisplay.error("Failed to pull due to this data: " + data);
                        spinner.stop();
                        // $('#Events').triggerHandler("pull");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    EventsDisplay.error("Failed to pull due to this status: " + textStatus + " and error: " + errorThrown);
                    spinner.stop();
                    // $('#Events').triggerHandler("pull");
                }
            });
            setTimeout(function () { /* Do Nothing here */
            }, 1);
        }
    }).triggerHandler("pull"); // kick off the pull event after all the events are bound to the Events object


});

