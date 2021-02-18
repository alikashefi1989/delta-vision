import React, { Fragment } from 'react';
import { Localization } from '../../../config/localization/localization';
import { TIMELINE_ACTIONS } from '../../../enum/timeline-actions.enum';
import { ITimeLine, ITimeLineItem } from '../../../model/timeLine.model';
import { TimeLineService } from '../../../service/timeLine.service';

interface ITimeLineModified extends ITimeLine {
    day: number
}

interface IProps {
    entityName: string;
    entityId: string;
}

interface IState {
    limit: number;
    page: number;
    data: Array<ITimeLineModified>;
    requestLoader: boolean;
    lastRequestLenght: number | undefined;
    requestErrorCounter: number;
}

export default class AppTimeLine extends React.Component<IProps, IState>{
    state: IState = {
        limit: 10,
        page: 0,
        data: [],
        requestLoader: false,
        lastRequestLenght: undefined,
        requestErrorCounter: 0,
    };

    componentDidMount() {
        this.fetchTimeLine(true);
    }

    private infiniteScrollHandler() {
        if (document.getElementById("TIME_LINE_SCROLL_WRAPPER") !== null) {
            if ((document.getElementById("TIME_LINE_SCROLL_WRAPPER")!.scrollHeight -
                (document.getElementById("TIME_LINE_SCROLL_WRAPPER")!.clientHeight + 5)) <=
                document.getElementById("TIME_LINE_SCROLL_WRAPPER")!.scrollTop) {
                this.fetchTimeLine(false);
            }
        }
    }

    private timeLineService = new TimeLineService();

    private async fetchTimeLine(isInitialRequest: boolean) {
        if (this.state.requestLoader === true) return;
        if (typeof this.state.lastRequestLenght === 'number' && this.state.lastRequestLenght < this.state.limit) return;
        this.setState({ ...this.state, requestLoader: true });
        try {
            const res = await this.timeLineService.search({
                pagination: {
                    page: this.state.page,
                    limit: this.state.limit,
                },
                filter: {
                    entityName: this.props.entityName,
                    entityId: this.props.entityId,
                },
            });
            this.stateSetter(res.data.data.items, isInitialRequest);
        } catch (error) {
            this.setState({
                ...this.state,
                requestLoader: false,
                lastRequestLenght: undefined,
                requestErrorCounter: (this.state.requestErrorCounter + 1)
            }, () => this.requestManageAfterError(isInitialRequest));
        }
    }

    stateSetter(newData: Array<ITimeLine>, isInitialRequest: boolean) {
        let data: Array<ITimeLineModified> = this.state.data;
        let updatedData: Array<ITimeLineModified> = [...data, ...this.convertServiceDataToStateData(newData)];
        this.setState({
            ...this.state,
            data: updatedData,
            page: (this.state.page + 1),
            requestLoader: false,
            lastRequestLenght: newData.length,
            requestErrorCounter: 0,
        }, () => this.initialScrollHandler(isInitialRequest));
    }

    initialScrollHandler(isInitialRequest: boolean) {
        if (isInitialRequest === true) {
            if (document.getElementById("TIME_LINE_SCROLL_WRAPPER") !== null) {
                if (document.getElementById("TIME_LINE_SCROLL_WRAPPER")!.scrollHeight <= (document.getElementById("TIME_LINE_SCROLL_WRAPPER")!.clientHeight + 2)) {
                    this.fetchTimeLine(isInitialRequest);
                }
            }
        }
    }

    requestManageAfterError(isInitialRequest: boolean) {
        if (this.state.requestErrorCounter <= 3) {
            setTimeout(() => {
                this.fetchTimeLine(isInitialRequest);
            }, 1000);
        } else {
            return;
        }
    }

    actionIconReturner(action: TIMELINE_ACTIONS | string): string { // TODO: replace external function
        switch (action) {
            case TIMELINE_ACTIONS.LOGIN:
                return 'timeline-login';
            case TIMELINE_ACTIONS.LOGOUT:
                return 'timeline-logout';
            case TIMELINE_ACTIONS.CHANGE_PASSWORD:
                return 'timeline-change-password';
            case TIMELINE_ACTIONS.EMAIL:
                return 'timeline-undefined-icon';  // svg of this action undefined
            case TIMELINE_ACTIONS.CREATE:
                return 'timeline-create';
            case TIMELINE_ACTIONS.UPDATE:
                return 'timeline-update';
            case TIMELINE_ACTIONS.DELETE:
                return 'timeline-delete';
            case TIMELINE_ACTIONS.PAYMENT:
                return 'timeline-payment';
            case TIMELINE_ACTIONS.REGISTER_ORDER:
                return 'timeline-register-order';
            case TIMELINE_ACTIONS.ORDER_RECEIVE:
                return 'timeline-order-receive';
            case TIMELINE_ACTIONS.ORDER_RETURN:
                return 'timeline-order-return';
            case TIMELINE_ACTIONS.COUPON_USED:
                return 'timeline-coupon-used';
            default:
                return 'timeline-undefined-icon';
        };
    }

    actionTextReturner(action: TIMELINE_ACTIONS | string): string { // TODO: replace external function
        switch (action) {
            case TIMELINE_ACTIONS.LOGIN:
                return 'logged in';
            case TIMELINE_ACTIONS.LOGOUT:
                return 'logged out';
            case TIMELINE_ACTIONS.CHANGE_PASSWORD:
                return 'changed password';
            case TIMELINE_ACTIONS.EMAIL:
                return 'email';
            case TIMELINE_ACTIONS.CREATE:
                return 'created';
            case TIMELINE_ACTIONS.UPDATE:
                return 'updated';
            case TIMELINE_ACTIONS.DELETE:
                return 'deleted';
            case TIMELINE_ACTIONS.PAYMENT:
                return 'paid';
            case TIMELINE_ACTIONS.REGISTER_ORDER:
                return 'registered order';
            case TIMELINE_ACTIONS.ORDER_RECEIVE:
                return 'order received';
            case TIMELINE_ACTIONS.ORDER_RETURN:
                return 'order returned';
            case TIMELINE_ACTIONS.COUPON_USED:
                return 'coupon used';
            default:
                return 'changed';
        };
    }

    private convertServiceDataToStateData(data: Array<ITimeLine>): Array<ITimeLineModified> {
        let convertedData: Array<ITimeLineModified> = data.map((item: ITimeLine) => {
            return {
                ...item,
                day: this.date(item.createdAt)
            };
        });
        return convertedData;
    };

    private date(timestamp: number): number {
        let humanDate: Date = new Date(timestamp);
        let date: number = humanDate.getDate();
        return date;
    };

    private date_MM_DD_YYYY_FormatCreator(timestamp: number): string {
        let date: Date = new Date(timestamp);
        let stringDate: string = date.toString();
        let words: Array<string> = stringDate.split(' ');
        let fullDate: string = words[1] + ' ' + words[2] + ', ' + words[3];
        return fullDate;
    }

    private hourMinuteFormatCreator(timestamp: number): string {
        let date: Date = new Date(timestamp);
        let hh: number = date.getHours();
        let afterTime: string = hh >= 12 ? 'PM' : 'AM';
        let HH: number = hh > 12 ? (hh - 12) : hh;
        let HHString: string = HH >= 10 ? HH.toString() : ('0' + HH.toString());
        let MM: number = date.getMinutes();
        let MMString: string = MM >= 10 ? MM.toString() : ('0' + MM.toString());
        let fullTime: string = HHString + ':' + MMString + ' ' + afterTime;
        return fullTime;
    }

    private renderHeaderForItem(i: number, currentItemDay: number, previousItemDay?: number): boolean {
        if (i === 0 || typeof previousItemDay === 'undefined') {
            return true;
        } else {
            if (currentItemDay === previousItemDay) {
                return false;
            } else {
                return true;
            }
        }
    }

    private timeLineItemChangedList(list: ITimeLineModified['fields'], action: string): Array<JSX.Element> | undefined {
        if (list === undefined) return undefined
        return list.map((item: ITimeLineItem, i: number) => {
            return <Fragment key={i}>
                <div className='timeline-item-changed-item'>
                    <span className='changed-field'>{`${item.name} `}</span>
                    {Localization.was}
                    <span className='changed-action'>{` ${this.actionTextReturner(action)} `}</span>
                    {Localization.from}
                    <span className='item-prev-value'>
                        {
                            (item.from === undefined || item.from === null)
                                ?
                                ' blank value '
                                :
                                ` ${item.from} `
                        }
                    </span>
                    {Localization.to}
                    <span className='item-current-value'>
                        {
                            (item.to === undefined || item.to === null)
                                ?
                                ' blank value '
                                :
                                ` ${item.to}`
                        }
                    </span>
                </div>
            </Fragment>
        })
    }

    private timeLineItemsRender(items: Array<ITimeLineModified>): Array<JSX.Element> {
        return items.map((item: ITimeLineModified, i: number) => {
            return <Fragment key={i}>
                {
                    this.renderHeaderForItem(i, item.day, (i === 0 ? undefined : items[i - 1].day)) === true
                        ?
                        <>
                            <li className={i === 0 ? 'timeline-date-header-wrapper d-block ignore-before' : 'timeline-date-header-wrapper d-block'}>
                                <div className="timeline-date-header d-inline-block">
                                    {this.date_MM_DD_YYYY_FormatCreator(item.createdAt)}
                                </div>
                            </li>
                            <li className='timeline-item d-block'>
                                <div className="timeline-item-hour">
                                    {this.hourMinuteFormatCreator(item.createdAt)}
                                </div>
                                <div className={"timeline-item-icon " + this.actionIconReturner(item.action)}></div>
                                <div className="timeline-item-changed-list">
                                    <div className="timeline-item-title">
                                        <span className="title">{item.title}</span>
                                        {
                                            item.description
                                                ?
                                                <>
                                                    <span className='seprator'> - </span>
                                                    <span className='description'>{item.description}</span>
                                                </>
                                                :
                                                undefined
                                        }
                                    </div>
                                    {
                                        this.timeLineItemChangedList(item.fields, item.action)
                                    }
                                    {
                                        (
                                            item.createdBy &&
                                            item.createdBy.name &&
                                            typeof item.createdBy.name === 'string' &&
                                            item.createdBy.name !== ''
                                        )
                                            ?
                                            <div className="timeline-item-creator">
                                                {Localization.by}
                                                {` ${item.createdBy.name} `}
                                                {this.date_MM_DD_YYYY_FormatCreator(item.createdAt)}
                                            </div>
                                            :
                                            undefined
                                    }
                                </div>
                            </li>
                        </>
                        :
                        <>
                            <li className='timeline-item d-block'>
                                <div className="timeline-item-hour">
                                    {this.hourMinuteFormatCreator(item.createdAt)}
                                </div>
                                <div className={"timeline-item-icon " + this.actionIconReturner(item.action)}></div>
                                <div className="timeline-item-changed-list">
                                    <div className="timeline-item-title">
                                        <span className="title">{item.title}</span>
                                        {
                                            item.description
                                                ?
                                                <>
                                                    <span className='seprator'> - </span>
                                                    <span className='description'>{item.description}</span>
                                                </>
                                                :
                                                undefined
                                        }
                                    </div>
                                    {
                                        this.timeLineItemChangedList(item.fields, item.action)
                                    }
                                    {
                                        (
                                            item.createdBy &&
                                            item.createdBy.name &&
                                            typeof item.createdBy.name === 'string' &&
                                            item.createdBy.name !== ''
                                        )
                                            ?
                                            <div className="timeline-item-creator">
                                                {Localization.by}
                                                {` ${item.createdBy.name} `}
                                                {this.date_MM_DD_YYYY_FormatCreator(item.createdAt)}
                                            </div>
                                            :
                                            undefined
                                    }
                                </div>
                            </li>
                        </>
                }
            </Fragment>
        })
    }

    render() {
        return (
            <div className='timeline-list-scroll-wrapper' >
                <ul onScroll={() => this.infiniteScrollHandler()} id='TIME_LINE_SCROLL_WRAPPER' className='timeline-list-wrapper thin-scroll'>
                    <div className="timeline-list-title">history</div>
                    {
                        this.timeLineItemsRender(this.state.data)
                    }
                </ul>
            </div>
        )
    }
}