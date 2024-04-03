export interface IApiResponse {
  status: number;
  message: string;
}

export interface IApiPostList extends IApiResponse {
  data: IPost[];
}
