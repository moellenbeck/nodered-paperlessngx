const PaperlessApi = require('./paperless-api');

module.exports = function (RED) {
    function UpdateDocumentNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.server = RED.nodes.getNode(config.server);
        this.name = config.name;
        this.docid = config.docid;


        node.on('input', async function (msg, send, done) {
            try {


                const docId = this.docid ? this.docid : msg.docid

                if (!docId) {
                    node.error('No document ID provided', msg)
                    node.status({ fill: 'red', shape: 'dot', text: 'No document ID provided' })
                    return
                }
                const api = PaperlessApi.create(this.server.hostname,
                    this.server.port,
                    this.server.apiKey,
                    this.server.tlsEnabled)
                let result = await api.updateDocument(docId, msg.payload)

                send({ ...msg, payload: result })
                this.status({});
            } catch (e) {
                this.status({ fill: "red", shape: "ring", text: "Error: " + e });
                this.error(e)
            }

        })
    }
    RED.nodes.registerType("paperless-ngx-update-document", UpdateDocumentNode);
}