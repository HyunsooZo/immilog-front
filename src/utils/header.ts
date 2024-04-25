const applicationJson = {
  headers: {
    contentType: 'application/json'
  }
}

const applicationJsonWithToken = (accessToken: string | null | undefined) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken ? accessToken : ''}`
  }
})

const multipartFormData = {
  headers: {
    contentType: 'multipart/form-data'
  }
}

const webSocketURL = 'https://api.ko-meet-back.com'

export { applicationJson, applicationJsonWithToken, multipartFormData, webSocketURL }
