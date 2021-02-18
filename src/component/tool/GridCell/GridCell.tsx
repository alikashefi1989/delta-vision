import React, { Fragment } from 'react';
import { GRID_CELL_TYPE } from '../../../enum/grid-cell-type.enum';
import { IEntityColumn } from '../../../model/column.model';
import { IPhoneLabel } from '../../../model/phoneLabel.model';
import { Store2 } from '../../../redux/store';
import { CmpUtility } from '../../_base/CmpUtility';
// import { Localization } from '../../../config/localization/localization';

const CellPhoneList = ({ accessor, rowData }: any) => {
    const defaultLanguageCode: string =
        Store2.getState().language.defaultLanguage?.identifier || 'en';

    let firstPhone:
        | { number: string; type: IPhoneLabel }
        | undefined = undefined;

    if (rowData !== undefined) {
        firstPhone = rowData.slice(0, 1)[0];
    }

    return (
        <>
            {firstPhone !== undefined &&
            firstPhone.number &&
            typeof firstPhone.number === 'string' ? (
                <div className="phone-list-main-wraper prevent-onRowClick">
                    <div className="phone-first-item-wrapper">
                        <div
                            title={
                                firstPhone && firstPhone.type.title
                                    ? firstPhone.type.title[
                                          defaultLanguageCode
                                      ] || ''
                                    : ''
                            }
                            className="phone-number cursor-pointer"
                        >
                            {firstPhone && firstPhone.number
                                ? firstPhone.number
                                : undefined}
                        </div>
                        <div className="phone-icon"></div>
                    </div>
                </div>
            ) : undefined}
        </>
    );
};

// const CellPhoneList = ({ accessor, rowData }: any) => {
//     const [expand, setExpand] = useState(false);
//     const defaultLanguageCode: string =
//         Store2.getState().language.defaultLanguage?.identifier || 'en';

//     let firstPhone:
//         | { number: string; type: IPhoneLabel }
//         | undefined = undefined;
//     let otherPhones: Array<{ number: string; type: IPhoneLabel }> = [];

//     if (rowData !== undefined) {
//         firstPhone = rowData.slice(0, 1)[0];
//         otherPhones = rowData.slice(1, rowData.length);
//     }

//     return (
//         <div className="phone-list-main-wraper prevent-onRowClick">
//             {rowData === undefined || rowData.length === 0 ? undefined : (
//                 <>
//                     {
//                         <div className="btn-wrapper-child">
//                             <div className="phone-first-item-wrapper">
//                                 <div
//                                     title={
//                                         firstPhone && firstPhone.type.title
//                                             ? firstPhone.type.title[
//                                             defaultLanguageCode
//                                             ] || ''
//                                             : ''
//                                     }
//                                     className="phone-number cursor-pointer"
//                                 >
//                                     {firstPhone && firstPhone.number
//                                         ? firstPhone.number
//                                         : undefined}
//                                 </div>
//                                 <div className="phone-icon"></div>
//                                 {otherPhones.length &&
//                                     otherPhones.length > 0 ? (
//                                         <div
//                                             className="show-btn cursor-pointer"
//                                             onClick={() => setExpand(!expand)}
//                                         >
//                                             <div className="text text-capitalize">
//                                                 {expand === false
//                                                     ? Localization.show_more
//                                                     : Localization.show_less}
//                                             </div>
//                                             <div className="angle-icon-wrapper">
//                                                 {expand === false ? (
//                                                     <i className="fa fa-angle-down font-weight-bold"></i>
//                                                 ) : (
//                                                         <i className="fa fa-angle-up font-weight-bold"></i>
//                                                     )}
//                                             </div>
//                                         </div>
//                                     ) : undefined}
//                             </div>
//                         </div>
//                     }
//                     {expand === false
//                         ? undefined
//                         : otherPhones.map(
//                             (
//                                 item: { number: string; type: IPhoneLabel },
//                                 i: number
//                             ) => {
//                                 return (
//                                     <Fragment key={i}>
//                                         <div className="phone-other-items-wrapper">
//                                             <div
//                                                 title={
//                                                     item.type.title
//                                                         ? item.type.title[
//                                                         defaultLanguageCode
//                                                         ] || ''
//                                                         : ''
//                                                 }
//                                                 className="phone-number"
//                                             >
//                                                 {item && item.number
//                                                     ? item.number
//                                                     : undefined}
//                                             </div>
//                                             <div className="phone-icon"></div>
//                                             {/* <div className="show-btn">
//                                             <div className="text"></div>
//                                             <div className="angle-icon-wrapper"></div>
//                                         </div> */}
//                                         </div>
//                                     </Fragment>
//                                 );
//                             }
//                         )}
//                 </>
//             )}
//         </div>
//     );
// };

export class GridCell {
    static render(EColumn: IEntityColumn): (cell: any) => JSX.Element {
        switch (EColumn.cell) {
            case GRID_CELL_TYPE.CELL_TEXT:
                return GridCell.cellText(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_TEXT_INFO:
                return GridCell.cellTextInfo(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_DATE:
                return GridCell.cellDate(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_BOOLEAN:
                return GridCell.cellBoolean(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_PHONE:
                return GridCell.cellPhone(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_EMAIL:
                return GridCell.cellEmail(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_PHONE_LIST:
                return GridCell.cellPhoneList(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_PARENT_CATEGORY_NAME:
                return GridCell.cellParentCategoryName(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_SUB_CATEGORIES_NAME:
                return GridCell.cellSubCategoriesName(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_CATEGORY_ATTRIBUTIES_NAME:
                return GridCell.cellCategoryAttributiesName(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_LOGO:
                return GridCell.cellLogo(EColumn.accessor);
            case GRID_CELL_TYPE.CELL_IMAGE:
                return GridCell.cellImage(EColumn.accessor);
            default:
                return GridCell.cellText(EColumn.accessor);
        }
    }

    static cellText(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            // console.log('accessor', accessor, cell)
            let str = '';
            if (accessor.includes('.')) {
                let newItem = cell.row.original;
                // accessor.split('.').forEach(l => { newItem = newItem[l]; });
                accessor.split('.').forEach((l) => {
                    newItem = newItem[l] ? newItem[l] : '';
                }); // modified by ali TODO: Plz check
                str = newItem;
            } else {
                str = cell.row.original[accessor];
            }
            return <div className="text-nowrap-ellipsis">{str}</div>;
        };
    }
    static cellTextInfo(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            // console.log('accessor', accessor, cell)
            let str = '';
            if (accessor.includes('.')) {
                let newItem = cell.row.original;
                accessor.split('.').forEach((l) => {
                    newItem = newItem[l];
                });
                str = newItem;
            } else {
                str = cell.row.original[accessor];
            }
            return (
                <div className="text-info text-nowrap-ellipsis cursor-pointer">
                    {str}
                </div>
            );
        };
    }
    static cellDate(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            return (
                <>
                    {cell.row.original[accessor] ? (
                        <span
                            title={CmpUtility.fromNowDate(
                                cell.row.original[accessor] / 1000
                            )}
                        >
                            {CmpUtility.timestamp2Date(
                                cell.row.original[accessor] / 1000
                            )}
                        </span>
                    ) : (
                        <></>
                    )}
                </>
            );
        };
    }
    static cellBoolean(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            return cell.row.original[accessor] ? (
                <span className="text-capitalize">yes</span>
            ) : (
                <span className="text-capitalize">no</span>
            );
        };
    }
    static cellPhone(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            return (
                <div className="text-primary text-nowrap-ellipsis">
                    {cell.row.original[accessor]}
                </div>
            );
        };
    }
    static cellEmail(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            return (
                <div className="text-primary text-nowrap-ellipsis">
                    {cell.row.original[accessor]}
                </div>
            );
        };
    }
    static cellPhoneList(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            let rowData:
                | Array<{ number: string; type: IPhoneLabel }>
                | undefined = cell.row.original[accessor];
            return <CellPhoneList accessor={accessor} rowData={rowData} />;
        };
    }
    static cellParentCategoryName(
        accessor: string
    ): (cell: any) => JSX.Element {
        return (cell: any) => {
            let parentCategory = cell.row.original[accessor];
            const defaultLanguageCode: string =
                Store2.getState().language.defaultLanguage?.identifier || 'en';
            return (
                <>
                    {parentCategory ? (
                        <>
                            {parentCategory.name &&
                            parentCategory.name[defaultLanguageCode] &&
                            typeof parentCategory.name[defaultLanguageCode] ===
                                'string'
                                ? parentCategory.name[defaultLanguageCode] || ''
                                : undefined}
                        </>
                    ) : undefined}
                </>
            );
        };
    }
    static cellSubCategoriesName(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            let subCategories = cell.row.original[accessor];
            const defaultLanguageCode: string =
                Store2.getState().language.defaultLanguage?.identifier || 'en';
            return (
                <div className="text-nowrap-ellipsis max-w-250px">
                    {subCategories !== undefined ||
                    Array.isArray(subCategories) === false
                        ? undefined
                        : subCategories.map((item: any, i: number) => {
                              return (
                                  <Fragment key={i}>
                                      {item &&
                                      item.name &&
                                      item.name[defaultLanguageCode] &&
                                      typeof item.name[defaultLanguageCode] ===
                                          'string' ? (
                                          <span className="badge badge-secondary mx-1">
                                              {item.name[defaultLanguageCode]}
                                          </span>
                                      ) : (
                                          <></>
                                      )}
                                  </Fragment>
                              );
                          })}
                </div>
            );
        };
    }
    static cellCategoryAttributiesName(
        accessor: string
    ): (cell: any) => JSX.Element {
        return (cell: any) => {
            let attributies = cell.row.original[accessor];
            const defaultLanguageCode: string =
                Store2.getState().language.defaultLanguage?.identifier || 'en';
            return (
                <div className="text-nowrap-ellipsis max-w-250px">
                    {attributies !== undefined ||
                    Array.isArray(attributies) === false
                        ? undefined
                        : attributies.map((item: any, i: number) => {
                              return (
                                  <Fragment key={i}>
                                      {item &&
                                      item[defaultLanguageCode] &&
                                      typeof item[defaultLanguageCode] ===
                                          'string' ? (
                                          <span className="badge badge-secondary mx-1">
                                              {item[defaultLanguageCode]}
                                          </span>
                                      ) : (
                                          <></>
                                      )}
                                  </Fragment>
                              );
                          })}
                </div>
            );
        };
    }
    static cellImage(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            return (
                <div className="d-flex align-items-center justify-content-center w-50px h-50px">
                    <img
                        className="rounded max-w-50px max-h-50px"
                        src={cell.row.original[accessor]?.url}
                        alt=""
                    />
                </div>
            );
        };
    }
    static cellLogo(accessor: string): (cell: any) => JSX.Element {
        return (cell: any) => {
            return (
                <div className="d-flex align-items-center justify-content-center w-50px h-50px">
                    <img
                        className="rounded max-w-50px max-h-50px w-50px h-50px"
                        src={cell.row.original[accessor]?.url}
                        alt=""
                    />
                </div>
            );
        };
    }
}
