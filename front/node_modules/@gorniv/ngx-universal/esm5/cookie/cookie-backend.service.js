import { __decorate, __extends, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';
import { NgxRequest, NgxResponse } from './tokens';
var CookieBackendService = /** @class */ (function (_super) {
    __extends(CookieBackendService, _super);
    function CookieBackendService(request, response, _optionsProvider) {
        var _this = _super.call(this, _optionsProvider) || this;
        _this.request = request;
        _this.response = response;
        return _this;
    }
    Object.defineProperty(CookieBackendService.prototype, "cookieString", {
        get: function () {
            return this.request.cookie || this.request.headers['cookie'] || '';
        },
        set: function (val) {
            this.request.cookie = val;
            this.response.cookie = val;
        },
        enumerable: true,
        configurable: true
    });
    CookieBackendService.prototype.put = function (key, value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var findKey = false;
        var newCookie = Object.keys(this.getAll())
            // tslint:disable-next-line: no-shadowed-variable
            .map(function (keyItem) {
            if (keyItem === key) {
                findKey = true;
                return key + "=" + value;
            }
            return keyItem + "=" + _this.get(keyItem);
        })
            .join('; ');
        if (!findKey) {
            newCookie += "; " + key + "=" + value;
        }
        this.request.headers.cookie = newCookie;
        // not sure
        this.cookieString = newCookie;
    };
    CookieBackendService.prototype.remove = function (key, options) {
        var _this = this;
        var newCookie = Object.keys(this.getAll())
            // tslint:disable-next-line: no-shadowed-variable
            .map(function (keyItem) {
            if (keyItem === key) {
                return '';
            }
            return keyItem + "=" + _this.get(keyItem);
        })
            .join('; ');
        this.request.headers.cookie = newCookie;
        // not sure
        this.cookieString = newCookie;
    };
    CookieBackendService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [NgxRequest,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [NgxResponse,] }] },
        { type: CookieOptionsProvider }
    ]; };
    CookieBackendService = __decorate([
        Injectable(),
        __param(0, Inject(NgxRequest)),
        __param(1, Inject(NgxResponse)),
        __metadata("design:paramtypes", [Object, Object, CookieOptionsProvider])
    ], CookieBackendService);
    return CookieBackendService;
}(CookieService));
export { CookieBackendService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29va2llLWJhY2tlbmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bnb3JuaXYvbmd4LXVuaXZlcnNhbC8iLCJzb3VyY2VzIjpbImNvb2tpZS9jb29raWUtYmFja2VuZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHbkQ7SUFBMEMsd0NBQWE7SUFDckQsOEJBQzhCLE9BQVksRUFDWCxRQUFhLEVBQzFDLGdCQUF1QztRQUh6QyxZQUtFLGtCQUFNLGdCQUFnQixDQUFDLFNBQ3hCO1FBTDZCLGFBQU8sR0FBUCxPQUFPLENBQUs7UUFDWCxjQUFRLEdBQVIsUUFBUSxDQUFLOztJQUk1QyxDQUFDO0lBRUQsc0JBQWMsOENBQVk7YUFBMUI7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyRSxDQUFDO2FBRUQsVUFBMkIsR0FBVztZQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQzdCLENBQUM7OztPQUxBO0lBT0Qsa0NBQUcsR0FBSCxVQUFJLEdBQVcsRUFBRSxLQUFhLEVBQUUsT0FBMkI7UUFBM0QsaUJBa0JDO1FBbEIrQix3QkFBQSxFQUFBLFlBQTJCO1FBQ3pELElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN4QyxpREFBaUQ7YUFDaEQsR0FBRyxDQUFDLFVBQUMsT0FBTztZQUNYLElBQUksT0FBTyxLQUFLLEdBQUcsRUFBRTtnQkFDbkIsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDZixPQUFVLEdBQUcsU0FBSSxLQUFPLENBQUM7YUFDMUI7WUFDRCxPQUFVLE9BQU8sU0FBSSxLQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBRyxDQUFDO1FBQzNDLENBQUMsQ0FBQzthQUNELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixTQUFTLElBQUksT0FBSyxHQUFHLFNBQUksS0FBTyxDQUFDO1NBQ2xDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUN4QyxXQUFXO1FBQ1gsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQztJQUVELHFDQUFNLEdBQU4sVUFBTyxHQUFXLEVBQUUsT0FBdUI7UUFBM0MsaUJBYUM7UUFaQyxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMxQyxpREFBaUQ7YUFDaEQsR0FBRyxDQUFDLFVBQUMsT0FBTztZQUNYLElBQUksT0FBTyxLQUFLLEdBQUcsRUFBRTtnQkFDbkIsT0FBTyxFQUFFLENBQUM7YUFDWDtZQUNELE9BQVUsT0FBTyxTQUFJLEtBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFHLENBQUM7UUFDM0MsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUN4QyxXQUFXO1FBQ1gsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7SUFDaEMsQ0FBQzs7Z0RBakRFLE1BQU0sU0FBQyxVQUFVO2dEQUNqQixNQUFNLFNBQUMsV0FBVztnQkFDRCxxQkFBcUI7O0lBSjlCLG9CQUFvQjtRQURoQyxVQUFVLEVBQUU7UUFHUixXQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNsQixXQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTt5REFDRixxQkFBcUI7T0FKOUIsb0JBQW9CLENBb0RoQztJQUFELDJCQUFDO0NBQUEsQUFwREQsQ0FBMEMsYUFBYSxHQW9EdEQ7U0FwRFksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENvb2tpZVNlcnZpY2UgfSBmcm9tICcuL2Nvb2tpZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvb2tpZU9wdGlvbnNQcm92aWRlciB9IGZyb20gJy4vY29va2llLW9wdGlvbnMtcHJvdmlkZXInO1xuaW1wb3J0IHsgQ29va2llT3B0aW9ucyB9IGZyb20gJy4vY29va2llLW9wdGlvbnMubW9kZWwnO1xuaW1wb3J0IHsgTmd4UmVxdWVzdCwgTmd4UmVzcG9uc2UgfSBmcm9tICcuL3Rva2Vucyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb29raWVCYWNrZW5kU2VydmljZSBleHRlbmRzIENvb2tpZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE5neFJlcXVlc3QpIHByaXZhdGUgcmVxdWVzdDogYW55LFxuICAgIEBJbmplY3QoTmd4UmVzcG9uc2UpIHByaXZhdGUgcmVzcG9uc2U6IGFueSxcbiAgICBfb3B0aW9uc1Byb3ZpZGVyOiBDb29raWVPcHRpb25zUHJvdmlkZXIsXG4gICkge1xuICAgIHN1cGVyKF9vcHRpb25zUHJvdmlkZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBjb29raWVTdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0LmNvb2tpZSB8fCB0aGlzLnJlcXVlc3QuaGVhZGVyc1snY29va2llJ10gfHwgJyc7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0IGNvb2tpZVN0cmluZyh2YWw6IHN0cmluZykge1xuICAgIHRoaXMucmVxdWVzdC5jb29raWUgPSB2YWw7XG4gICAgdGhpcy5yZXNwb25zZS5jb29raWUgPSB2YWw7XG4gIH1cblxuICBwdXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIG9wdGlvbnM6IENvb2tpZU9wdGlvbnMgPSB7fSk6IHZvaWQge1xuICAgIGxldCBmaW5kS2V5ID0gZmFsc2U7XG4gICAgbGV0IG5ld0Nvb2tpZSA9IE9iamVjdC5rZXlzKHRoaXMuZ2V0QWxsKCkpXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgICAubWFwKChrZXlJdGVtKSA9PiB7XG4gICAgICAgIGlmIChrZXlJdGVtID09PSBrZXkpIHtcbiAgICAgICAgICBmaW5kS2V5ID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gYCR7a2V5fT0ke3ZhbHVlfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGAke2tleUl0ZW19PSR7dGhpcy5nZXQoa2V5SXRlbSl9YDtcbiAgICAgIH0pXG4gICAgICAuam9pbignOyAnKTtcbiAgICBpZiAoIWZpbmRLZXkpIHtcbiAgICAgIG5ld0Nvb2tpZSArPSBgOyAke2tleX09JHt2YWx1ZX1gO1xuICAgIH1cbiAgICB0aGlzLnJlcXVlc3QuaGVhZGVycy5jb29raWUgPSBuZXdDb29raWU7XG4gICAgLy8gbm90IHN1cmVcbiAgICB0aGlzLmNvb2tpZVN0cmluZyA9IG5ld0Nvb2tpZTtcbiAgfVxuXG4gIHJlbW92ZShrZXk6IHN0cmluZywgb3B0aW9ucz86IENvb2tpZU9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdDb29raWUgPSBPYmplY3Qua2V5cyh0aGlzLmdldEFsbCgpKVxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgICAgLm1hcCgoa2V5SXRlbSkgPT4ge1xuICAgICAgICBpZiAoa2V5SXRlbSA9PT0ga2V5KSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBgJHtrZXlJdGVtfT0ke3RoaXMuZ2V0KGtleUl0ZW0pfWA7XG4gICAgICB9KVxuICAgICAgLmpvaW4oJzsgJyk7XG4gICAgdGhpcy5yZXF1ZXN0LmhlYWRlcnMuY29va2llID0gbmV3Q29va2llO1xuICAgIC8vIG5vdCBzdXJlXG4gICAgdGhpcy5jb29raWVTdHJpbmcgPSBuZXdDb29raWU7XG4gIH1cbn1cbiJdfQ==