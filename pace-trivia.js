function getMiles(i) {
    return i * 0.000621371192;
}

function getMeters(i) {
    return i * 1609.344;
}

var Distance = function(meters) {
    this.meters = meters;
};

Distance.prototype.toKM = function() {
    return this.meters / 1000;
};

Distance.prototype.toMI = function() {
};

// Use seconds and meters for everything


var convertKmPaceToMi = function(secondsPerKm) {
    return secondsPerKm * 1.60934;
};

var convertMiPaceToKm = function(secondsPerMi) {
    return secondsPerMi * 0.621371;
};

var secsToMins = function(seconds) {
    var hours = Math.floor(seconds / (60 * 60)),
        mins  = Math.floor(seconds / 60) % 60,
        secs  = Math.round(seconds % 60);
    if (mins < 10) {
        mins = "0" + mins;
    }
    if (secs < 10) {
        secs = "0" + secs;
    }
    return hours + ":" + mins + ":" + secs;
};

// distance in meters
// pace in seconds
var distanceAndPaceToDuration = function(distance, pace) {
    return secsToMins(distance * pace);
};

// in meters
var CD = {
    "5K":    5000,
    "10K":  10000,
    "HM":   21097.5,
    "M":    42195
};

var minPace = 240,
    maxPace = 779;

var showAll = function() {
    document.write("<table>");
    document.write("<thead>");
    document.write("<tr><th>MM:SS/MI</th><th>MM:SS/KM</th></th><th>5K</th><th>10K</th><th>HALF MARATHON</th><th>MARATHON</th></tr>");
    document.write("</thead>");
    document.write("<tbody>");
    for (var secs = minPace; secs <= maxPace; secs++) {
        if (secs % 2 === 0) {
            document.write("<tr>");
        } else {
            document.write('<tr class="alternate">');
        }
        document.write("<td>" + secsToMins(secs) + "</td>");
        document.write("<td>" + secsToMins(convertMiPaceToKm(secs)) + "</td>");
        document.write("<td>" + distanceAndPaceToDuration(CD["5K"], convertMiPaceToKm(secs) / 1000) + "</td>");
        document.write("<td>" + distanceAndPaceToDuration(CD["10K"], convertMiPaceToKm(secs) / 1000) + "</td>");
        document.write("<td>" + distanceAndPaceToDuration(CD["HM"], convertMiPaceToKm(secs) / 1000) + "</td>");
        document.write("<td>" + distanceAndPaceToDuration(CD["M"], convertMiPaceToKm(secs) / 1000) + "</td>");
        document.write("</tr>");
    }
    document.write("</tbody>");
    document.write("</table>");
};

showAll();

// Peter Riegel formula
var convert = function(distance1, time1, distance2) {
    return time1 * Math.pow(distance2 / distance1, 1.06);
};

var str = "<table>";
str += "<thead>";
str +="<tr><th>5K</th><th>10K</th><th>HALF MARATHON</th><th>MARATHON</th></tr>";
str += "</thead>";
str += "<tbody>";
for (var secs = 700; secs < 2500; secs += 5) {
    if (secs % 2 === 0) {
        str += "<tr>";
    } else {
        str += '<tr class="alternate">';
    }
    str += "<td>" + secsToMins(secs) + "</td>";
    str += "<td>" + secsToMins(convert(5000, secs, CD["10K"])) + "</td>";
    str += "<td>" + secsToMins(convert(5000, secs, CD["HM"])) + "</td>";
    str += "<td>" + secsToMins(convert(5000, secs, CD["M"])) + "</td>";
    str += "</tr>";
}
str += "</tbody>";
str += "</table>";
var racePredictionDiv = document.getElementById("race-prediction");
racePredictionDiv.innerHTML = str;
