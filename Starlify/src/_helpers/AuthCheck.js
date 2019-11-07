export const isAuthenticated = () => {
    fetch(process.env.REACT_APP_API + "/hypermedia/domains")
    .then(result => { console.log(result); });

    var cookie = document.cookie.replace(/(?:(?:^|.*;\s*)JSESSIONID\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!cookie){
        return false;
    }else{
        return true;
    }
}
