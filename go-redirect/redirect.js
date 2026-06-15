// CloudFront Function (runtime: cloudfront-js-2.0), attached to the
// "Viewer request" event of the go.microvpp.com distribution.
//
// It 301-redirects every request to the real registration page on www,
// rewriting the path to /lin.html while preserving the incoming query
// string (e.g. ?sn=2517-65170160PH&state=texas).
//
//   https://go.microvpp.com/?sn=ABC123  ->  https://www.microvpp.com/lin.html?sn=ABC123
//
// The distribution's origin is never fetched because this function returns
// a response during the viewer-request phase.
function handler(event) {
    var qs = event.request.querystring;
    var parts = [];
    for (var key in qs) {
        if (qs[key].multiValue) {
            qs[key].multiValue.forEach(function (v) { parts.push(key + '=' + v.value); });
        } else {
            parts.push(key + '=' + qs[key].value);
        }
    }
    var query = parts.length ? '?' + parts.join('&') : '';
    return {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: {
            'location':      { value: 'https://www.microvpp.com/lin.html' + query },
            'cache-control': { value: 'max-age=3600' }
        }
    };
}
