import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CookieOptionsProvider, COOKIE_OPTIONS } from './cookie-options-provider';
import { CookieService } from './cookie.service';
import { cookieServiceFactory } from './cookie.factory';
var CookieModule = /** @class */ (function () {
    function CookieModule() {
    }
    CookieModule_1 = CookieModule;
    /**
     * Use this method in your root module to provide the CookieService
     */
    CookieModule.forRoot = function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: CookieModule_1,
            providers: [
                { provide: COOKIE_OPTIONS, useValue: options },
                { provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider] }
            ]
        };
    };
    /**
     * Use this method in your other (non root) modules to import the directive/pipe
     */
    CookieModule.forChild = function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: CookieModule_1,
            providers: [
                { provide: COOKIE_OPTIONS, useValue: options },
                { provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider] }
            ]
        };
    };
    var CookieModule_1;
    CookieModule = CookieModule_1 = __decorate([
        NgModule({
            providers: [CookieOptionsProvider]
        })
    ], CookieModule);
    return CookieModule;
}());
export { CookieModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bnb3JuaXYvbmd4LXVuaXZlcnNhbC8iLCJzb3VyY2VzIjpbImNvb2tpZS9jb29raWUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWpELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBS3hEO0lBQUE7SUEwQkEsQ0FBQztxQkExQlksWUFBWTtJQUN2Qjs7T0FFRztJQUNJLG9CQUFPLEdBQWQsVUFBZSxPQUEyQjtRQUEzQix3QkFBQSxFQUFBLFlBQTJCO1FBQ3hDLE9BQU87WUFDTCxRQUFRLEVBQUUsY0FBWTtZQUN0QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7Z0JBQzVDLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLENBQUMscUJBQXFCLENBQUMsRUFBQzthQUMxRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDSSxxQkFBUSxHQUFmLFVBQWdCLE9BQTJCO1FBQTNCLHdCQUFBLEVBQUEsWUFBMkI7UUFDekMsT0FBTztZQUNMLFFBQVEsRUFBRSxjQUFZO1lBQ3RCLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztnQkFDNUMsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFDO2FBQzFGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O0lBekJVLFlBQVk7UUFIeEIsUUFBUSxDQUFDO1lBQ1IsU0FBUyxFQUFFLENBQUMscUJBQXFCLENBQUM7U0FDbkMsQ0FBQztPQUNXLFlBQVksQ0EwQnhCO0lBQUQsbUJBQUM7Q0FBQSxBQTFCRCxJQTBCQztTQTFCWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ29va2llT3B0aW9uc1Byb3ZpZGVyLCBDT09LSUVfT1BUSU9OUyB9IGZyb20gJy4vY29va2llLW9wdGlvbnMtcHJvdmlkZXInO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJy4vY29va2llLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29va2llT3B0aW9ucyB9IGZyb20gJy4vY29va2llLW9wdGlvbnMubW9kZWwnO1xuaW1wb3J0IHsgY29va2llU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2Nvb2tpZS5mYWN0b3J5JztcblxuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbQ29va2llT3B0aW9uc1Byb3ZpZGVyXVxufSlcbmV4cG9ydCBjbGFzcyBDb29raWVNb2R1bGUge1xuICAvKipcbiAgICogVXNlIHRoaXMgbWV0aG9kIGluIHlvdXIgcm9vdCBtb2R1bGUgdG8gcHJvdmlkZSB0aGUgQ29va2llU2VydmljZVxuICAgKi9cbiAgc3RhdGljIGZvclJvb3Qob3B0aW9uczogQ29va2llT3B0aW9ucyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxDb29raWVNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IENvb2tpZU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogQ09PS0lFX09QVElPTlMsIHVzZVZhbHVlOiBvcHRpb25zfSxcbiAgICAgICAge3Byb3ZpZGU6IENvb2tpZVNlcnZpY2UsIHVzZUZhY3Rvcnk6IGNvb2tpZVNlcnZpY2VGYWN0b3J5LCBkZXBzOiBbQ29va2llT3B0aW9uc1Byb3ZpZGVyXX1cbiAgICAgIF1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIG1ldGhvZCBpbiB5b3VyIG90aGVyIChub24gcm9vdCkgbW9kdWxlcyB0byBpbXBvcnQgdGhlIGRpcmVjdGl2ZS9waXBlXG4gICAqL1xuICBzdGF0aWMgZm9yQ2hpbGQob3B0aW9uczogQ29va2llT3B0aW9ucyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxDb29raWVNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IENvb2tpZU1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogQ09PS0lFX09QVElPTlMsIHVzZVZhbHVlOiBvcHRpb25zfSxcbiAgICAgICAge3Byb3ZpZGU6IENvb2tpZVNlcnZpY2UsIHVzZUZhY3Rvcnk6IGNvb2tpZVNlcnZpY2VGYWN0b3J5LCBkZXBzOiBbQ29va2llT3B0aW9uc1Byb3ZpZGVyXX1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=