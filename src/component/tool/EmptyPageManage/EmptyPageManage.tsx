import React from 'react';

interface IProps {
    lifeCycleImageUrl: string;
    onCreateClicked: () => any;
    createBtnText: string;
    titleText: string;
    caption: JSX.Element;
}

export class EmptyPageManage extends React.Component<IProps> {
    private emptyImage() {
        return (
            <img
                className="main-image"
                src={this.props.lifeCycleImageUrl}
                alt="life cycle"
            />
        );
    }

    render() {
        return (
            <div className="manage-empty-page-wrapper text-center">
                <h4 className="title text-capitalize font-weight-bold">
                    {this.props.titleText}
                </h4>
                {this.emptyImage()}
                <div
                    className="btn btn-create text-uppercase"
                    onClick={() => this.props.onCreateClicked()}
                >
                    {this.props.createBtnText}
                </div>

                <hr className="divider mb-5" />

                {this.props.caption}
            </div>
        );
    }
}
