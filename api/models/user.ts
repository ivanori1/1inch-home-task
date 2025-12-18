import { HttpClient, HttpClientOptions } from "../../core/clients/http_client";
import { HttpMethodEnum } from "../../core/enums/http_method_enum";
import { TestContext } from "../../testContext";
import { APIRequestContext } from "@playwright/test";

export class UserService {
    private context: TestContext;
    private apiRequestContext: APIRequestContext;
    private baseUrl: string;

    constructor(context: TestContext, apiRequestContext: APIRequestContext, baseUrl: string) {
        this.context = context;
        this.apiRequestContext = apiRequestContext;
        this.baseUrl = baseUrl;
    }

    public async getUserById(userId: number): Promise<void> {
        const options: HttpClientOptions = {};
        const client = new HttpClient(
            this.context,
            this.apiRequestContext,
            `/users/${userId}`,
            HttpMethodEnum.GET,
            options
        );

        await client.request(this.baseUrl);
    }
}


