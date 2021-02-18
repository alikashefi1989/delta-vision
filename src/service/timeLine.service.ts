import { ITimeLine } from '../model/timeLine.model';
import { CrudService } from './crud.service';
// import { IAPI_ResponseList } from './base.service';
// import { ISearchPayload } from '../model/searchPayload.model';
// import { TimeLineMock } from './mock/timeLine.mock';

export class TimeLineService extends CrudService<ITimeLine, any, any> {
    crudBaseUrl = 'timeLine';

    // search(search: ISearchPayload): Promise<IAPI_ResponseList<ITimeLine>> {
    //     return new TimeLineMock().search()
    // }
}
