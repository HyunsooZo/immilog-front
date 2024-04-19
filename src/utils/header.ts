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

export { applicationJson, applicationJsonWithToken }
