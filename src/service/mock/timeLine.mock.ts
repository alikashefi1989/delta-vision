import { ITimeLine } from "../../model/timeLine.model";
import { IAPI_ResponseList } from "../base.service";

export class TimeLineMock {
  search(): Promise<IAPI_ResponseList<ITimeLine>> {
    return Promise.resolve({
      data: {
        data: {
          items: [
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1609232271861,
              action: "LOGIN",
              title: "Login",
              description: "Tom logged in",
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1608532271861,
              action: "LOGOUT",
              title: "logout",
              description: "Tom logged out",
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1608332271861,
              action: "UPDATE",
              title: "entity modification",
              description: "fields of entity modified",
              fields:[
                {name : 'field1', from : 'xxxx', to : 'yyyy'},
                {name : 'field2', from : 'zzzzz', to : 'kkkkk'},
                {name : 'field3', from : 'rrrrrrr', to : 'wwwwwww'},
              ],
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1608232271861,
              action: "UPDATE",
              title: "field Changed",
              description: "first field updated",
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1608132271861,
              action: "DELETE",
              title: "entity removed",
              description: "entity removed by tom",
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1608032271861,
              action: "CHANGE_PASSWORD",
              title: "password changed",
              description: "Tom changed password",
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1607992271861,
              action: "CHANGE_PASSWORD",
              title: "password changed",
              description: "Tom changed password",
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1607892271861,
              action: "CHANGE_PASSWORD",
              title: "password changed",
              description: "Tom changed password",
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1607792271861,
              action: "CREATE",
              title: "entity creation",
              description: "Tom created a new entity",
              updatedAt: 0,
            },
            {
              id: "123455",
              createdBy: {
                name : "Tom"
              },
              createdAt: 1607392271861,
              action: "LOGIN",
              title: "Login",
              description: "Tom logged in",
              updatedAt: 0,
            },
          ],
          explain: {
            pagination: {
              page: 0,
              limit: 0,
              total: 0,
            },
            sorts: {},
            filters: {},
            search: "",
          },
        },
        meta: {
          code: 0,
          message: "",
          messageType: 1,
        },
      },
    });
  }
}
