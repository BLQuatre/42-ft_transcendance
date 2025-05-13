import { AxiosResponse } from "axios";

export function isAxiosResponse(res: AxiosResponse | undefined): res is AxiosResponse{
	return res !== undefined
}