import { ICoupon, TCouponCreate, TCouponUpdate } from '../model/coupon.model';
import { CrudService } from './crud.service';

export class CouponService extends CrudService<ICoupon, TCouponCreate, TCouponUpdate> {
    crudBaseUrl = 'coupon';
}
