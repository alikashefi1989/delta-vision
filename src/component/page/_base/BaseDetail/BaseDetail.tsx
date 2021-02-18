import React from 'react';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { CrudService } from '../../../../service/crud.service';
import { BaseModel } from '../../../../model/base.model';
import * as Yup from 'yup';
import TopBarProgress from 'react-topbar-progress-indicator';
// import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import { AppRoute } from '../../../../config/route';
// import { Localization } from '../../../../config/localization/localization';
import { ToastContainer } from 'react-toastify';
import { ROUTE_BASE_CRUD } from '../BaseUtility';
import { AppGridFull } from '../../../tool/AppGridFull/AppGridFull';
import { IEntityRelated } from '../../../../model/related.model';
import { Button, Modal } from 'react-bootstrap';

export enum DETAIL_PAGE_MODE {
    UPDATE = 'UPDATE',
    VIEW = 'VIEW',
}

export interface IViewRelated {
    title: string;
    entityName: ROUTE_BASE_CRUD;
    // filter: Object;
    total?: number;
    // hasPlus?:boolean;
    id: string;
    mVAId: string;
    hidden: boolean;
}

export interface IViewSummary {}

export interface IStateBaseDetail<T> {
    formData: Object;
    fetchData: T | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
    savePageMode: DETAIL_PAGE_MODE;
    // relatedList: Array<IViewRelated>;
    relatedList: Array<IEntityRelated & { total?: number }>;
    showUserRelatedList: Array<IEntityRelated & { total?: number }>;
    userRelatedList: Array<string>;
    showOverview: boolean;
    showRelatedList: boolean;
    showManageReletedModal: boolean;
    selectedItem?: String | null;
    unSelectedList: Array<IEntityRelated & { total?: number }>;
    selectedList: Array<IEntityRelated & { total?: number }>;
    // summaryList:Array<>
}
export interface IPropsBaseDetail {
    internationalization: TInternationalization;
    match: any;
}

export default abstract class BaseDetail<
    EntityModel extends BaseModel,
    EntityModelCreate,
    EntityModelUpdate,
    P extends IPropsBaseDetail,
    S extends IStateBaseDetail<EntityModel>
> extends BaseComponent<P, S> {
    protected baseState: IStateBaseDetail<EntityModel> = {
        formData: {},
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: DETAIL_PAGE_MODE.VIEW,
        relatedList: [],
        userRelatedList: [],
        showUserRelatedList: [],
        showOverview: true,
        showRelatedList: true,
        showManageReletedModal: false,
        selectedItem: null,
        unSelectedList: [],
        selectedList: [],
    };

    protected abstract _entityService: CrudService<
        EntityModel,
        EntityModelCreate,
        EntityModelUpdate
    >;
    protected abstract appRouteBaseCRUD: ROUTE_BASE_CRUD;
    protected entityId: string | undefined;
    protected formValidation = Yup.object({});

    componentDidMount() {
        if (this.props.match.params.id) {
            this.entityId = this.props.match.params.id;
            this.setState(
                {
                    formLoader: true,
                    savePageMode: this.savePageMode(this.props.match.path),
                },
                () => {
                    this.getReleteds();
                    this.fetchData();
                }
            );
        } else {
            this.setState({
                actionBtnVisibility: true,
            });
        }
    }

    protected savePageMode(path: string): DETAIL_PAGE_MODE {
        switch (path) {
            case AppRoute.routeData[this.appRouteBaseCRUD].update.path:
                return DETAIL_PAGE_MODE.UPDATE;
            case AppRoute.routeData[this.appRouteBaseCRUD].view.path:
                return DETAIL_PAGE_MODE.VIEW;
            default:
                return DETAIL_PAGE_MODE.VIEW;
        }
    }

    protected async fetchData() {
        if (!this.entityId) return;

        try {
            const res = await this._entityService.byId(this.entityId);
            this.setState({
                fetchData: res.data.data,
                // formData: this.model2Form(res.data.data),
                formLoader: false,
                actionBtnVisibility: true,
            });
        } catch (e) {
            this.setState({ formLoader: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'fetchData_error' },
            });
        }
    }

    protected goToUpdate(id: string) {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].update.url(id));
    }
    protected goToView(id: string) {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].view.url(id));
    }
    protected goToManage() {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].manage.url());
    }

    protected async saveRelatedList() {
        const list = [];

        for (const item of this.state.selectedList) {
            list.push(item.id);
        }

        try {
            await this._entityService.saveRelatedList({ items: list });
            this.setState(
                {
                    showUserRelatedList: this.state.selectedList,
                },
                this.handleShowManageRelatedModal
            );
            // this.getReleteds();
        } catch (e) {
            this.setState({ formLoader: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'fetchData_error' },
            });
        }
    }

    protected async getReleteds() {
        if (!this.entityId) return;
        try {
            const res = await this._entityService.relatedList(this.entityId);
            const selectedList = [];
            const unSelectedList = [];
            for (const item of res.data.data.related) {
                if (item.hidden) {
                    unSelectedList.push(item);
                } else {
                    selectedList.push(item);
                }
            }
            this.setState({
                relatedList: res.data.data.related,
                selectedList,
                unSelectedList,
                showUserRelatedList: selectedList,
            });
        } catch (e) {
            this.setState({ formLoader: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'fetchData_error' },
            });
        }
    }

    // protected async getUserReleteds() {
    //     try {
    //         const res = await this._entityService.userRelatedList();
    //         const selectedList = [];
    //         // let selectedList = this.state.relatedList.filter((item) =>
    //         //     res.data.data.items.some((userItem) => userItem === item.title)
    //         // );
    //         let unSelectedList = this.state.relatedList.filter(
    //             (item) =>
    //                 !res.data.data.items.some(
    //                     (userItem) => userItem === item.title
    //                 )
    //         );
    //         for (const item of res.data.data.items) {
    //             for (const userItem of this.state.relatedList) {
    //                 if (item === userItem.title) {
    //                     selectedList.push(userItem);
    //                 }
    //             }
    //         }

    //         this.setState({
    //             userRelatedList: res.data.data.items,
    //             selectedList: selectedList.length
    //                 ? selectedList
    //                 : unSelectedList,
    //             showUserRelatedList: selectedList.length
    //                 ? selectedList
    //                 : unSelectedList,
    //             unSelectedList: selectedList.length ? unSelectedList : [],
    //         });
    //     } catch (e) {
    //         this.setState({ formLoader: false });
    //         this.handleError({
    //             error: e.response,
    //             toastOptions: { toastId: 'fetchData_error' },
    //         });
    //     }
    // }

    handleShowRelatedContainer() {
        this.setState({ showRelatedList: !this.state.showRelatedList });
    }

    handleScrollToView(key: string) {
        let target = document.getElementById(key);
        if (target) {
            target.scrollIntoView();
        }
    }

    handleShowManageRelatedModal() {
        this.setState(
            {
                showManageReletedModal: !this.state.showManageReletedModal,
                selectedItem: null,
            },
            this.handleManageRelatedItem
        );
    }

    handleSelectedItem(value: String) {
        this.setState({ selectedItem: value });
    }

    handleManageRelatedItem() {
        let selectedList = [];
        for (const item of this.state.showUserRelatedList) {
            for (const userItem of this.state.relatedList) {
                if (item.mVAId === userItem.mVAId) {
                    selectedList.push(userItem);
                }
            }
        }
        let unSelectedList = this.state.relatedList.filter(
            (item) =>
                !this.state.showUserRelatedList.some(
                    (userItem) => userItem.mVAId === item.mVAId
                )
        );
        this.setState({
            selectedList: selectedList,
            unSelectedList: unSelectedList,
        });
    }

    addToSelectedList() {
        const selectedList = [...this.state.selectedList];
        const unSelectedList = [...this.state.unSelectedList];
        let selectedItem = this.state.relatedList.find(
            (item) => item.mVAId === this.state.selectedItem
        );
        if (selectedItem) {
            const index = unSelectedList.indexOf(selectedItem);
            if (index > -1) {
                unSelectedList.splice(index, 1);
                selectedList.push(selectedItem);
                this.setState({ selectedList, unSelectedList });
            }
        }
    }
    addToUnSelectedList() {
        const selectedList = [...this.state.selectedList];
        const unSelectedList = [...this.state.unSelectedList];
        let selectedItem = this.state.relatedList.find(
            (item) => item.mVAId === this.state.selectedItem
        );
        if (selectedItem) {
            const index = selectedList.indexOf(selectedItem);
            if (index > -1) {
                selectedList.splice(index, 1);
                unSelectedList.push(selectedItem);
                this.setState({ selectedList, unSelectedList });
            }
        }
    }

    moveToUp() {
        const selectedList = [...this.state.selectedList];
        let selectedItem = this.state.relatedList.find(
            (item) => item.mVAId === this.state.selectedItem
        );
        if (selectedItem) {
            const index = selectedList.indexOf(selectedItem);
            if (index > -1 && index !== 0) {
                selectedList.splice(index, 1);
                selectedList.splice(index - 1, 0, selectedItem);
                this.setState({ selectedList });
            }
        }
    }
    moveToBottom() {
        const selectedList = [...this.state.selectedList];
        let selectedItem = this.state.relatedList.find(
            (item) => item.mVAId === this.state.selectedItem
        );
        if (selectedItem) {
            const index = selectedList.indexOf(selectedItem);
            if (index > -1 && index !== selectedList.length - 1) {
                selectedList.splice(index, 1);
                selectedList.splice(index + 1, 0, selectedItem);
                this.setState({ selectedList });
            }
        }
    }

    renderRelatedList(data?: Array<{ title: string; id: string }>) {
        return (
            <>
                <div
                    className={`related-container thin-scroll ${
                        this.state.showRelatedList ? 'active' : ''
                    } `}
                >
                    <div className="itemList-container">
                        <div className="item-headline-container">
                            <p className="m-0 headline">Related List</p>
                        </div>
                        {this.renderStaticReletedItems(data)}
                        {this.renderDynamicReletedItems()}
                        <div className="item-headline-container ">
                            <p
                                className="text-info m-0 btn p-0"
                                onClick={() =>
                                    this.handleShowManageRelatedModal()
                                }
                            >
                                Manage Related Lists
                            </p>
                        </div>
                        {this.renderManageReleted()}
                    </div>
                </div>
            </>
        );
    }

    renderManageReleted() {
        return (
            <Modal
                className="detail-modalContainer"
                show={this.state.showManageReletedModal}
                onHide={() => this.handleShowManageRelatedModal()}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Organize Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Select and reorder the related list items to be listed
                        in the Contact Details page. Notes Related List cannot
                        be reordered.
                    </p>
                    <div className="col-12 d-flex flex-wrap ">
                        <div className=" col-3">
                            <p className="m-0 pb-2">Unselected List:</p>
                            <ul className=" border list-unstyled p-2 h-100">
                                {this.state.unSelectedList.map(
                                    (item, index) => (
                                        <li
                                            className={`p-1`}
                                            style={{
                                                backgroundColor:
                                                    this.state.selectedItem ===
                                                    item.mVAId
                                                        ? 'rgb(206, 206, 206)'
                                                        : '',
                                                cursor: 'pointer',
                                            }}
                                            key={index}
                                            onClick={() =>
                                                this.handleSelectedItem(
                                                    item.mVAId
                                                )
                                            }
                                        >
                                            {item.title}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className="col-1 d-flex flex-column align-items-center justify-content-center">
                            <div
                                className="move-icon move-to-right"
                                onClick={() => this.addToSelectedList()}
                            ></div>
                            <div
                                className="move-icon move-to-left"
                                onClick={() => this.addToUnSelectedList()}
                            ></div>
                        </div>
                        <div className=" col-3 ">
                            <p className="m-0 pb-2">Selected List:</p>
                            <ul className=" border list-unstyled p-2 h-100">
                                {this.state.selectedList.map((item, index) => (
                                    <li
                                        className={`p-1`}
                                        style={{
                                            backgroundColor:
                                                this.state.selectedItem ===
                                                item.mVAId
                                                    ? 'rgb(206, 206, 206)'
                                                    : '',
                                            cursor: 'pointer',
                                        }}
                                        key={index}
                                        onClick={() =>
                                            this.handleSelectedItem(item.mVAId)
                                        }
                                    >
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-1 d-flex flex-column align-items-center justify-content-center">
                            <div
                                className="move-icon move-to-top"
                                onClick={() => this.moveToUp()}
                            ></div>
                            <div
                                className="move-icon move-to-bottom"
                                onClick={() => this.moveToBottom()}
                            ></div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => this.handleShowManageRelatedModal()}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => this.saveRelatedList()}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    renderStaticReletedItems(data?: Array<{ title: string; id: string }>) {
        if (data && data.length) {
            return data.map((item, index) => (
                <div
                    className="item-container"
                    key={index}
                    onClick={() => this.handleScrollToView(item.id)}
                >
                    <p className="m-0 item-label text-capitalize">
                        {item.title}
                    </p>
                </div>
            ));
        }
    }

    renderDynamicReletedItems() {
        return this.state.showUserRelatedList.map((item, index) => (
            <div
                className="item-container"
                key={index}
                onClick={() =>
                    this.handleScrollToView(
                        `related-${item.entityName}-${index}`
                    )
                }
            >
                <p className="m-0 item-label text-capitalize">{item.title}</p>
                {item.total ? (
                    <p className="m-0 item-badge">{item.total}</p>
                ) : null}
                {/* {item.hasPlus && <p className="m-0 item-icon">+</p>} */}
            </div>
        ));
    }

    changeTotalItem(total: number, index: number) {
        const data = this.state.selectedList;
        data[index].total = total;
        this.setState({
            selectedList: data,
        });
    }

    renderRelatedTable() {
        return (
            <>
                {this.entityId &&
                    this.state.showUserRelatedList.map((item, index) => (
                        <div
                            className="content-container"
                            key={index}
                            id={`related-${item.entityName}-${index}`}
                        >
                            <AppGridFull
                                // entityTitle={item.title}
                                // entityName={item.entityName}
                                // filter={item.filter}
                                onTotalChange={(total) => {
                                    this.changeTotalItem(total, index);
                                }}
                                // mVAId={item.mVAId}
                                entityId={this.entityId!}
                                entityRelated={item}
                            />
                        </div>
                    ))}
            </>
        );
    }

    renderItemDetail() {
        return <div className="content-container"></div>;
    }

    handleChangeSwitch(value: boolean) {
        this.setState({ showOverview: value });
    }

    renderSwitch() {
        return (
            <div className="switch-border">
                <p
                    onClick={() => this.handleChangeSwitch(true)}
                    className="switch-item"
                >
                    Overview
                </p>
                <p
                    onClick={() => this.handleChangeSwitch(false)}
                    className="switch-item"
                >
                    Timeline
                </p>
                <div
                    className={`switch-btn ${
                        this.state.showOverview ? 'switch-left' : ''
                    } `}
                >
                    <p className="switch-item">
                        {this.state.showOverview ? 'Overview' : 'Timeline'}
                    </p>
                </div>
            </div>
        );
    }

    renderNavbarBtn() {
        return (
            <div className="side-item-container justify-content-end">
                <div className="main-btn-container">
                    <button
                        className="btn  z-btn-light text-capitalize"
                        onClick={() => {
                            this.goToUpdate(this.props.match.params.id);
                        }}
                    >
                        edit
                    </button>
                    {/* <button className="btn btn-light-- z-btn-light text-capitalize ml-3">
                            <i className="fa fa-ellipsis-h dropdown-icon"></i>
                        </button> */}
                </div>
                {/* <div className="move-icon-container">
                        <span className="icon-previous"></span>
                        <span className="icon-next"></span>
                    </div> */}
            </div>
        );
    }
    renderNavbar() {
        return (
            <div className="top-btn-container">
                <div className="side-item-container">
                    <div className="back-icon-container">
                        <div
                            className="pointer"
                            onClick={() => this.goToManage()}
                            // href={`/#${AppRoute.routeData[this.appRouteBaseCRUD].manage.url()}`}
                        >
                            <span className="back-icon"></span>
                        </div>
                    </div>
                    <div className="image-container">
                        <img src="static/media/img/other/noImage.png" alt="" />
                        <div className="image-uploader">
                            <span className="icon-camera" />
                        </div>
                    </div>
                    <div className="text-container">
                        <p className="main-text">Kris Marrier (Sample)</p>
                        <p className="detail-text">
                            {' '}
                            &nbsp;&nbsp;-&nbsp;&nbsp;King (Sample)
                        </p>
                    </div>
                </div>
                {this.renderNavbarBtn()}
            </div>
        );
    }

    renderSummary() {
        return (
            <div
                className="content-container d-flex flex-wrap"
                id="related-summary"
            >
                <div className="title-container col-12">
                    <p className="text-capitalize">Summary</p>
                </div>
                <div className="col-11">
                    <div className="col-12">
                        <p className="text-capitalize p-2 pt-3 m-0 font-weight-bold">
                            Kuwait
                        </p>
                    </div>
                    <div className="col-12 d-flex flex-wrap">
                        <div className="col-8 p-2">
                            <div className="col-12 border rounded d-flex flex-wrap pt-3 pb-3 align-items-center">
                                <div className="col-3 text-center border-right">
                                    <p className="m-0 pb-2 text-muted">
                                        Inventory
                                    </p>
                                    <p className="m-0 pb-2 font-weight-bold">
                                        23
                                    </p>
                                </div>
                                <div className="col-4 text-center">
                                    <p className="m-0 pb-2 text-muted">
                                        Items Sold
                                    </p>
                                    <p className="m-0 pb-2 font-weight-bold">
                                        33
                                    </p>
                                </div>
                                <div className="col-1">
                                    <p
                                        className="m-0 text-center rounded-circle"
                                        style={{
                                            width: 21,
                                            height: 21,
                                            backgroundColor: '#E5F1FF',
                                        }}
                                    >
                                        <i className="fa fa-minus text-white" />
                                    </p>
                                </div>
                                <div className="col-4 text-center">
                                    <p className="m-0 pb-2 text-muted">
                                        Items Returned
                                    </p>
                                    <p className="m-0 pb-2 font-weight-bold">
                                        310
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 p-2">
                            <div className="col-12 border rounded d-flex flex-wrap pt-3 pb-3 align-items-center">
                                <div className="col-6 text-center border-right">
                                    <p className="m-0 pb-2 text-muted">Sales</p>
                                    <p className="m-0 pb-2 font-weight-bold">
                                        20,000 KD
                                    </p>
                                </div>
                                <div className="col-6 text-center">
                                    <p className="m-0 pb-2 text-muted">
                                        revenue
                                    </p>
                                    <p className="m-0 pb-2 font-weight-bold">
                                        5,000 KD
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    protected saveFormRender() {
        return (
            <div className="template-box animated fadeInDown min-h-150px">
                <div className="row detail-container"></div>
                {this.state.formLoader && <TopBarProgress />}
            </div>
        );
    }

    render() {
        return (
            <>
                {this.saveFormRender()}
                <ToastContainer {...this.getNotifyContainerConfig()} />
            </>
        );
    }
}
