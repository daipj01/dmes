var util = {};
util.jsonToFormData = function (json) {
    let data = '';
    const keys = Object.keys(json);
    keys.forEach((key, i) => {
        i === (keys.length - 1) ? data += `${key}=${json[key]}` : data += `${key}=${json[key]}&`
    });
    return data;
};

util.sessionClean = function () {
    window.localStorage.removeItem('list');
    window.localStorage.removeItem('terminal');
    window.localStorage.removeItem('serialPort');
    window.localStorage.removeItem('sessionId');
    window.localStorage.removeItem('title');
    window.localStorage.removeItem('userCode');
};
export default util;
