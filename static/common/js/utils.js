export default {
    doRequest: doRequest,
    doDataRequest: function(url, method, data, clb) {
        var opts = {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        doRequest(url, opts, clb);
    }
}

function doRequest(url, opts, clb) {
    fetch(url, opts).then(function(resp) {
        return resp.json();
    }).then(function(data) {
        clb(data)
    });
};