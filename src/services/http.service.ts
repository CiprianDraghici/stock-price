import {toast} from "react-toastify";

export interface IHttpResponse<T> extends Response {
    parsedBody?: T;
}

export class HttpService {
    private static instance: HttpService;

    public static getInstance(): HttpService {
        if (!HttpService.instance) {
            HttpService.instance = new HttpService();
        }

        return HttpService.instance;
    }

    public get baseUrl() {
        return "https://finnhub.io/api/v1";
    }

    public get = async <T>(url: string): Promise<IHttpResponse<T>> => {
        return await this.http<T>(new Request(this.resolveUrl(url))) as IHttpResponse<T>;
    };

    public resolveUrl(url: string) {
        return encodeURI(url);
    }

    public handleRejection<T>(response: IHttpResponse<T>) {
        let message =  "Unknown issue";
        switch (response.status) {
            case 401: {
                message = "Unauthorized"
                toast.error(message);
                break;
            }
            case 404: {
                message = "Not Found";
                toast.error(message);
                break;
            }
            case 503: {
                message = "Service Unavailable";
                toast.error(message);
                break;
            }
            case 504: {
                message = "Timeout";
                toast.error(message);
                break;
            }
            default: {
                message = "Unknown issue";
                toast.error(message);
            }
        }

        throw new Error(message);
    }

    private http = async <T>(request: RequestInfo): Promise<IHttpResponse<T> | void> => {
        return new Promise(async (resolve, reject) => {
            try {
                const response: IHttpResponse<T> = await fetch(request);

                if (response.ok) {
                    response.parsedBody = await this.parseJSON(response);
                    return resolve(response);
                } else {
                    return reject(response);
                }
            } catch (err) {
                return reject(err);
            }
        });
    };

    private parseJSON(response: any) {
        return response.text().then((text: string) => text ? JSON.parse(text) : {});
    }
}