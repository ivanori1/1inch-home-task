import { World } from "@cucumber/cucumber";
import { CustomLogger } from "./core/utils/logger";
import { APIResponse, APIRequestContext } from "@playwright/test";
import { SoftAssert } from "./core/utils/softAssert";

export class TestContext extends World {
    public softAssert: SoftAssert;
    public logger: CustomLogger;
    public userServiceBaseUrl: string;
    public orderServiceBaseUrl: string;
    public lastResponse: APIResponse | undefined;
    public responseData: unknown;
    public apiRequestContext?: APIRequestContext;
    private notes: Map<string, unknown> = new Map();

    constructor(options: ConstructorParameters<typeof World>[0]) {
        super(options);
        this.logger = new CustomLogger();
        this.softAssert = new SoftAssert();
        
        // Service base URLs from environment variables or defaults
        this.userServiceBaseUrl = process.env.USER_SERVICE_URL || "http://localhost:3001";
        this.orderServiceBaseUrl = process.env.ORDER_SERVICE_URL || "http://localhost:3002";
        
        // Ensure URLs don't end with /
        this.userServiceBaseUrl = this.userServiceBaseUrl.endsWith('/') 
            ? this.userServiceBaseUrl.slice(0, -1) 
            : this.userServiceBaseUrl;
        this.orderServiceBaseUrl = this.orderServiceBaseUrl.endsWith('/') 
            ? this.orderServiceBaseUrl.slice(0, -1) 
            : this.orderServiceBaseUrl;
    }

    public setNote(key: string, value: unknown): void {
        this.notes.set(key, value);
    }

    public getNote(key: string): unknown {
        return this.notes.get(key);
    }
}

