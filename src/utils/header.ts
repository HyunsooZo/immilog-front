const applicationJson = {
  headers: {
    contentType: 'application/json'
  }
}

const applicationJsonWithToken = {
  headers: {
    contentType: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
}

const multipartFormData = {
  headers: {
    contentType: 'multipart/form-data'
  }
}

const webSocketURL = 'https://api.ko-meet-back.com'

export { applicationJson, applicationJsonWithToken, multipartFormData, webSocketURL }
