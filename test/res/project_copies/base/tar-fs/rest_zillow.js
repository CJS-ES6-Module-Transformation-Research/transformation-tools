var unirest = require("unirest");

var req = unirest("POST", "https://zillowdimashirokovv1.p.rapidapi.com/GetChart.htm");

req.headers({
	"x-rapidapi-host": "ZillowdimashirokovV1.p.rapidapi.com",
	"x-rapidapi-key": "X1-ZWz17bsoegdbt7_56tmg",
	"content-type": "application/x-www-form-urlencoded"
});

req.form({
	"chartDuration": [
		"1year",
		"5years",
		"10years"
	],
	"unit-type": "dollar",
	"zws-id": "<required>"
});

req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});