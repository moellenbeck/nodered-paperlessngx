

module.exports = class PaperlessNgxApi {
    constructor(baseurl, apiAuthToken) {
        this._baseUrl = baseurl;
        this._authToken = apiAuthToken;
    }


    async request(method, endpoint, params) {
        let url = `${this._baseUrl}${endpoint}`
        if (params) {
            url += `?${params}`
        }


        const response = await fetch(url, {
            method: method,
            credentials: 'include',
            headers: {
                Authorization: 'Token ' + this._authToken,
                Accept: 'application/json'
            },
        })
        const result = await response.json()
        return result?.results
    }

    async getDocuments(query) {
        const params = new URLSearchParams({
            query: query,
            page_size: 100000
        })
        return await this.request('GET', '/api/documents/', params)
    }

    async getTags() {
        const params = new URLSearchParams({
            page_size: 100000
        })
        return await this.request('GET', '/api/tags/', params)
    }

    async getCorrespondents() {
        const params = new URLSearchParams({
            page_size: 100000
        })
        return await this.request('GET', '/api/correspondents/', params)
    }

    async getDocTypes() {
        const params = new URLSearchParams({
            page_size: 100000
        })
        return await this.request('GET', '/api/document_types/', params)
    }

    async getCustomFields() {
        const params = new URLSearchParams({
            page_size: 100000
        })
        return await this.request('GET', '/api/custom_fields/', params)
    }

}