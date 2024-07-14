const PaperlessApi = require('./paperless-api');

module.exports = function (RED) {
    function GetCorrespondentsNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.server = RED.nodes.getNode(config.server);
        this.name = config.name;

        node.on('input', async function (msg, send, done) {

            const api = PaperlessApi.create(this.server.hostname,
                this.server.port,
                this.server.apiKey,
                this.server.tlsEnabled)
            let tags = await api.getCorrespondents()

            send({ ...msg, payload: tags })

        })
    }
    RED.nodes.registerType("paperless-ngx-get-correspondents", GetCorrespondentsNode);
}