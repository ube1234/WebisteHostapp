// Simple API client factory to handle base URL, headers, and JSON requests
// Usage:
//   const api = createApiClient({ baseUrl: '', defaultHeaders: {} })
//   api.get('/Employee')
//   api.post('/Employee', { name: 'John' })

export function createApiClient({ baseUrl = '', defaultHeaders = {} } = {}) {
  const buildUrl = (path) => {
    if (!path.startsWith('http')) {
      return `${baseUrl}${path}`
    }
    return path
  }

  const handleResponse = async (res) => {
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`)
      err.status = res.status
      err.data = data
      throw err
    }
    return data
  }

  const request = async (path, { method = 'GET', headers, body } = {}) => {
    const finalHeaders = { 'Accept': 'application/json, text/plain, */*', ...defaultHeaders, ...headers }
    const isJsonBody = body && typeof body === 'object' && !(body instanceof FormData)
    const init = {
      method,
      headers: isJsonBody ? { 'Content-Type': 'application/json', ...finalHeaders } : finalHeaders,
      body: isJsonBody ? JSON.stringify(body) : body,
    }
    return fetch(buildUrl(path), init).then(handleResponse)
  }

  return {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
    put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
    patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  }
}

// Preconfigured API client for WebsiteHub backend
export const websiteHubApi = createApiClient({
  baseUrl: 'https://websitehubbackend-abb4hpfwb9fygbbw.southindia-01.azurewebsites.net',
})
