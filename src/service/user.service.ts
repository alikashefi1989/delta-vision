import { CrudService } from './crud.service';
import { IUser, TUserCreate, TUserUpdate } from '../model/user.model';
import { IAPI_Response } from './base.service';

export class UserService extends CrudService<IUser, TUserCreate, TUserUpdate> {
    crudBaseUrl = 'user';

    setColumns(
        entityName: string,
        visibleColumnsOrder: Array<string>
    ): Promise<IAPI_Response<{ items: Array<string> }>> {
        return this.axiosTokenInstance.post(
            `/userModelView/setColumns/${entityName}`,
            {
                items: visibleColumnsOrder,
            }
        );
    }
}
