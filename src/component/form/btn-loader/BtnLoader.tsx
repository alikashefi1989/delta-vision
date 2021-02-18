import React, { ButtonHTMLAttributes } from 'react';

interface IProps {
    btnClassName: string;
    loading: boolean;
    as: 'button' | 'div';
    onClick: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => any;
    disabled: boolean;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}
interface IState { }

class BtnLoader extends React.Component<IProps, IState> {
    static defaultProps/* : IProps */ = {
        as: 'button',
        disabled: false
    };

    render() {
        return (
            <this.props.as
                className={this.props.btnClassName}
                onClick={this.props.onClick}
                disabled={this.props.loading || this.props.disabled}
                type={this.props.type}
            >
                {
                    (() => {
                        switch (this.props.loading) {
                            case true:
                                return <i className="fa fa-spinner fa-spin"></i>
                            default:
                                return this.props.children
                        }
                    })()
                }
            </this.props.as>
        )
    }
}

export { BtnLoader }