var bgColour = '#b80000';
var linkColour = '#ff0505';

$.fn.extend({
    qcss: function(css) { // from https://stackoverflow.com/a/35057342
        return $(this).queue(function(next) {
            $(this).css(css);
            next();
        });
    },
    qtext: function(text) {
        return $(this).queue(function(next) {
            $(this).text(text);
            next();
        });
    },
    qremove: function() {
        return $(this).queue(function(next) {
            $(this).remove();
            next();
        });
    }
});

$(document).ready(function(){
    var state = "";

    resize_content();
    create_preset_options();

    $("#logs").click(function(){
        if($("div.history-list").css("display") == "none") {
            state = "open";
            if($("div.config-container").css("display") != "none") {
                toggle_options("close", "#options"); 
            }
            setTimeout(toggle_log("open", this), 2000);
        } else {
            state = "close";
            toggle_log("close", this);
        }
        toggle_ref(state);
    });

    $("#options").click(function(){
        var state = "";
        if($("div.config-container").css("display") == "none") {
            state = "open";
            if($("div.history-list").css("display") != "none") {
                toggle_log("close", "#logs"); 
            }
            setTimeout(toggle_options("open", this), 2000);
        } else {
            state = "close";
            toggle_options("close", this);
        }
        toggle_ref(state);
    });

    $("form[name='regex_form']").on('submit', initialize_generator);

    $('#docs').click(function() {
        window.location = 'strgen_doc.html';
    });

    $(document).on("click", ".log_label", function() {
        var element = "#" + $(this).parent().attr('id');

        if ($(element).find('p.log_content').css('display') == "none") {
            open_log($(this), element);
        } else {
            close_log($(this), element);
        }
    });

    $(document).on("click", ".pattern-ex", function() {
        document.getElementById("templatebox").value = $(this).text();
        initialize_generator();
    });

    $(document).on("click", ".predefined-ex", function() {
        var range = $(this).text();
        var pattern = document.getElementById("templatebox").value;

        if (pattern == "") {
            pattern = "[]"
        } else if (pattern != "" && pattern.indexOf(']') < 0) {
            pattern += "[]"
        }

        console.log(range);
        pattern = pattern.replace("]", range + "]");

        document.getElementById("templatebox").value = pattern;
    });

    $("#allowduplicates").change(function(){
        if ($(this).is(":checked") == false) {
            $("#multipleduplicates").prop("disabled", false);
        }
        else if ($(this).is(":checked") == true) {
            $("#multipleduplicates").prop("disabled", true);
            $("#multipleduplicates").prop("checked", true);
            $("#caseduplicates").prop("disabled", true);
            $("#caseduplicates").prop("checked", false);

        }
    });

    $("#multipleduplicates").change(function(){
        if ($(this).is(":checked") == false) {
            $("#caseduplicates").prop("disabled", false);
        }
        else if ($(this).is(":checked") == true) {
            $("#caseduplicates").prop("disabled", true);
            $("#caseduplicates").prop("checked", false);
        }
    });

            
    $(document).on("click", ".notification", function() {
        $(this).stop(true);
        $(this).fadeOut("slow").qremove();
    });

    $(window).resize(function() {
        resize_content();
    });

    function toggle_ref(state) {
        if($("div.ref-container").css("display") == "none" && state == "close") {
            $("div.ref-header").delay(100).qcss({display:'flex'}).qcss({marginTop:'0px'}).qcss({width:'60vw'}).qcss({height:'4vh'}).qtext("Reference"); //height:'63.56px'
            $("div.ref-header").css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'}); //fontSize:'16px'
            $("div.ref-container").delay(110).slideToggle(100);
        } else if(state == "open") {
            $("div.ref-container").slideUp(100);
            $("div.ref-header").delay(100).qtext("").qcss({display:'none'});       
        }
    }

    function toggle_options(state, element) {
        if (state == "open") {
            $(element).css({backgroundColor:bgColour}).css({color:'white'});
            $(element).find("img").attr("src","img/options-active.svg");
            $("div.config-header").delay(100).qcss({display:'flex'}).qcss({marginTop:'0px'}).qcss({width:'60vw'}).qcss({height:'4vh'}).qtext("Options"); //height:'63.56px'
            $("div.config-header").css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'}); //fontSize:'16px'
            $("div.config-container").delay(110).slideToggle(100);

        } else if (state == "close") {
            $("div.config-container").slideUp(100);
            $("div.config-header").delay(100).qtext("").qcss({display:'none'});
            $(element).css({backgroundColor:'white'}).css({color:'initial'});
            $(element).find("img").attr("src","img/options.svg");
        }
    }

    function toggle_log(state, element) {
        if (state == "open") {
            $(element).css({backgroundColor:bgColour}).css({color:'white'}).attr("src","img/log-active.svg");
            $(element).find("img").attr("src","img/log-active.svg");
            $("div.history-header").delay(100).qcss({display:'flex'}).qcss({marginTop:'0px'}).qcss({width:'60vw'}).qcss({height:'4vh'}).qtext("Logs"); //height:'63.56px'
            $("div.history-header").css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'}); //fontSize:'16px'
            $("div.history-list").delay(110).slideToggle(100);        
        } else if (state == "close") {
            $("div.history-list").slideUp(100);
            $("div.history-header").delay(100).qtext("").qcss({display:'none'});
            $(element).css({backgroundColor:'white'}).css({color:'initial'});
            $(element).find("img").attr("src","img/log.svg");
        }
    }

    function open_log(parent, element) {
        close_log(parent, '.history_record'); // close all logs that are currently open

        $(element).find('p.log_content').css('display','block').css('border-color', bgColour);    
        $(element).css('background-color', bgColour);
        $(parent).css('color', 'white').css('padding-left','4px');  
        $(element).find('div.log_export a').css('color', 'white').css('padding-right', '4px');
    }

    function close_log(parent, element) {
        $(element).find('p.log_content').css('display','none');
        $(element).css('background-color', '');
        $(parent).css('color', 'black').css('padding-left', '0px');
        $(element).find('div.log_export a').css('color', linkColour).css('padding-right', '0px');

        if ($(element).find('p.log_content').css('display') == 'none') {
            $(element).find('.log_label').css('color', 'black').css('padding-left', '0px');
        }       
    }

    function resize_content() {
        var window_height = $(window.top).height();
        var window_width = $(window.top).width();

        if(window_width < 1026) {
            var new_height = Math.floor((window_height - 353) - (window_height / 50)) + "px";            
        } else {
            var new_height = Math.floor((window_height - 353) - (window_height / 7)) + "px";
        }

        $("div.content-container").css({maxHeight:new_height});

        //console.log('window has resized - window_height: ' + window_height + ', new_height: ' + new_height + ', window_width: ' + window_width);
    }
});