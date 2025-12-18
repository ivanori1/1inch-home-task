import { APIRequestContext, APIResponse } from "@playwright/test";
import { HttpMethodEnum } from "../enums/http_method_enum";
import { TestContext } from "../../testContext";

export interface HttpClientOptions {
    headers?: { [key: string]: string };
    queryParameters?: { [key: string]: string };
    body?: unknown;
}

export class HttpClient {
    protected context: TestContext;
    protected path: string;
    protected method: HttpMethodEnum;
    protected options: HttpClientOptions;
    protected apiRequestContext: APIRequestContext;

    constructor(
        context: TestContext,
        apiRequestContext: APIRequestContext,
        path: string,
        method: HttpMethodEnum,
        options: HttpClientOptions = {}
    ) {
        this.context = context;
        this.apiRequestContext = apiRequestContext;
        this.path = path;
        this.method = method;
        this.options = options;
    }

    protected buildUrl(baseUrl: string): string {
        let url = `${baseUrl}${this.path}`;

        if (this.options.queryParameters) {
            const queryString = Object.entries(this.options.queryParameters)
                .filter(([_, value]) => value !== undefined && value !== null)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join("&");

            if (queryString) {
                url += `?${queryString}`;
            }
        }

        return url;
    }

    public async request(baseUrl: string): Promise<APIResponse> {
        const url = this.buildUrl(baseUrl);

        this.context.logger.info(`Making ${this.method} request to: ${url}`);

        const headers: Record<string, string> = { ...(this.options.headers || {}) };

        if (this.options.body && this.method !== HttpMethodEnum.GET) {
            if (!headers["Content-Type"]) {
                headers["Content-Type"] = "application/json";
            }
        }

        try {
            let response: APIResponse;
            
            switch (this.method) {
                case HttpMethodEnum.GET:
                    response = await this.apiRequestContext.get(url, { headers });
                    break;
                case HttpMethodEnum.POST:
                    response = await this.apiRequestContext.post(url, {
                        headers,
                        data: this.options.body
                    });
                    break;
                case HttpMethodEnum.PUT:
                    response = await this.apiRequestContext.put(url, {
                        headers,
                        data: this.options.body
                    });
                    break;
                case HttpMethodEnum.DELETE:
                    response = await this.apiRequestContext.delete(url, { headers });
                    break;
                case HttpMethodEnum.PATCH:
                    response = await this.apiRequestContext.patch(url, {
                        headers,
                        data: this.options.body
                    });
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${this.method}`);
            }

            this.context.lastResponse = response;
            
            // Parse response data
            const contentType = response.headers()["content-type"] || "";
            if (contentType.includes("application/json")) {
                this.context.responseData = await response.json();
            } else {
                this.context.responseData = await response.text();
            }

            this.context.logger.info(`Response status: ${response.status()} ${response.statusText()}`);

            return response;
        } catch (error) {
            this.context.logger.error(`Request failed: ${error}`);
            throw error;
        }
    }
}

