import { MEDIA_GROUP } from "../enum/media-group.enum";
import { IMedia } from "../model/media.model";
import { BaseService, IAPI_ResponseList } from "./base.service";

export class UploadService extends BaseService {

    // upload(files: Array<File>, group: MEDIA_GROUP = MEDIA_GROUP.OTHER): Promise<{ data: Array<IMedia> }> {
    upload(files: Array<File>, group: MEDIA_GROUP = MEDIA_GROUP.OTHER): Promise<IAPI_ResponseList<IMedia>> {
        this.axiosTokenInstance.defaults.headers['Content-Type'] = 'multipart/form-data';

        const bodyFormData = new FormData();
        files.forEach(f => { bodyFormData.append('mediaFiles', f); });
        bodyFormData.append('group', group);

        return this.axiosTokenInstance.post('/media/add', bodyFormData);
    }
}
