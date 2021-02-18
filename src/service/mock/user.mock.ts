import { IUser } from "../../model/user.model";

export class MockUser {
    static list: Array<IUser> = [];
    static  data(skip:number,limit:number): Array<any> {
        this.list = [];
        // for (let i = 0; i < 10; i++) {
        //     this.list.push({
        //     });
        // }
        return this.list;
    }
}
