const applicationJson = {
  headers: {
    contentType: 'application/json'
  }
}
const applicationJsonWithToken = (accessToken: string | null | undefined) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken ? accessToken.toString() : ''}`
  }
})

const multipartFormData = {
  headers: {
    contentType: 'multipart/form-data'
  }
}

const multipartFormDataWithToken = (accessToken: string | null | undefined) => ({
  headers: {
    contentType: 'multipart/form-data',
    Authorization: `Bearer ${accessToken ? accessToken.toString() : ''}`
  }
})

const webSocketURL = 'https://api.ko-meet-back.com'

export {
  applicationJson,
  applicationJsonWithToken,
  multipartFormData,
  multipartFormDataWithToken,
  webSocketURL
}
