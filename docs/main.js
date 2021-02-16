const STEAM_APP_URL = "https://store.steampowered.com/app/" // append app_id

// Sort by newest-first, up to the max (100 per page). See: https://partner.steamgames.com/doc/store/getreviews
const STEAM_BASE_URL = "https://store.steampowered.com/appreviews/{0}?json=1&filter=recent&num_per_page=100"

main = () => {
    const OUTPUT_ELEMENT_ID = "content"
    
    var output = "";
    var appIds = getAppIdsFromUrl();
    var now = Date.now() / 1000; // unix timestamp

    if (appIds.length > 0) {
        var reviews = getReviews(appIds);
        for (var i = 0; i < reviews.length; i++)
        {
            var review = review["appId"];
            var reviewDate = review["timestamp_created"];
            var daysAgo = Math.round(now - reviewDate)
            content += "<h1>Review #" + (i+1) + " on " + review["appId"] + "(" + daysAgo + "days ago)</h1>"
        }
    } else {
        output = "No app IDs found, please append them to the URL, e.g. ?appIds=123456,789098"
    }

    // Write output
    document.getElementById(OUTPUT_ELEMENT_ID).innerHTML = output;
}

getAppIdsFromUrl = () => {
    var queryParameters = window.location.search.slice(1).split("&");
    
    for (var i = 0; i < queryParameters.length; i++)
    {
        var params = queryParameters[i].split('=');
        var key = params[0];
        var value = params[1];
        if (key.toLowerCase() == "appids") {
            var appIds = value.split(",");
            return appIds;
        }
    }

    return [];
}

getReviews = (appIds) => {
    // Call the API for each app and get reviews
    var reviews = [];

    for (var i = 0; i < appIds.length; i++)
    {
        var appId = appIds[i];
        var url = STEAM_BASE_URL.replace("{0}", appId)
        httpGetAsync(url, (response) => {
            var jsonResponse = JSON.parse(response);
            if (jsonResponse["success"] != 1) {
                console.error("Failed to get data for app " + appId + "; success=" + jsonResponse["success"]);
            } else {
                var appReviews = jsonResponse["reviews"];
                for (var j = 0; j < appReviews.length(); j++) {
                    appReviews[j]["appId"] = appId;
                    reviews.push(appReviews[j]);
                }
            }
        })
    }
}

// From https://stackoverflow.com/questions/247483/http-get-request-in-javascript/38297729#38297729
httpGetAsync = (theUrl, callback) => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }

    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Origin', 'https://store.steampowered.com');
    xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlHttp.setRequestHeader('Access-Control-Allow-Methods', 'GET');
    xmlHttp.send(null); // ?!
}