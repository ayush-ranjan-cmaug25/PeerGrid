import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = 'PeerGrid';

        switch (path) {
            case '/':
            case '/landing':
                title = 'PeerGrid - Home';
                break;
            case '/login':
                title = 'PeerGrid - Login';
                break;
            case '/register':
                title = 'PeerGrid - Register';
                break;
            case '/dashboard':
                title = 'PeerGrid - Dashboard';
                break;
            case '/admin-dashboard':
                title = 'PeerGrid - Admin Dashboard';
                break;
            case '/find-peer':
                title = 'PeerGrid - Find Peer';
                break;
            case '/doubt-board':
                title = 'PeerGrid - Doubt Board';
                break;
            case '/user-profile':
                title = 'PeerGrid - Profile';
                break;
            case '/feedback':
                title = 'PeerGrid - Feedback';
                break;
            default:
                title = 'PeerGrid';
        }

        document.title = title;
    }, [location]);

    return null;
};

export default PageTitleUpdater;
