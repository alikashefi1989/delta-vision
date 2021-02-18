import { BaseModel } from '../../../model/base.model';
import { AreaService } from '../../../service/area.service';
import { AttributeService } from '../../../service/attribute.service';
import { BrandService } from '../../../service/brand.service';
import { CategoryService } from '../../../service/category.service';
import { CountryService } from '../../../service/country.service';
import { CrudService } from '../../../service/crud.service';
import { GeneralCrudService } from '../../../service/generalCrud.service';
import { LanguageService } from '../../../service/language.service';
import { OrderService } from '../../../service/order.service';
import { ProductService } from '../../../service/product.service';
import { StoreService } from '../../../service/store.service';
import { TagService } from '../../../service/tag.service';
import { UserService } from '../../../service/user.service';
import { VariationService } from '../../../service/variation.service';
import { WarehouseService } from '../../../service/warehouse.service';

export enum ROUTE_BASE_CRUD {
    language = 'language',
    brand = 'brand',
    area = 'area',
    category = 'category',
    country = 'country',
    store = 'store',
    warehouse = 'warehouse',
    variation = 'variation',
    attribute = 'attribute',
    product = 'product',
    user = 'user',
    order = 'order',
    tag = 'tag',
    coupon = 'coupon',
    badge = 'badge',
    docAcc = 'docAcc',
    return = 'return',
    purshase = 'purshase',
    purchaseReturn = 'purchaseReturn',
    contact = 'contact',
    adjustment = 'adjustment',
    refund = 'refund',
    purchaseOrder = 'purchaseOrder',
}

export class BaseUtility {
    static crudService<EntityModel extends BaseModel, C, U>(
        entityName: ROUTE_BASE_CRUD
    ): CrudService<any, any, any> {
        switch (entityName) {
            case ROUTE_BASE_CRUD.language:
                return new LanguageService();
            case ROUTE_BASE_CRUD.brand:
                return new BrandService();
            case ROUTE_BASE_CRUD.area:
                return new AreaService();
            case ROUTE_BASE_CRUD.category:
                return new CategoryService();
            case ROUTE_BASE_CRUD.country:
                return new CountryService();
            case ROUTE_BASE_CRUD.store:
                return new StoreService();
            case ROUTE_BASE_CRUD.warehouse:
                return new WarehouseService();
            case ROUTE_BASE_CRUD.variation:
                return new VariationService();
            case ROUTE_BASE_CRUD.attribute:
                return new AttributeService();
            case ROUTE_BASE_CRUD.product:
                return new ProductService();
            case ROUTE_BASE_CRUD.user:
                return new UserService();
            case ROUTE_BASE_CRUD.order:
                return new OrderService();
            case ROUTE_BASE_CRUD.tag:
                return new TagService();

            default:
                return new GeneralCrudService(entityName);
            // throw new Error('CRUD SERVICE NOT FOUND');
        }
    }
}
