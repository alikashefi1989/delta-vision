import { Store2 } from "../../redux/store";
import { action_change_app_flag } from "../../redux/action/internationalization";
import { Localization } from "../../config/localization/localization";
import moment from 'moment';

export abstract class CmpUtility {
    static image_pre_url = '/api/serve-files';
    static defaultAvatarImagePath = "/static/media/img/icon/avatar.png";
    static avatarSizeImagePath = "/static/media/img/icon/avatar.png";
    static brokenAvatarImagePath = "/static/media/img/icon/broken-avatar.png";

    static getImageUrl(imageId: string): string {
        return CmpUtility.image_pre_url + '/' + imageId;
    }

    static imageOnError(e: any, defaultImagePath: string) {
        if (e.target.src !== window.location.origin + defaultImagePath) {
            e.target.src = defaultImagePath;
        }
    }

    static personImageOnError(e: any) {
        return CmpUtility.imageOnError(e, CmpUtility.brokenAvatarImagePath);
    }

    static personImg(imgId?: string): string {
        const img_path =
            (imgId && CmpUtility.getImageUrl(imgId))
            ||
            CmpUtility.defaultAvatarImagePath;
        return img_path;
    }

    static gotoTop() {
        window.scrollTo(0, 0);
    }

    /**
     * render all cmp with dispatch action_change_app_flag.
     */
    static refreshView() {
        const int = { ...Store2.getState().internationalization };
        Store2.dispatch(action_change_app_flag(int));
    }

    static readonly anchorUndefined: any;

    static set documentTitle(title: string) {
        document.title = title;
    }
    static resetDocumentTitle() {
        document.title = Localization.app_title;
    }

    static dismissPopover() {
        document.body.click();
    }

    /**
     * @param timestamp: number in second ?
     */
    static fromNowDate(timestamp: number): string {
        try {
            return moment.unix(timestamp).fromNow();
        } catch (e) {
            console.error('fromNowDate:', e);
            return '';
        }
    }

    /**
     * @param timestamp: number in second
     */
    static timestamp2Date(timestamp: number): string {
        try {
            // return moment(timestamp * 1000).locale("en").format('YYYY/MM/DD');
            return moment(timestamp * 1000).format('YYYY/MM/DD');
        } catch (e) {
            console.error('timestamp2Date:', e);
            return '';
        }
    }

}
