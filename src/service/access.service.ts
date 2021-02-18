import { BaseService } from './base.service';

enum PERMISSIONS { }

export interface IAccessService<P> {
    allAccess: Array<P>;
    checkAccess: (ac: P) => boolean;
    checkListAccess: (list: Array<P>) => { [k in keyof P]?: boolean };
}

export class AccessService extends BaseService implements IAccessService<PERMISSIONS> {

    private static _instance: AccessService;
    static get instance() {
        if (!AccessService._instance) AccessService._instance = new AccessService();
        return AccessService._instance;
    }

    private _allAccess: Array<PERMISSIONS> = [];
    set allAccess(list: Array<PERMISSIONS>) {
        this._allAccess = list;
    }
    get allAccess() {
        return this._allAccess;
    }

    checkAccess(ac: PERMISSIONS): boolean {
        return AccessService.instance.allAccess.includes(ac);
    }

    checkListAccess(list: Array<PERMISSIONS>) {
        const obj: { [k in keyof PERMISSIONS]?: boolean } | any = {} as any; /// TODO remove any
        list.forEach((ac: PERMISSIONS) => {
            obj[ac] = AccessService.instance.checkAccess(ac)
        });
        return obj;
    }

}