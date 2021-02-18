import React from 'react';
import { eventContext } from './StatusContext';
import Step from './Step';
import { IStep } from './Step.interface';

interface IProps {
    steps: IStep[];
    onStatusChanged: (e: IStep) => void;
}

class StatusMultiStep extends React.Component<IProps> {
    render() {
        return (
            <eventContext.Provider value={this.props.onStatusChanged}>
                <div className="d-flex align-items-center">
                    {this.props.steps.map((step, index) => (
                        <Step step={step} key={index} />
                    ))}
                </div>
            </eventContext.Provider>
        );
    }
}

export default StatusMultiStep;
