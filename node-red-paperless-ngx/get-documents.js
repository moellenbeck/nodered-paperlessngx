const PaperlessApi = require('./paperless-api');

module.exports = function (RED) {
    function GetDocumentsNode(config) {
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
            const filter = !this.filter || this.filter === "" ? msg.query : this.filter
            let documents = await api.getDocuments(filter)
            if (this.enrich) {
                const tags = await api.getTags()
                const correspondents = await api.getCorrespondents()
                const docTypes = await api.getDocTypes()
                const customFields = await api.getCustomFields()

                documents = documents.map((doc) => ({
                    ...doc,
                    correspondent: correspondents.find(c => c.id == doc.correspondent),
                    document_type: docTypes.find(c => c.id == doc.document_type),
                    tags: doc.tags.map(tagid => tags.find(t => t.id == tagid)),
                    custom_fields: doc.custom_fields.map(field => ({ ...field, field: customFields.find(t => t.id == field.field) })),
                }))
            }
            send({ ...msg, payload: documents })

        })
    }
    RED.nodes.registerType("paperless-ngx-get-documents", GetDocumentsNode);
}