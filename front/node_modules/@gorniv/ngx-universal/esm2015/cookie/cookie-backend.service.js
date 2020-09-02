import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';
import { NgxRequest, NgxResponse } from './tokens';
let CookieBackendService = class CookieBackendService extends CookieService {
    constructor(request, response, _optionsProvider) {
        super(_optionsProvider);
        this.request = request;
        this.response = response;
    }
    get cookieString() {
        return this.request.cookie || this.request.headers['cookie'] || '';
    }
    set cookieString(val) {
        this.request.cookie = val;
        this.response.cookie = val;
    }
    put(key, value, options = {}) {
        let findKey = false;
        let newCookie = Object.keys(this.getAll())
            // tslint:disable-next-line: no-shadowed-variable
            .map((keyItem) => {
            if (keyItem === key) {
                findKey = true;
                return `${key}=${value}`;
            }
            return `${keyItem}=${this.get(keyItem)}`;
        })
            .join('; ');
        if (!findKey) {
            newCookie += `; ${key}=${value}`;
        }
        this.request.headers.cookie = newCookie;
        // not sure
        this.cookieString = newCookie;
    }
    remove(key, options) {
        const newCookie = Object.keys(this.getAll())
            // tslint:disable-next-line: no-shadowed-variable
            .map((keyItem) => {
            if (keyItem === key) {
                return '';
            }
            return `${keyItem}=${this.get(keyItem)}`;
        })
            .join('; ');
        this.request.headers.cookie = newCookie;
        // not sure
        this.cookieString = newCookie;
    }
};
CookieBackendService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [NgxRequest,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [NgxResponse,] }] },
    { type: CookieOptionsProvider }
];
CookieBackendService = __decorate([
    Injectable(),
    __param(0, Inject(NgxRequest)),
    __param(1, Inject(NgxResponse)),
    __metadata("design:paramtypes", [Object, Object, CookieOptionsProvider])
], CookieBackendService);
export { CookieBackendService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLWJhY2tlbmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bnb3JuaXYvbmd4LXVuaXZlcnNhbC8iLCJzb3VyY2VzIjpbImNvb2tpZS9jb29raWUtYmFja2VuZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHbkQsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBcUIsU0FBUSxhQUFhO0lBQ3JELFlBQzhCLE9BQVksRUFDWCxRQUFhLEVBQzFDLGdCQUF1QztRQUV2QyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUpJLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFDWCxhQUFRLEdBQVIsUUFBUSxDQUFLO0lBSTVDLENBQUM7SUFFRCxJQUFjLFlBQVk7UUFDeEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckUsQ0FBQztJQUVELElBQWMsWUFBWSxDQUFDLEdBQVc7UUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUM3QixDQUFDO0lBRUQsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsVUFBeUIsRUFBRTtRQUN6RCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEMsaURBQWlEO2FBQ2hELEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2YsSUFBSSxPQUFPLEtBQUssR0FBRyxFQUFFO2dCQUNuQixPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNmLE9BQU8sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7YUFDMUI7WUFDRCxPQUFPLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUMzQyxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osU0FBUyxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1NBQ2xDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUN4QyxXQUFXO1FBQ1gsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXLEVBQUUsT0FBdUI7UUFDekMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDMUMsaURBQWlEO2FBQ2hELEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2YsSUFBSSxPQUFPLEtBQUssR0FBRyxFQUFFO2dCQUNuQixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBQ0QsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDM0MsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUN4QyxXQUFXO1FBQ1gsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztDQUNGLENBQUE7OzRDQWxESSxNQUFNLFNBQUMsVUFBVTs0Q0FDakIsTUFBTSxTQUFDLFdBQVc7WUFDRCxxQkFBcUI7O0FBSjlCLG9CQUFvQjtJQURoQyxVQUFVLEVBQUU7SUFHUixXQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNsQixXQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTtxREFDRixxQkFBcUI7R0FKOUIsb0JBQW9CLENBb0RoQztTQXBEWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJy4vY29va2llLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29va2llT3B0aW9uc1Byb3ZpZGVyIH0gZnJvbSAnLi9jb29raWUtb3B0aW9ucy1wcm92aWRlcic7XG5pbXBvcnQgeyBDb29raWVPcHRpb25zIH0gZnJvbSAnLi9jb29raWUtb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBOZ3hSZXF1ZXN0LCBOZ3hSZXNwb25zZSB9IGZyb20gJy4vdG9rZW5zJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvb2tpZUJhY2tlbmRTZXJ2aWNlIGV4dGVuZHMgQ29va2llU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTmd4UmVxdWVzdCkgcHJpdmF0ZSByZXF1ZXN0OiBhbnksXG4gICAgQEluamVjdChOZ3hSZXNwb25zZSkgcHJpdmF0ZSByZXNwb25zZTogYW55LFxuICAgIF9vcHRpb25zUHJvdmlkZXI6IENvb2tpZU9wdGlvbnNQcm92aWRlcixcbiAgKSB7XG4gICAgc3VwZXIoX29wdGlvbnNQcm92aWRlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGNvb2tpZVN0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QuY29va2llIHx8IHRoaXMucmVxdWVzdC5oZWFkZXJzWydjb29raWUnXSB8fCAnJztcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXQgY29va2llU3RyaW5nKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5yZXF1ZXN0LmNvb2tpZSA9IHZhbDtcbiAgICB0aGlzLnJlc3BvbnNlLmNvb2tpZSA9IHZhbDtcbiAgfVxuXG4gIHB1dChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgb3B0aW9uczogQ29va2llT3B0aW9ucyA9IHt9KTogdm9pZCB7XG4gICAgbGV0IGZpbmRLZXkgPSBmYWxzZTtcbiAgICBsZXQgbmV3Q29va2llID0gT2JqZWN0LmtleXModGhpcy5nZXRBbGwoKSlcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcbiAgICAgIC5tYXAoKGtleUl0ZW0pID0+IHtcbiAgICAgICAgaWYgKGtleUl0ZW0gPT09IGtleSkge1xuICAgICAgICAgIGZpbmRLZXkgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBgJHtrZXl9PSR7dmFsdWV9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYCR7a2V5SXRlbX09JHt0aGlzLmdldChrZXlJdGVtKX1gO1xuICAgICAgfSlcbiAgICAgIC5qb2luKCc7ICcpO1xuICAgIGlmICghZmluZEtleSkge1xuICAgICAgbmV3Q29va2llICs9IGA7ICR7a2V5fT0ke3ZhbHVlfWA7XG4gICAgfVxuICAgIHRoaXMucmVxdWVzdC5oZWFkZXJzLmNvb2tpZSA9IG5ld0Nvb2tpZTtcbiAgICAvLyBub3Qgc3VyZVxuICAgIHRoaXMuY29va2llU3RyaW5nID0gbmV3Q29va2llO1xuICB9XG5cbiAgcmVtb3ZlKGtleTogc3RyaW5nLCBvcHRpb25zPzogQ29va2llT3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnN0IG5ld0Nvb2tpZSA9IE9iamVjdC5rZXlzKHRoaXMuZ2V0QWxsKCkpXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgICAubWFwKChrZXlJdGVtKSA9PiB7XG4gICAgICAgIGlmIChrZXlJdGVtID09PSBrZXkpIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGAke2tleUl0ZW19PSR7dGhpcy5nZXQoa2V5SXRlbSl9YDtcbiAgICAgIH0pXG4gICAgICAuam9pbignOyAnKTtcbiAgICB0aGlzLnJlcXVlc3QuaGVhZGVycy5jb29raWUgPSBuZXdDb29raWU7XG4gICAgLy8gbm90IHN1cmVcbiAgICB0aGlzLmNvb2tpZVN0cmluZyA9IG5ld0Nvb2tpZTtcbiAgfVxufVxuIl19