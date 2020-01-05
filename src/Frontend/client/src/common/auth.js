class Auth{
    token;
    user;
    constructor(){
        var token = sessionStorage.getItem("DOPR_TOKEN");
        var user = sessionStorage.getItem("DOPR_USER");
        this.token = token;
        this.user = JSON.parse(user);
    }

    getUser(){
        return this.user;
    }
    async setSessionStorage(response){
        sessionStorage.setItem("DOPR_USER", JSON.stringify(response.data.data))
        sessionStorage.setItem("DOPR_TOKEN", String(response.data.token))
    }
}
export default new Auth();