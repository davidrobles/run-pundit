(function() {

    function getMiles(i) {
        return i * 0.000621371192;
    }

    function getMeters(i) {
        return i * 1609.344;
    }

    // Use seconds and meters for everything

    var convertKmPaceToMi = function(secondsPerKm) {
        return secondsPerKm * 1.60934;
    };

    var convertMiPaceToKm = function(secondsPerMi) {
        return secondsPerMi * 0.621371;
    };

    var formatTime = function(seconds) {
        var hours = Math.floor(seconds / 3600),
            mins  = Math.floor(seconds / 60) % 60,
            secs  = Math.round(seconds % 60);
        if (hours < 10) {
            hours = "0" + hours;
        }
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
        return formatTime(distance * pace);
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

    // Peter Riegel formula
    var convert = function(distance1, time1, distance2) {
        return time1 * Math.pow(distance2 / distance1, 1.06);
    };

    /////////////
    // Table 1 //
    /////////////

    var RaceTimesPaceTable = function() {

    };

    RaceTimesPaceTable.prototype.render = function() {
        var str = "";
        str += "<table>";
        str += "<thead>";
        str += "<tr><th>MM:SS/MI</th><th>MM:SS/KM</th></th><th>5K</th><th>10K</th><th>HALF MARATHON</th><th>MARATHON</th></tr>";
        str += "</thead>";
        str += "<tbody>";
        for (var secs = minPace; secs <= maxPace; secs++) {
            if (secs % 2 === 0) {
                str += "<tr>";
            } else {
                str += '<tr class="alternate">';
            }
            str += "<td>" + formatTime(secs) + "</td>";
            str += "<td>" + formatTime(convertMiPaceToKm(secs)) + "</td>";
            str += "<td>" + distanceAndPaceToDuration(CD["5K"], convertMiPaceToKm(secs) / 1000) + "</td>";
            str += "<td>" + distanceAndPaceToDuration(CD["10K"], convertMiPaceToKm(secs) / 1000) + "</td>";
            str += "<td>" + distanceAndPaceToDuration(CD["HM"], convertMiPaceToKm(secs) / 1000) + "</td>";
            str += "<td>" + distanceAndPaceToDuration(CD["M"], convertMiPaceToKm(secs) / 1000) + "</td>";
            str += "</tr>";
        }
        str += "</tbody>";
        str += "</table>";
        return str;
    };

    /////////////
    // Table 2 //
    /////////////

    var RacePredictionTable = function(options) {
        this.startDuration = options.startDuration;
        this.stopDuration = options.stopDuration;
    };

    RacePredictionTable.prototype.render = function() {
        var str = "<table>";
        str += "<thead>";
        str += "<tr><th>5K</th><th>10K</th><th>HALF MARATHON</th><th>MARATHON</th></tr>";
        str += "</thead>";
        str += "<tbody>";
        for (var secs = this.startDuration; secs < this.stopDuration; secs += 5) {
            if (secs % 2 === 0) {
                str += "<tr>";
            } else {
                str += '<tr class="alternate">';
            }
            str += "<td>" + formatTime(secs) + "</td>";
            str += "<td>" + formatTime(convert(5000, secs, CD["10K"])) + "</td>";
            str += "<td>" + formatTime(convert(5000, secs, CD["HM"])) + "</td>";
            str += "<td>" + formatTime(convert(5000, secs, CD["M"])) + "</td>";
            str += "</tr>";
        }
        str += "</tbody>";
        str += "</table>";
        return str;
    };

    var racePredictionTable = new RacePredictionTable({
        startDuration: 700,
        stopDuration: 2500
    });
    document.getElementById("race-prediction").innerHTML = racePredictionTable.render();
    document.getElementById("race-times-pace").innerHTML = new RaceTimesPaceTable().render();

})();
