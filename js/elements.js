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

    resizeContent();
    createPresetOptions();

    $("#logs").click(function(){
        if($("div.history-list").css("display") == "none") {
            state = "open";
            closeContainers();
            setTimeout(toggleLog("open", this), 2000);
        } else {
            state = "close";
            toggleLog("close", this);
        }
        toggleRef(state);
    });

    $("#options").click(function(){
        var state = "";
        if($("div.config-container").css("display") == "none") {
            state = "open";
            closeContainers();
            setTimeout(toggleOptions("open", this), 2000);
        } else {
            state = "close";
            toggleOptions("close", this);
        }
        toggleRef(state);
    });

    $("#list").click(function(){
        var state = "";
        if($("div.list-container").css("display") == "none") {
            state = "open";
            closeContainers();
            setTimeout(toggleList("open", this), 2000);
        } else {
            state = "close";
            toggleList("close", this);
        }
        toggleRef(state);
    });    

    $("#list_button").click(function(){
        generateFromList(document.getElementById("listvalue").value);
    });  

    $("form[name='regex_form']").on('submit', initializeGenerator);

    $('#docs').click(function() {
        window.location = 'strgen_doc.html';
    });

    $(document).on("click", ".log_bar", function() {
        var element = "#" + $(this).parent().attr('id');

        if ($(element).find('p.log_content').css('display') == "none") {
            openLog($(this), element);
        } else {
            closeLog($(this), element);
        }
    });

    $(document).on("click", ".pattern-ex", function() {
        document.getElementById("templatebox").value = $(this).text();
        initializeGenerator();
    });

    $(document).on("click", ".predefined-ex", function() {
        var range = $(this).text();
        var pattern = document.getElementById("templatebox").value;

        if (pattern == "") {
            pattern = "[]"
        } else if (pattern != "" && pattern.indexOf(']') < 0) {
            pattern += "[]"
        }

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

    $("#togglepattern").change(function(){
        if ($(this).is(":checked") == false) {
            $("#pattern_wrap").css({display:'none'});
        }
        else if ($(this).is(":checked") == true) {
            $("#pattern_wrap").css({display:'block'});
        }
    });

    $(document).on("click", ".reset-presets", function() {
        resetPresetOptions();
        $('.notification').remove();
        displayNotification("", "Preset options have been reset!", "strgen-ui", 10000, 'orange', 'black', "thin solid", "black");
    });

    $(document).on("click", ".log_export", function() {
        $('.notification').remove();
        displayNotification("", "Log exported!", "strgen-ui", 10000, 'orange', 'black', "thin solid", "black");
    });

            
    $(document).on("click", ".notification", function() {
        $(this).stop(true);
        $(this).fadeOut("slow").qremove();
    });

    $(window).resize(function() {
        resizeContent();
    });

    function toggleRef(state) {
        if($("div.ref-container").css("display") == "none" && state == "close") {
            $("div.ref-header").delay(100).qcss({display:'flex'}).qcss({marginTop:'0px'}).qcss({width:'60vw'}).qcss({height:'4vh'}).qtext("Reference"); //height:'63.56px'
            $("div.ref-header").css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'}); //fontSize:'16px'
            $("div.ref-container").delay(110).slideToggle(100);
        } else if(state == "open") {
            $("div.ref-container").slideUp(100);
            $("div.ref-header").delay(100).qtext("").qcss({display:'none'});       
        }
    }

    function toggleOptions(state, element) {
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

    function toggleLog(state, element) {
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

    function toggleList(state, element) {
        if (state == "open") {
            $(element).css({backgroundColor:bgColour}).css({color:'white'}).attr("src","img/doc-active.svg");
            $(element).find("img").attr("src","img/list-active.svg");
            $("div.list-header").delay(100).qcss({display:'flex'}).qcss({marginTop:'0px'}).qcss({width:'60vw'}).qcss({height:'4vh'}).qtext("Generate from list"); //height:'63.56px'
            $("div.list-header").css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'}); //fontSize:'16px'
            $("div.list-container").delay(110).slideToggle(100);
            $("#button_wrap").qcss({display:'none'});
            $("#pattern_wrap").qcss({display:'none'});
        } else if (state == "close") {
            $("div.list-container").slideUp(100);
            $("div.list-header").delay(100).qtext("").qcss({display:'none'});
            $(element).css({backgroundColor:'white'}).css({color:'initial'});
            $(element).find("img").attr("src","img/list.svg");
            $("#button_wrap").qcss({display:'block'});
            $("#pattern_wrap").qcss({display:'block'});
            $("#togglepattern").prop("checked", false);
        }
    }

    function closeContainers() {
        if ($("div.history-list").css("display") != "none") {
            toggleLog("close", "#logs"); 
        } else if($("div.config-container").css("display") != "none") {
            toggleOptions("close", "#options"); 
        } else if ($("div.list-container").css("display") != "none") {
            toggleList("close", "#list");
        }
    }

    function openLog(parent, element) {
        closeLog(parent, '.history_record'); // close all logs that are currently open

        $(element).find('p.log_content').css('display','block').css('border-color', bgColour);    
        $(element).css('background-color', bgColour);
        //$(parent).css('color', 'white').css('padding-left','4px');  
        $(element).find('div.log_label').css('color', 'white').css('padding-left', '4px');
        $(element).find('div.log_export a').css('color', 'white').css('padding-right', '4px');
        resizeContent();
    }

    function closeLog(parent, element) {
        $(element).find('p.log_content').css('display','none');
        $(element).css('background-color', '');
        //$(parent).css('color', 'black').css('padding-left', '0px');
        $(element).find('div.log_label').css('color', 'black').css('padding-left', '0px');
        $(element).find('div.log_export a').css('color', linkColour).css('padding-right', '0px');

        if ($(element).find('p.log_content').css('display') == 'none') {
            $(element).find('.log_label').css('color', 'black').css('padding-left', '0px');
        }       
    }

    function resizeContent() {
        var window_height = $(window.top).height();
        var window_width = $(window.top).width();

        if(window_width < 1026 | window_height < 651) {
            var new_height = Math.floor((window_height - 353) - (window_height / 60)) + "px";
            var list_new_height = Math.floor((window_height - 353) - (window_height / 60)) + 45 + "px";
        } else {
            var new_height = Math.floor((window_height - 353) - (window_height / 14)) + "px";
            var list_new_height = Math.floor((window_height - 353) - (window_height / 14)) + 45 + "px";
        }

        $("div.content-container").css({maxHeight:new_height});
        $("div.content-container.list-container").css({maxHeight:list_new_height});

        if(window_width < 1026 | window_height < 651) {
            var new_size = Math.floor(10 + (window_width / 9));

            if(new_size > 60) {
                new_size = 60 + "px";
            } else {
                new_size = new_size + "px";
            }
        } else {
            var new_size = 60 + "px"
        }

        $("div.toolbar").css({height:new_size});
        $("div.toolbar-button").css({height:new_size});
        $("div.toolbar-button").css({width:new_size});

        var log_width = $("div.log_bar").outerWidth() - 9.5;
        $("p.log_content").css({width:log_width});

        //console.log('log has resized - log_width: ' + log_width);

        //console.log('buttons have resized - window_height: ' + window_height + ", window width: " + window_width + ', new_size: ' + new_size);
        //console.log('window has resized - window_height: ' + window_height + ', new_height: ' + new_height + ', window_width: ' + window_width);
    }
});