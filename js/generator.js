var history = new Array();
var count = 0;
var notification_count = 0;
var generator = new Strgen();

function initialize_generator() {
	try {
	    document.getElementById('stringvalue').innerHTML = "";
	    $('.notification').remove();

	    var pattern = document.getElementById('templatebox').value;
	    var allow_duplicate_characters = document.getElementById('allowduplicates').checked;
	    var enable_logging = document.getElementById('enablelogging').checked;
	    var reporting_type = document.getElementById('reportingdropdown').value;
        var allow_multiple_instances =  document.getElementById('multipleduplicates').checked;
        var ignore_duplicate_case =  document.getElementById('caseduplicates').checked;
        var symbol_quantifier_max = document.getElementById('maxquantifier').value;
        
        var generator = new Strgen(); // refresh strgen instance

	    generator.pattern = pattern;
	    generator.allow_duplicate_characters = allow_duplicate_characters;
	    generator.allow_logging = enable_logging;
	    generator.reporting_type = reporting_type;
	    generator.store_errors = true;
        generator.allow_multiple_instances = allow_multiple_instances;
        generator.ignore_duplicate_case = ignore_duplicate_case;
        generator.symbol_quantifier_max = symbol_quantifier_max;

        for (preset in generator.preset) {
            generator.preset[preset].value = document.getElementById(generator.preset[preset].preset_code).value;
        }

	    var generated_string = generator.createString();

        get_errors(generator);

        if(generated_string != undefined) {
           document.getElementById("stringvalue").innerHTML = generated_string; 
        } else {
            generated_string = "";
        }
	    
	    record_value(pattern, generated_string, generator.generator_log);
	} catch(error) {
        display_error("Error! ", error.message);
        get_errors(generator);
	    console.error(error.message);
	    console.error(error.stack);
	}
};

function record_value(pattern, generated_output, log_array) {
    if (log_array != "") {
        if (pattern == "") {
            pattern = "no pattern";
        }

        if (generated_output == "") {
            generated_output = "no string generated";
        } else if (generated_output == " ") {
            generated_output = "white space";
        }

        create_fields(pattern, generated_output, count, pattern + " - " + generated_output, log_array);

        count += 1;
    }
};

function create_fields(pattern, generated_output, count, log_label, log_array) {
    var current_id = "result" + count;
    var current_count = count;

    if (!document.getElementById(current_id)){
        var container = document.createElement("div");

        container.setAttribute("id", current_id);
        container.setAttribute("class", "history_record");
        container.setAttribute("title", generated_output);

        document.getElementById("historylist").appendChild(container);
    }
    var divLabel = document.createElement("div"); // create log label

    divLabel.setAttribute("id", current_id + "_label");
    divLabel.setAttribute("class", "log_label");
    document.getElementById(current_id).appendChild(divLabel);

    document.getElementById(current_id + "_label").innerHTML = "<b>Log entry " + (current_count + 1) + ":</b> " + log_label;

    var divExport = document.createElement("div"); // create export label

    divExport.setAttribute("id", current_id + "_export");
    divExport.setAttribute("class", "log_export");
    document.getElementById(current_id).appendChild(divExport);

    var paragraph = document.createElement("p"); // create log content

    paragraph.setAttribute("id", current_id + "_p");
    paragraph.setAttribute("class", "log_content");
    document.getElementById(current_id).appendChild(paragraph);

    var log_string = "";

    if (log_array != "") {
        for (var count = 0; count <= log_array.length - 1; count++) {
            log_string += log_array[count] + "~";
        }
    } else {
        log_string = "No log entries..."
    }

    var log_content = log_string.split('~').join("\r\n");
    var export_content = encodeURIComponent(log_content);

    document.getElementById(current_id + "_p").innerHTML = log_content;

    var a = document.getElementById(current_id + "_export").appendChild(
        document.createElement("a")
        );

    var currentdate = new Date(); 

    var date_string = currentdate.toLocaleDateString();
    date_string = date_string.split('/').join("-");

    var time_string = currentdate.toLocaleTimeString();
    time_string = time_string.split(':').join("-");
    
    var date_time_string = date_string + "-" + time_string;

    a.download = log_label + "_" + current_id + "_" + date_time_string + ".txt";
    a.href = "data:text/plain;charset=utf-8," + export_content;
    a.innerHTML = "Export";
};

function create_preset_options(strgen = generator, count = 0) {
    var current_id = "preset" + count;
    var current_count = count;
    var parent = document.getElementsByClassName("sub-container preset-options")[0];

    var preset = strgen.preset[count].preset_code;
    var value = strgen.preset[count].value;

    var presetLabel = document.createElement("label"); // create export label

    presetLabel.setAttribute("id", preset + "_label");
    presetLabel.setAttribute("class", "preset-label");
    parent.appendChild(presetLabel);

    document.getElementById(preset + "_label").innerHTML = "\\" + preset;

    var presetInput = document.createElement("input"); // create log content

    presetInput.setAttribute("type", "text");
    presetInput.setAttribute("id", preset);
    presetInput.setAttribute("class", "preset-content");
    presetInput.setAttribute("value", value);
    parent.appendChild(presetInput);
    count += 1;

    if (strgen.preset.length > count) {
        this.create_preset_options(strgen, count)
    }
}

function display_error(caption, message, fade = 5000, colour = 'var(--active-colour') {
    notification_count +=1;

    var notifElement = document.createElement("div");
    var notifId = "notif_" + notification_count;

    notifElement.setAttribute("id", notifId);
    notifElement.setAttribute("class", "notification");
    notifElement.setAttribute("style", "display: none");

    document.getElementById("notification-area").appendChild(notifElement);

    notifId = "#" + notifId;

    var timer = null;

    if (timer) { 
        window.clearTimeout(timer); timer = null;
    };

    $(notifId).stop(true, true);

    $(notifId).css('background-color', colour);

    if (message != undefined) {
        $(notifId).fadeIn("fast").append(message);
    } else {
        $(notifId).fadeIn("fast");
    }

    $(notifId + " br:lt(1)").remove();

    $(notifId).prepend("<b>" + caption + "</b><br />");

    timer = window.setTimeout(function() { 
        $(notifId).fadeOut("slow").qremove();    
    }, fade);
};

function get_errors(generator) {
    if (generator.error_list != null) {
        for (error in generator.error_list) {
            if (generator.error_list[error].state == "warning") {
                display_error("Warning! ", generator.error_list[error].msg, 15000, 'var(--warning-colour');
            } else if (generator.error_list[error].state == "error") {
                display_error("Error! ", generator.error_list[error].msg, 5000, 'var(--active-colour');
            }
        }
    }
}