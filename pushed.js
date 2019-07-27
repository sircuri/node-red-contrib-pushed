module.exports = function(RED) {
    "use strict";
    var request = require("request");

    var PUSHED_URL = "https://api.pushed.co/1/push"
    var PUSHED_TARGET_TYPE = "app"
	var STRICT_SSL = true;
    var REQUEST_TIMEOUT = 5000;
    
    var isObject = function(a) {
        if ((typeof(a) === "object") && (!Buffer.isBuffer(a)) && (!Array.isArray(a))) { return true; }
        else { return false; }
    };

    function PushedNode(config) {
        RED.nodes.createNode(this, config);

        this.app_key = config.key;
        this.app_secret = config.secret;

        var node = this;

        node.on('input', function(msg) {
            if (!isObject(msg.payload)) {
                msg.payload = {payload: msg.payload};
            }

            data = {
                app_key: this.app_key,
                app_secret: this.app_secret,
                target_type: PUSHED_TARGET_TYPE,
                content: msg.payload
            };

            request({
                url: PUSHED_URL,
                method: "POST",
                followAllRedirects: true,
                timeout: REQUEST_TIMEOUT,
                strictSSL: STRICT_SSL,
                json: data
            }, function (error, response, body) {
                var responseData = JSON.parse(body);

                if (response.statusCode == 200) {
                    this.status({fill: "green", shape: "dot", text: responseData.response.message});
                    this.log(responseData);
                } else {
                    this.status({fill: "red", shape: "ring", text: responseData.error.message});
                    this.warn(responseData);
                }
            });
        });
    }
    RED.nodes.registerType("pushed", PushedNode);
}