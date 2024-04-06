//TEMPORAIRE
module.exports = function (url) {
    if(!url) return null
    return url.includes("http") ? url : `${process.env.API_URL}/${url}`
}