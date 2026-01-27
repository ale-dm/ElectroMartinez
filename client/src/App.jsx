import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { loadUser } from './data/reducers/auth';
import store from './data/store';
import setAuthToken from './helpers/setAuthToken';
import AppRoutes from './routes';
import 'react-toastify/dist/ReactToastify.css';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

function App() {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <AppRoutes />
        </Provider>
    );
}

export default App;

