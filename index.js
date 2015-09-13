var csv = require("fast-csv");
var fs = require("fs");

var state_fips = require("./state_fips.json");

// counties
var json = [],
	fields = {
		fips: "GEOID",
		state: "STATEFP",
		name: "NAMELSAD",
		lat: "INTPTLAT",
		lng: "INTPTLON"
	};

fs.createReadStream("raw/counties.csv")
    .pipe(csv({ headers: true }))
    .on("data", function(data){
    	var county = {};
    	for (var field in fields) if (fields.hasOwnProperty(field)) {
    		county[field] = data[fields[field]];
    		if (field == "lat" || field == "lng") {
    			county[field] = parseFloat(county[field]);
    		}

    		if (field === "state") {
    			county[field] = state_fips[county[field]];
    		}
    	}
    	json.push(county);
    })
    .on("end", function(){
    	fs.writeFileSync("counties.json", JSON.stringify(json, null, 2));
    });