import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Setup } from '../../../../config/setup';
import TopBarProgress from 'react-topbar-progress-indicator';
import { ISku } from '../../../../model/sku.model';
import { SkuService } from '../../../../service/sku.service';
import { Utility } from '../../../../asset/script/utility';
import { Store2 } from '../../../../redux/store';

export interface ISkuPickerValue {
    sku: ISku;
    count: number;
}

interface IProps {
    show: boolean;
    onHide: () => any;
    onConfirm: (v: Array<ISkuPickerValue>) => any;
    value: Array<ISkuPickerValue>;
    defaultFilter?: Object;
}

interface IState {
    value: Array<ISkuPickerValue>;
    data: Array<ISku>;
    gridSearch: string;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
    gridLoading: boolean;
}

export class SkuPicker extends React.Component<IProps, IState> {
    state = {
        value: this.props.value,
        data: [],
        gridSearch: '',
        pagination: {
            page: 0,
            limit: Setup.recordDefaultLoadLength,
            total: 0,
        },
        gridLoading: false,
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps: IProps) {
        if (
            JSON.stringify(this.props.value) !==
                JSON.stringify(prevProps.value) &&
            JSON.stringify(this.props.value) !==
                JSON.stringify(this.state.value)
        ) {
            debugger;
            this.setState({
                value: this.props.value,
            });
        } else if (this.props.show === true && prevProps.show === false) {
        }
    }

    private async onGridSearch(searchText: string) {
        this.setState(
            {
                gridSearch: searchText,
                pagination: { ...this.state.pagination, page: 0 },
                data: [],
            },
            () => this.debounce()
        );
    }

    private setTimeoutDebounce: NodeJS.Timeout | undefined;
    private debounce() {
        if (this.setTimeoutDebounce) clearTimeout(this.setTimeoutDebounce);
        this.setTimeoutDebounce = setTimeout(() => {
            this.fetchData();
        }, 500);
    }

    private filter() {
        let filter = {};
        if (this.state.gridSearch) {
            filter = {
                // readableId: { $regex: `${this.state.gridSearch}`, $options: 'i' }, // sku
                readableId: parseInt(this.state.gridSearch),
            };
            if (
                this.props.defaultFilter &&
                Object.keys(this.props.defaultFilter).length
            ) {
                filter = { $and: [filter, this.props.defaultFilter] };
            }
        } else if (
            this.props.defaultFilter &&
            Object.keys(this.props.defaultFilter).length
        ) {
            filter = this.props.defaultFilter;
        }
        return filter;
    }

    private async fetchData() {
        try {
            const res = await new SkuService().search({
                filter: this.filter(),
                pagination: {
                    page: this.state.pagination.page,
                    limit: this.state.pagination.limit,
                },
            });
            this.setState({
                data: [...this.state.data, ...res.data.data.items],
                pagination: {
                    ...this.state.pagination,
                    total: res.data.data.explain.pagination.total,
                },
                gridLoading: false,
            });
        } catch (e) {
            this.setState({ gridLoading: false });
        }
    }

    private hideModal() {
        this.props.onHide();
    }
    private onConfirm() {
        this.props.onConfirm(this.state.value);
    }

    private loadMore() {
        const currentPage = this.state.pagination.page;
        const total = this.state.pagination.total;
        const limit = this.state.pagination.limit;
        const dataLength = this.state.data.length;
        if (currentPage * limit + dataLength >= total) return;
        if (this.state.gridLoading) return;

        this.setState(
            {
                pagination: { ...this.state.pagination, page: currentPage + 1 },
                gridLoading: true,
            },
            () => this.fetchData()
        );
    }

    private isSelected(sku: ISku) {
        const v = this.state.value;
        const found = v.find((item) => item.sku.id === sku.id);
        return found;
    }

    private onSkuClick(sku: ISku) {
        if (this.isSelected(sku)) return;
        this.setState({ value: [...this.state.value, { sku, count: 1 }] });
    }
    private removeFromSelectedList(index: number) {
        const selected = [...this.state.value];
        selected.splice(index, 1);
        this.setState({ value: [...selected] });
    }
    private infinitScrollObserver: any = React.createRef();
    private refCallback = (node: any) => {
        if (this.infinitScrollObserver.current)
            this.infinitScrollObserver.current.disconnect();
        this.infinitScrollObserver.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) this.loadMore();
            }
        );
        if (node) this.infinitScrollObserver.current.observe(node);
    };

    private searchRender() {
        return (
            <div className="search-wrapper input-group pr-md-3">
                <div className="search-icon-container input-group-prepend">
                    <span className="search-icon-wrapper input-group-text">
                        <span className="search-icon"></span>
                    </span>
                </div>
                <input
                    type="number"
                    className="search-input form-control"
                    value={this.state.gridSearch}
                    onChange={(e) => {
                        this.onGridSearch(e.currentTarget.value);
                    }}
                    placeholder="Type to search"
                />
            </div>
        );
    }
    private skuPickerHeaderRender() {
        return (
            <div className="header-wrapper">
                <div className="row">
                    <div className="col-12">
                        <h3 className="font-weight-bold">Add Products</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-4 pr-md-3">
                        {this.searchRender()}
                    </div>
                    <div className="col-md-6 mb-4 ml-md-n3">
                        <h3 className="d-inline-block mb-0 font-weight-400">
                            Selected Items
                        </h3>
                        <div className="selected-items-count ml-3">
                            {this.state.value.length}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    private productName(item: ISku): string {
        const name = item.product.name;
        if (name) {
            const defaultLangCode =
                Store2.getState().language.defaultLanguage?.identifier || '';
            return name[defaultLangCode];
        }
        return '';
    }
    private skuItemRender(item: ISku) {
        return (
            <div className="sku-item-wrapper">
                <div className="img-holder">
                    <img src={item.medias[0]?.url} className="sku-img" alt="" />
                </div>
                <div className="detail">
                    <div className="product text-capitalize">
                        {this.productName(item)}
                    </div>
                    <div className="readable-id">{item.readableId}</div>
                    <div className="price">
                        {typeof item.price?.originalPrice === 'number'
                            ? Utility.prettifyNumber(item.price.originalPrice)
                            : ''}
                    </div>
                </div>
            </div>
        );
    }
    private fetchedDataListRender() {
        return (
            <div className="fetched-data-list-wrapper thin-scroll">
                {this.state.data.map((item: ISku, index) => {
                    return (
                        <div
                            key={item.id}
                            className="item-wrapper cursor-pointer"
                            onClick={() => {
                                this.onSkuClick(item);
                            }}
                            ref={
                                this.state.data.length === index + 1
                                    ? this.refCallback
                                    : undefined
                            }
                        >
                            {this.skuItemRender(item)}
                            <div className="is-selected-wrapper">
                                <i
                                    className={`icon fa ${
                                        this.isSelected(item)
                                            ? 'selected fa-check-circle'
                                            : 'fa-circle-o'
                                    } `}
                                ></i>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    private selectedItemAction(index: number, count: number) {
        const decreaseDisable = count === 1;
        const selectedList = [...this.state.value];
        return (
            <div className="selected-item-action-wrapper">
                <div className="change-count-btn-group btn-group btn-group-sm mr-3">
                    <button
                        type="button"
                        className="btn btn-decrease"
                        disabled={decreaseDisable}
                        onClick={() => {
                            if (decreaseDisable) return;
                            const row = selectedList[index];
                            row.count = row.count - 1;
                            this.setState({ value: selectedList });
                        }}
                    >
                        <i className="fa fa-minus"></i>
                    </button>
                    <button type="button" className="btn btn-count">
                        {count}
                    </button>
                    <button
                        type="button"
                        className="btn btn-increase"
                        onClick={() => {
                            const row = selectedList[index];
                            row.count = row.count + 1;
                            this.setState({ value: selectedList });
                        }}
                    >
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                <i
                    className="remove-item fa fa-times-circle cursor-pointer"
                    onClick={() => this.removeFromSelectedList(index)}
                ></i>
            </div>
        );
    }
    private selectedDataListRender() {
        return (
            <div className="selected-data-list-wrapper thin-scroll ml-md-n3">
                {this.state.value.map((item, index) => {
                    return (
                        <div key={item.sku.id} className="item-wrapper">
                            {this.skuItemRender(item.sku)}
                            {this.selectedItemAction(index, item.count)}
                        </div>
                    );
                })}
            </div>
        );
    }
    private actionBtnRender() {
        return (
            <div className="action-buttons-wrapper mt-2">
                <div
                    className="confirm-btn btn btn-lg text-capitalize mr-2"
                    onClick={() => this.onConfirm()}
                >
                    add item
                </div>
                <div
                    className="cancel-btn btn btn-lg text-capitalize"
                    onClick={() => this.hideModal()}
                >
                    cancel
                </div>
            </div>
        );
    }
    private skuPickerBodyRender() {
        return (
            <>
                <div className="row">
                    <div className="col-md-6">
                        {this.fetchedDataListRender()}
                    </div>
                    <div className="col-md-6 pl-md-0">
                        {this.selectedDataListRender()}
                        {this.actionBtnRender()}
                    </div>
                </div>
            </>
        );
    }

    modalRender() {
        return (
            <>
                <Modal
                    size="xl"
                    show={this.props.show}
                    onHide={() => this.hideModal()}
                >
                    <Modal.Body className="app-sku-picker-modal p-0">
                        {this.skuPickerHeaderRender()}
                        <hr className="my-0" />
                        {this.skuPickerBodyRender()}
                    </Modal.Body>
                </Modal>
                {this.state.gridLoading && <TopBarProgress />}
            </>
        );
    }

    render() {
        return <>{this.modalRender()}</>;
    }
}
