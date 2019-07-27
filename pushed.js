module.exports = function(RED) {
    "use strict";
    var request = require("request");

    var PUSHED_URL = "https://api.pushed.co/1/push"
    var PUSHED_TARGET_TYPE = "app"

    function PushedNode(config) {
        RED.nodes.createNode(this, config);

        this.app_key = config.key;
        this.app_secret = config.secret;

        var node = this;

        node.on('input', function(msg) {
            const data = {
                'app_key': this.app_key,
                'app_secret': this.app_secret,
                'target_type': PUSHED_TARGET_TYPE,
                'content': msg.payload
            };

            request.post({
                url: PUSHED_URL,
                form: data,
                json: true
            }, function (error, response, body) {
                if (response.statusCode == 200) {
                    node.status({fill: "green", shape: "dot", text: body.response.message});
                } else {
                    node.status({fill: "red", shape: "ring", text: body.error.message});
                }
                msg.payload = body;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("pushed", PushedNode);
}
