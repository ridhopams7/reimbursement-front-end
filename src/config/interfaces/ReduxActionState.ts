export interface State {
  fetch: boolean,
  data: any,
  res: any,
  err: any,
}

export interface Action {
  type: string,
  data: any,
}
