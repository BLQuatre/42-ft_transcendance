import { AxiosResponse } from "axios";

export function isAxiosResponse(res: AxiosResponse | void): res is AxiosResponse{
	return res !== undefined
}