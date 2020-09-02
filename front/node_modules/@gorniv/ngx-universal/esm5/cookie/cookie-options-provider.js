import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { mergeOptions } from './utils';
export var COOKIE_OPTIONS = new InjectionToken('COOKIE_OPTIONS');
var CookieOptionsProvider = /** @class */ (function () {
    function CookieOptionsProvider(options, _injector) {
        if (options === void 0) { options = {}; }
        this._injector = _injector;
        this.defaultOptions = {
            path: this._injector.get(APP_BASE_HREF, '/'),
            domain: null,
            expires: null,
            secure: false,
            httpOnly: false
        };
        this._options = mergeOptions(this.defaultOptions, options);
    }
    Object.defineProperty(CookieOptionsProvider.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    CookieOptionsProvider.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [COOKIE_OPTIONS,] }] },
        { type: Injector }
    ]; };
    CookieOptionsProvider = __decorate([
        Injectable(),
        __param(0, Inject(COOKIE_OPTIONS)),
        __metadata("design:paramtypes", [Object, Injector])
    ], CookieOptionsProvider);
    return CookieOptionsProvider;
}());
export { CookieOptionsProvider };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLW9wdGlvbnMtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ29ybml2L25neC11bml2ZXJzYWwvIiwic291cmNlcyI6WyJjb29raWUvY29va2llLW9wdGlvbnMtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFdkMsTUFBTSxDQUFDLElBQU0sY0FBYyxHQUFHLElBQUksY0FBYyxDQUFnQixnQkFBZ0IsQ0FBQyxDQUFDO0FBR2xGO0lBS0UsK0JBQW9DLE9BQTJCLEVBQzNDLFNBQW1CO1FBREgsd0JBQUEsRUFBQSxZQUEyQjtRQUMzQyxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ3JDLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUM7WUFDNUMsTUFBTSxFQUFFLElBQUk7WUFDWixPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxLQUFLO1lBQ2IsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELHNCQUFJLDBDQUFPO2FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzs7O09BQUE7O2dEQWRZLE1BQU0sU0FBQyxjQUFjO2dCQUNILFFBQVE7O0lBTjVCLHFCQUFxQjtRQURqQyxVQUFVLEVBQUU7UUFNRSxXQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtpREFDSixRQUFRO09BTjVCLHFCQUFxQixDQW9CakM7SUFBRCw0QkFBQztDQUFBLEFBcEJELElBb0JDO1NBcEJZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBUFBfQkFTRV9IUkVGIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgQ29va2llT3B0aW9ucyB9IGZyb20gJy4vY29va2llLW9wdGlvbnMubW9kZWwnO1xuaW1wb3J0IHsgbWVyZ2VPcHRpb25zIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBDT09LSUVfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxDb29raWVPcHRpb25zPignQ09PS0lFX09QVElPTlMnKTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvb2tpZU9wdGlvbnNQcm92aWRlciB7XG5cbiAgcHJpdmF0ZSBkZWZhdWx0T3B0aW9uczogQ29va2llT3B0aW9ucztcbiAgcHJpdmF0ZSBfb3B0aW9uczogQ29va2llT3B0aW9ucztcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KENPT0tJRV9PUFRJT05TKSBvcHRpb25zOiBDb29raWVPcHRpb25zID0ge30sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBwYXRoOiB0aGlzLl9pbmplY3Rvci5nZXQoQVBQX0JBU0VfSFJFRiwgJy8nKSxcbiAgICAgIGRvbWFpbjogbnVsbCxcbiAgICAgIGV4cGlyZXM6IG51bGwsXG4gICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgaHR0cE9ubHk6IGZhbHNlXG4gICAgfTtcbiAgICB0aGlzLl9vcHRpb25zID0gbWVyZ2VPcHRpb25zKHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0IG9wdGlvbnMoKTogQ29va2llT3B0aW9ucyB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gIH1cbn1cbiJdfQ==