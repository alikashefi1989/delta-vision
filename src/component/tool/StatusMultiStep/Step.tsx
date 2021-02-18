import React from 'react';
import { eventContext } from './StatusContext';
import { IStep } from './Step.interface';

class Step extends React.Component<{ step: IStep }> {
    static contextType = eventContext;

    render() {
        return (
            <div
                className={
                    'step-component' +
                    (this.props.step.isActive ? ' active' : '') +
                    (this.props.step.disabled ? ' disabled' : '')
                }
                onClick={() => {
                    this.context(this.props.step);
                }}
            >
                <span className="before"></span>
                <span className="middle">{this.props.step.title}</span>
                <span className="after"></span>
            </div>
        );
    }
}

export default Step;
