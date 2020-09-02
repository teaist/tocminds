import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';
import { CookieOptions } from './cookie-options.model';
export declare class CookieBackendService extends CookieService {
    private request;
    private response;
    constructor(request: any, response: any, _optionsProvider: CookieOptionsProvider);
    protected get cookieString(): string;
    protected set cookieString(val: string);
    put(key: string, value: string, options?: CookieOptions): void;
    remove(key: string, options?: CookieOptions): void;
}
