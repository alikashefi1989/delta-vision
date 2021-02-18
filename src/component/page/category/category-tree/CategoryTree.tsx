import React, { Fragment } from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { ICategory } from '../../../../model/category.model';
import { CategoryService } from '../../../../service/category.service';
import { Accordion, OverlayTrigger, Popover, Spinner } from 'react-bootstrap';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { CmpUtility } from '../../../_base/CmpUtility';

interface IState {
    data: Array<ICategory>;
    dataFetchHasError: boolean;
    fetchLoader: boolean;
}
interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
    callBackView: (id: string) => void;
    callBackCopy: (id: string) => void;
    callBackUpdate: (id: string) => void;
}

class CategoryTreeComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        data: [],
        dataFetchHasError: false,
        fetchLoader: false,
    };

    private _categoryService = new CategoryService();

    componentDidMount() {
        this.fetchData();
    }

    private async fetchData() {
        this.setState({ ...this.state, fetchLoader: true });
        try {
            const res = await this._categoryService.getCategoryTree();
            this.setState({
                ...this.state,
                data: res.data.data.tree,
                dataFetchHasError: false,
                fetchLoader: false,
            });
        } catch (e) {
            this.setState({
                ...this.state,
                dataFetchHasError: true,
                fetchLoader: false,
            });
        }
    }

    dataRender(data: Array<ICategory>): JSX.Element {
        if (data.length === 0) {
            return <></>
        } else {
            return <div className='app-tree'>
                <div className="tree">
                    <ul>
                        <li>
                            <span>{Localization.category_manage}</span>
                            <ul>
                                {this.treeGenerator(data)}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        }
    }

    treeGenerator(data: Array<ICategory>) {
        const defaultLangCode = this.props.language.defaultLanguage?.identifier;
        return <>
            {
                data.map((item: ICategory, i: number) => {
                    return <Fragment key={i}>
                        {
                            (item.id && typeof item.id === 'string' && item.id !== '')
                                ?
                                <li>
                                    <span>
                                        <div className='d-inline mx-2'>
                                            {(defaultLangCode === undefined || item.name === undefined || item.name[defaultLangCode] === undefined) ? '' : item.name[defaultLangCode]}
                                        </div>
                                        {this.actionBtnsReturner(item.id)}
                                    </span>
                                    {
                                        (item.id && item.subCategories
                                            && item.subCategories.length
                                            && this.childIdChecker(item.subCategories) === true)
                                            ?
                                            <ul>
                                                {this.treeGenerator(item.subCategories)}
                                            </ul>
                                            :
                                            undefined
                                    }
                                </li>
                                :
                                undefined
                        }
                    </Fragment>
                })
            }
        </>
    }

    childIdChecker(array: Array<ICategory> | undefined): boolean {
        if (array === undefined || array.length === 0 || array === []) {
            return false
        } else {
            let oneOfChildHasId: boolean = false;
            for (let i = 0; i < array.length; i++) {
                if (typeof array[i].id === 'string' && array[i].id !== '') {
                    oneOfChildHasId = true;
                    break;
                }
            }
            return oneOfChildHasId;
        }
    }

    actionBtnsReturner(id: string): JSX.Element {
        return <>
            <OverlayTrigger
                rootClose
                trigger="click"
                placement={this.props.internationalization.rtl ? 'left' : 'right'}
                overlay={this.appGridRowActionsRender(id)}
            >
                <div className="btn btn-xs btn-light icon-only"><i className="fa fa-ellipsis-h dropdown-icon"></i></div>
            </OverlayTrigger>
        </>
    }

    private appGridRowActionsRender(id: string) {
        return <Popover id={`grid-action-menu-popover-${id}`} className="popper-action-menu-wrapper" >
            <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item list-group-item-action text-info" onClick={() => this.props.callBackView(id)}>
                        <i className="icon fa fa-eye"></i><span className="text">{Localization.view}</span>
                    </li>
                    <li className="list-group-item list-group-item-action text-primary" onClick={() => this.props.callBackUpdate(id)}>
                        <i className="icon fa fa-edit"></i><span className="text">{Localization.edit}</span>
                    </li>
                    <li className="list-group-item list-group-item-action text-system" onClick={() => this.props.callBackCopy(id)}>
                        <i className="icon fa fa-copy"></i><span className="text">{Localization.copy}</span>
                    </li>
                </ul>
            </Popover.Content>
        </Popover>
    }

    contentReturnerByFetchStatus(errorStatus: boolean, loaderStatus: boolean): JSX.Element {
        if (loaderStatus) {
            //loading
            return <div className='d-flex justify-content-center my-3'>
                <Spinner animation="grow" variant="dark" />
                <Spinner animation="grow" variant="dark" />
                <Spinner animation="grow" variant="dark" />
            </div>
        } else {
            if (errorStatus) {
                //error
                return <div className='d-flex justify-content-center my-3'>
                    <div className="d-inline-block cursor-pointer" onClick={() => this.fetchData()}>
                        <span className='text-danger'>{Localization.msg.ui.error_occurred_retry_again}</span>
                        <i className="fa fa-refresh text-danger mx-2"></i>
                    </div>
                </div >
            } else {
                //data
                return this.dataRender(this.state.data)
            }
        }
    }

    render() {
        return (
            <div className="template-box mb-3">
                <div className="row">
                    <div className="col-12">
                        <Accordion defaultActiveKey="0">
                            <div className="card border-light overflow-visible">
                                <Accordion.Toggle
                                    as={'div'}
                                    className="card-header border-bottom-0 cursor-pointer"
                                    eventKey="0"
                                >
                                    <span className="text-capitalize">{Localization.category_manage}</span>
                                </Accordion.Toggle>
                            </div>
                            <Accordion.Collapse eventKey="0">
                                <div className="card-body">
                                    {this.contentReturnerByFetchStatus(this.state.dataFetchHasError, this.state.fetchLoader)}
                                </div>
                            </Accordion.Collapse>
                        </Accordion>
                    </div>
                </div>
            </div>
        )
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language
    }
}
const dispatch2props = (dispatch: Dispatch) => { return {} }
export const CategoryTree = connect(state2props, dispatch2props)(CategoryTreeComponent);