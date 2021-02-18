import React from 'react';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { CrudService } from '../../../../service/crud.service';
import { BaseModel } from '../../../../model/base.model';
import * as Yup from 'yup';
import TopBarProgress from 'react-topbar-progress-indicator';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import { AppRoute } from '../../../../config/route';
import { Formik, FormikProps } from 'formik';
import { Localization } from '../../../../config/localization/localization';
import { ToastContainer } from 'react-toastify';
import { ROUTE_BASE_CRUD } from '../BaseUtility';

export enum SAVE_PAGE_MODE {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    COPY = 'COPY',
    VIEW = 'VIEW',
}

export interface IStateBaseSave<T> {
    formData: Object;
    fetchData: T | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
    savePageMode: SAVE_PAGE_MODE;
}
export interface IPropsBaseSave {
    internationalization: TInternationalization;
    match: any;
}

export default abstract class BaseSave<
    EntityModel extends BaseModel,
    EntityModelCreate,
    EntityModelUpdate,
    P extends IPropsBaseSave,
    S extends IStateBaseSave<EntityModel>
> extends BaseComponent<P, S> {
    protected baseState: IStateBaseSave<EntityModel> = {
        formData: {},
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
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
                () => this.fetchData()
            );
        } else {
            this.setState({
                actionBtnVisibility: true,
            });
        }
    }

    componentDidUpdate(prevProps: Readonly<P>) {
        const prevPath = prevProps.match.path;
        const currentPath = this.props.match.path;
        if (prevPath !== currentPath) {
            this.setState({
                savePageMode: this.savePageMode(currentPath),
            });
        }
    }

    protected savePageMode(path: string): SAVE_PAGE_MODE {
        switch (path) {
            case AppRoute.routeData[this.appRouteBaseCRUD].create.path:
                return SAVE_PAGE_MODE.CREATE;
            case AppRoute.routeData[this.appRouteBaseCRUD].update.path:
                return SAVE_PAGE_MODE.UPDATE;
            case AppRoute.routeData[this.appRouteBaseCRUD].view.path:
                return SAVE_PAGE_MODE.VIEW;
            case AppRoute.routeData[this.appRouteBaseCRUD].copy.path:
                return SAVE_PAGE_MODE.COPY;
            default:
                return SAVE_PAGE_MODE.CREATE;
        }
    }

    /**
     * fetching entity data
     */
    protected async fetchData() {
        if (!this.entityId) return;

        try {
            const res = await this._entityService.byId(this.entityId);
            this.setState({
                fetchData: res.data.data,
                formData: this.model2Form(res.data.data),
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

    protected goToCreate() {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].create.url());
    }
    protected goToUpdate(id: string) {
        if (!this.entityId) return;
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].update.url(id));
    }
    protected goToCopy(id: string) {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].copy.url(id));
    }
    protected goToView(id: string) {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].view.url(id));
    }
    protected goToManage() {
        this.navigate(AppRoute.routeData[this.appRouteBaseCRUD].manage.url());
    }

    protected abstract form2CreateModel(form: any): EntityModelCreate;
    protected abstract form2UpdateModel(form: any): EntityModelUpdate;
    protected abstract model2Form(data: EntityModel): any;

    protected async create(formikProps: FormikProps<any>, goBack?: boolean) {
        this.setState({ actionBtnLoading: true });
        try {
            await this._entityService.create(
                this.form2CreateModel(formikProps.values)
            );
            this.setState({ actionBtnLoading: false });
            formikProps.handleReset();
            if (goBack) {
                this.goToManage();
            }
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'create_error' },
            });
        }
    }

    protected async update(formikProps: FormikProps<any>) {
        if (!this.entityId) return;
        this.setState({ actionBtnLoading: true });
        try {
            await this._entityService.update(
                this.form2UpdateModel(formikProps.values),
                this.entityId
            );
            this.setState({ actionBtnLoading: false });
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'update_error' },
            });
        }
    }

    protected abstract saveFormBodyRender(
        formikProps: FormikProps<any>
    ): JSX.Element;

    protected actionBtnRender(formikProps: FormikProps<any>): JSX.Element {
        if (this.state.actionBtnVisibility === false) return <></>;
        if (this.state.savePageMode === SAVE_PAGE_MODE.VIEW) return <></>;

        const { isValid, dirty } = formikProps;

        return (
            <div className="col-md-12  sticky-top ">
                <div className="row custom-header">
                    <div className="col-md-6 col-sm-6 col-12 p-0">
                        <h3 className="font-weight-bold d-sm-block d-flex justify-content-center">
                            {`${this.state.savePageMode}`}
                        </h3>
                    </div>
                    <div className="d-flex flex-row-reverse col-md-6 col-sm-6 col-12 justify-content-sm-start  justify-content-center ">
                        {this.state.savePageMode !== SAVE_PAGE_MODE.UPDATE && (
                            <>
                                <BtnLoader
                                    loading={this.state.actionBtnLoading}
                                    btnClassName={
                                        'btn z-btn-primary font-weight-bold'
                                    }
                                    disabled={!isValid || !dirty}
                                    onClick={() =>
                                        this.create(formikProps, true)
                                    }
                                >
                                    {' '}
                                    {Localization.save}
                                </BtnLoader>

                                <BtnLoader
                                    loading={this.state.actionBtnLoading}
                                    btnClassName={
                                        'btn z-btn-light font-weight-bold mr-1'
                                    }
                                    disabled={!isValid || !dirty}
                                    onClick={() => this.create(formikProps)}
                                >
                                    {' '}
                                    {Localization.save_and_new}
                                </BtnLoader>
                            </>
                        )}

                        {this.state.savePageMode === SAVE_PAGE_MODE.UPDATE && (
                            <BtnLoader
                                loading={this.state.actionBtnLoading}
                                btnClassName={'btn z-btn-primary mr-1'}
                                disabled={!isValid || !dirty}
                                onClick={() => this.update(formikProps)}
                            >
                                {' '}
                                {Localization.edit}
                            </BtnLoader>
                        )}

                        <button
                            className="btn z-btn-light font-weight-bold mr-1"
                            onClick={() => this.goToManage()}
                        >
                            {Localization.cancel}
                        </button>

                        {/* <button
                            className="btn z-btn-light font-weight-bold mr-1"
                            onClick={() => handleReset()}
                        >
                            {Localization.cancel}
                        </button> */}
                    </div>
                </div>
            </div>
        );
    }

    protected saveFormRender() {
        return (
            <div className="template-box animated fadeInDown min-h-150px ">
                <Formik
                    initialValues={this.state.formData}
                    onSubmit={() => {}}
                    validationSchema={this.formValidation}
                    enableReinitialize
                >
                    {(formikProps) => (
                        <div className="row">
                            {this.actionBtnRender(formikProps)}
                            <div className="col-12 p-sm-4  p-2 pt-4">
                                {/* <h4 className="font-weight-bold">
                                    Information
                                    </h4> */}
                            </div>
                            <div className="container-lg">
                                {this.saveFormBodyRender(formikProps)}
                            </div>
                        </div>
                    )}
                </Formik>

                {/* <ContentLoader show={this.state.formLoader} gutterClassName="gutter-0" /> */}
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
