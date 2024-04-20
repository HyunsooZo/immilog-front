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

export { applicationJson, applicationJsonWithToken, multipartFormData }
