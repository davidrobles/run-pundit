var RPC = RPC || {};

RPC.Pace = function(options) {
    this.seconds = options.seconds;
};

RPC.Distance = function(options) {
    this.name = options.name;
    this.len = options.len;
};

RPC.Distance.prototype.toMeters = function() {
    return this.len;
};

RPC.getMiles = function(i) {
    return i * 0.000621371192;
}

RPC.getMeters = function(i) {
    return i * 1609.344;
}

// Use seconds and meters for everything

RPC.convertKmPaceToMi = function(secondsPerKm) {
    return secondsPerKm * 1.60934;
};

RPC.convertMiPaceToKm = function(secondsPerMi) {
    return secondsPerMi * 0.621371;
};

RPC.formatTime = function(seconds) {
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
RPC.distanceAndPaceToDuration = function(distance, pace) {
    return RPC.formatTime(distance * pace);
};

// in meters
RPC.CD = {
    "5K": new RPC.Distance({
        name: "5K",
        len: 5000
    }),
    "10K": new RPC.Distance({
        name: "10K",
        len: 10000
    }),
    "HM": new RPC.Distance({
        name: "Half Marathon",
        len: 21097.5
    }),
    "M": new RPC.Distance({
        name: "Marathon",
        len: 42195
    })
};

// Peter Riegel formula
RPC.riegelPredictor = function(distance1, time1, distance2) {
    return time1 * Math.pow(distance2 / distance1, 1.06);
};

/////////////
// Table 1 //
/////////////

RPC.RaceTimesPaceTable = function(options) {
    this.distances = options.distances;
    this.startPace = options.startPace;
    this.stopPace = options.stopPace;
    this.el = options.el || document.createElement("table");
};

RPC.RaceTimesPaceTable.prototype.render = function() {
    var str = "";
    str += "<thead>";
    str += "<tr><th>MM:SS/MI</th><th>MM:SS/KM</th></th>";
    for (var i = 0; i < this.distances.length; i++) {
        str += "<th>" + this.distances[i].name + "</th>";
    }
    str += "</thead>";
    str += "<tbody>";
    for (var secs = this.startPace; secs <= this.stopPace; secs++) {
        if (secs % 2 === 0) {
            str += "<tr>";
        } else {
            str += '<tr class="alternate">';
        }
        str += "<td>" + RPC.formatTime(secs) + "</td>";
        str += "<td>" + RPC.formatTime(RPC.convertMiPaceToKm(secs)) + "</td>";
        for (var i = 0; i < this.distances.length; i++) {
            str += "<td>" + RPC.distanceAndPaceToDuration(this.distances[i].toMeters(),
                    RPC.convertMiPaceToKm(secs) / 1000) + "</td>";
        }
        str += "</tr>";
    }
    str += "</tbody>";
    this.el.innerHTML = str;
    return this;
};

/////////////
// Table 2 //
/////////////

RPC.RacePredictionTable = function(options) {
    this.startDuration = options.startDuration;
    this.stopDuration = options.stopDuration;
    this.el = options.el || document.createElement("table");
};

RPC.RacePredictionTable.prototype.render = function() {
    var str = "";
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
        str += "<td>" + RPC.formatTime(secs) + "</td>";
        str += "<td>" + RPC.formatTime(RPC.riegelPredictor(5000, secs, RPC.CD["10K"].toMeters())) + "</td>";
        str += "<td>" + RPC.formatTime(RPC.riegelPredictor(5000, secs, RPC.CD["HM"].toMeters())) + "</td>";
        str += "<td>" + RPC.formatTime(RPC.riegelPredictor(5000, secs, RPC.CD["M"].toMeters())) + "</td>";
        str += "</tr>";
    }
    str += "</tbody>";
    this.el.innerHTML = str;
    return this;
};

var racePredictionTable = new RPC.RacePredictionTable({
    startDuration: 700,
    stopDuration: 2500
});
document.getElementById("race-prediction").appendChild(racePredictionTable.render().el);

var raceTimesPaceTable = new RPC.RaceTimesPaceTable({
    startPace: 240,
    stopPace: 779,
    distances: [RPC.CD["5K"], RPC.CD["10K"], RPC.CD["HM"], RPC.CD["M"]]
});
document.getElementById("race-times-pace").appendChild(raceTimesPaceTable.render().el);
