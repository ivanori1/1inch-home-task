import { HttpClient, HttpClientOptions } from "../../core/clients/http_client";
import { HttpMethodEnum } from "../../core/enums/http_method_enum";
import { TestContext } from "../../testContext";
import { APIRequestContext } from "@playwright/test";
import { CreateOrderRequest } from "../interfaces/order";

export class OrderService {
    private context: TestContext;
    private apiRequestContext: APIRequestContext;
    private baseUrl: string;

    constructor(context: TestContext, apiRequestContext: APIRequestContext, baseUrl: string) {
        this.context = context;
        this.apiRequestContext = apiRequestContext;
        this.baseUrl = baseUrl;
    }

    public async getActiveOrdersByUserId(userId: number): Promise<void> {
        const options: HttpClientOptions = {
            queryParameters: {
                userId: userId.toString()
            }
        };
        const client = new HttpClient(
            this.context,
            this.apiRequestContext,
            "/orders",
            HttpMethodEnum.GET,
            options
        );

        await client.request(this.baseUrl);
    }

    public async createOrder(userId: number, amount: number): Promise<void> {
        const requestBody: CreateOrderRequest = {
            userId: userId,
            amount: amount
        };

        const options: HttpClientOptions = {
            body: requestBody
        };
        const client = new HttpClient(
            this.context,
            this.apiRequestContext,
            "/orders",
            HttpMethodEnum.POST,
            options
        );

        await client.request(this.baseUrl);
    }
}


