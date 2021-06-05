import React from 'react';
import ReactDOM from 'react-dom';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import 'react-pro-sidebar/dist/css/styles.css';
import './asset/style/app/skin-default/style.scss';
import { App } from './component/app/App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { persistor, Store2 } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
// import TopBarProgress from 'react-topbar-progress-indicator';
// import { appColor, APP_COLOR_NAME } from './config/appColor';
// import * as Sentry from '@sentry/react';
// import { Integrations } from '@sentry/tracing';

// Sentry.init({
//     dsn: 'https://ee3c511e61a643c39993d485026e4396@sentry.---.com/8',
//     integrations: [new Integrations.BrowserTracing()],
//     tracesSampleRate: 1.0,
// });

// TopBarProgress.config({
//     // barColors: {
//     //   "0": "#fff",
//     //   "1.0": "#fff"
//     // },
//     // barColors: {
//     //     "0": "#f00",
//     //     "0.5": "#0f0",
//     //     "1.0": "#00f",
//     // },
//     // barColors: {
//     //     0: appColor(APP_COLOR_NAME.PRIMARY),
//     //     1: appColor(APP_COLOR_NAME.PRIMARY)
//     // },
//     // barColors: { 0: appColor(APP_COLOR_NAME.ORANGE), 1: appColor(APP_COLOR_NAME.ORANGE) },
//     barColors: {
//         0: appColor(APP_COLOR_NAME.ORANGE),
//         0.28: appColor(APP_COLOR_NAME.ORANGE),
//         0.3: '#fff',
//         0.32: appColor(APP_COLOR_NAME.ORANGE),
//         0.58: appColor(APP_COLOR_NAME.ORANGE),
//         0.6: '#fff',
//         0.62: appColor(APP_COLOR_NAME.ORANGE),
//         0.88: appColor(APP_COLOR_NAME.ORANGE),
//         0.9: '#fff',
//         0.92: appColor(APP_COLOR_NAME.ORANGE),
//         1: appColor(APP_COLOR_NAME.ORANGE),
//     },
//     // shadowBlur: 15,
//     barThickness: 2,
// });

ReactDOM.render(
    // <React.StrictMode>
    <Provider store={Store2}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    // </React.StrictMode>
    document.getElementById('content')
);

serviceWorker.unregister();
