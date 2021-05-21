const authenticate = function (client, data, callback) {
    var  jsMsg = JSON.parse(message);
    callback(jsMsg.password === '123456');
};



module.exports = function (ws, redT, req) {
    ws.on("message", async function (message) {
        if (!message) {
            return;
        }

        authenticate(this, message, async function (isSuccess) {
            if(isSuccess) {
                // store session to online user
            } else{
                this.red({ unauth: { message: "Authentication failure" } });
            }            
        }.bind(this));
    });    

    ws.on("close", function (message) {
        // remove online user session
    });
};


