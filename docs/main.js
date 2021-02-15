main = () => {
    const STEAM_APP_URL = "https://store.steampowered.com/app/" // append app_id

    // Sort by newest-first, up to the max (100 per page). See: https://partner.steamgames.com/doc/store/getreviews
    const STEAM_BASE_URL = "https://store.steampowered.com/appreviews/{}?json=1&filter=recent&num_per_page=100"

    const OUTPUT_ELEMENT_ID = "content"
    
    var output = "";
    var queryParameters = window.location.search.slice(1).split("&");
    var foundAppIds = false;

    for (var i = 0; i < queryParameters.length; i++)
    {
        var params = queryParameters[i].split('=');
        var key = params[0];
        var value = params[1];
        if (key.toLowerCase() == "appids") {
            foundAppIds = true;
            break;
        }
    }

    if (!foundAppIds)
    {
        output = "No app IDs found, please append them to the URL, e.g. ?appIds=123456,789098"
    }

    document.getElementById(OUTPUT_ELEMENT_ID).innerHTML = output;
}