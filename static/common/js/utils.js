export default {
    doRequest,
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
    },
    stringFormat,
    formatDbDateToWeb
}

function doRequest(url, opts, clb) {
    fetch(url, opts).then(function(resp) {
        return resp.json();
    }).then(function(data) {
        clb && clb(data)
    });
};

function stringFormat(tpl) {
    for(var i = 1; i < arguments.length; i++) {
        var regexp = new RegExp('{' + (i - 1) + '\\}', 'g');
        tpl = tpl.replace(regexp, arguments[i]);
    }
    return tpl;
};

function formatDbDateToWeb(date) {
    let splittedDate = date.split('T');
    return splittedDate[1].split('.')[0] + ' ' + splittedDate[0];
};