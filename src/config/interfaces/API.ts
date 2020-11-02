interface Content {
  api: string,
  isPublicApi: boolean,
}

interface API {
  [key: string]: Content,
}

export default API;