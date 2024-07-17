const PaperlessApi = require('./paperless-api');

module.exports = function (RED) {
    function DownloadDocument(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.server = RED.nodes.getNode(config.server);
        this.filter = config.query;
        this.enrich = config.enrich

        node.on('input', async function (msg, send, done) {
            const api = PaperlessApi.create(this.server.hostname,
                this.server.port,
                this.server.apiKey,
                this.server.tlsEnabled)
            const docId = this.docid || msg.payload?.docid
            if (!docId) {
                node.error('No document ID provided', msg)
                node.status({ fill: 'red', shape: 'dot', text: 'No document ID provided' })
                return
            } else {
                node.status({})
            }
            let document = await api.downloadDocument(docId)

            send({ ...msg, payload: document })

        })
    }
    RED.nodes.registerType("paperless-ngx-download-document", DownloadDocument);
}