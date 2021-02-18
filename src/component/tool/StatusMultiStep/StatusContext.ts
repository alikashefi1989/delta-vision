import React from 'react';
import { IStep } from './Step.interface';

export const eventContext = React.createContext((e: IStep) => {});
