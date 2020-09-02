import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { mergeOptions } from './utils';
export const COOKIE_OPTIONS = new InjectionToken('COOKIE_OPTIONS');
let CookieOptionsProvider = class CookieOptionsProvider {
    constructor(options = {}, _injector) {
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
    get options() {
        return this._options;
    }
};
CookieOptionsProvider.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [COOKIE_OPTIONS,] }] },
    { type: Injector }
];
CookieOptionsProvider = __decorate([
    Injectable(),
    __param(0, Inject(COOKIE_OPTIONS)),
    __metadata("design:paramtypes", [Object, Injector])
], CookieOptionsProvider);
export { CookieOptionsProvider };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLW9wdGlvbnMtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ29ybml2L25neC11bml2ZXJzYWwvIiwic291cmNlcyI6WyJjb29raWUvY29va2llLW9wdGlvbnMtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFdkMsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLElBQUksY0FBYyxDQUFnQixnQkFBZ0IsQ0FBQyxDQUFDO0FBR2xGLElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBS2hDLFlBQW9DLFVBQXlCLEVBQUUsRUFDM0MsU0FBbUI7UUFBbkIsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNyQyxJQUFJLENBQUMsY0FBYyxHQUFHO1lBQ3BCLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDO1lBQzVDLE1BQU0sRUFBRSxJQUFJO1lBQ1osT0FBTyxFQUFFLElBQUk7WUFDYixNQUFNLEVBQUUsS0FBSztZQUNiLFFBQVEsRUFBRSxLQUFLO1NBQ2hCLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztDQUNGLENBQUE7OzRDQWZjLE1BQU0sU0FBQyxjQUFjO1lBQ0gsUUFBUTs7QUFONUIscUJBQXFCO0lBRGpDLFVBQVUsRUFBRTtJQU1FLFdBQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBOzZDQUNKLFFBQVE7R0FONUIscUJBQXFCLENBb0JqQztTQXBCWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQVBQX0JBU0VfSFJFRiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IENvb2tpZU9wdGlvbnMgfSBmcm9tICcuL2Nvb2tpZS1vcHRpb25zLm1vZGVsJztcbmltcG9ydCB7IG1lcmdlT3B0aW9ucyB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgQ09PS0lFX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48Q29va2llT3B0aW9ucz4oJ0NPT0tJRV9PUFRJT05TJyk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb29raWVPcHRpb25zUHJvdmlkZXIge1xuXG4gIHByaXZhdGUgZGVmYXVsdE9wdGlvbnM6IENvb2tpZU9wdGlvbnM7XG4gIHByaXZhdGUgX29wdGlvbnM6IENvb2tpZU9wdGlvbnM7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChDT09LSUVfT1BUSU9OUykgb3B0aW9uczogQ29va2llT3B0aW9ucyA9IHt9LFxuICAgICAgICAgICAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgcGF0aDogdGhpcy5faW5qZWN0b3IuZ2V0KEFQUF9CQVNFX0hSRUYsICcvJyksXG4gICAgICBkb21haW46IG51bGwsXG4gICAgICBleHBpcmVzOiBudWxsLFxuICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIGh0dHBPbmx5OiBmYWxzZVxuICAgIH07XG4gICAgdGhpcy5fb3B0aW9ucyA9IG1lcmdlT3B0aW9ucyh0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldCBvcHRpb25zKCk6IENvb2tpZU9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICB9XG59XG4iXX0=