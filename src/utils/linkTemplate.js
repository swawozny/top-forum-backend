const {APP_HOST} = process.env;

const createLink = (route, params) => {
    const paramsArray = Object.keys(params).map(param => `${param}=${params[param]}`);
    return `${APP_HOST}/${route}?${paramsArray.join('&')}`;
};

const createHtmlLink = (name, route, params) => {
    return `<a href=${createLink(route, params)}>${name}</a>`;
};

module.exports = {
    createLink,
    createHtmlLink
};
