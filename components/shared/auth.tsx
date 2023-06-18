import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: any) => {
    const AuthComponent = (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const destination = router.pathname.slice(0, 7)
            const isAuthenticated: any = checkIfUserIsAuthenticated(destination);
            // If the user is not authenticated, return the login component
            if (!isAuthenticated.state) {
                router.replace(isAuthenticated.route);
            }

        }, []);
    
        // Render the wrapped component if authenticated
        return <WrappedComponent {...props} />;
    };

    const checkIfUserIsAuthenticated = (destination: string) => {
        if (typeof window !== 'undefined') {
            if (destination === '/driver') {
                const token = localStorage.getItem('didjwt')
                if (!token) {
                    return { state: false, route: '/driver/login' }
                }
            }
            if (destination === '/admin/') {
                const token = localStorage.getItem('uidjwt')
                if (!token) {
                    return { state: false, route: '/admin/login' }
                }
            }

        }
        return { state: true, route: null }
    }

    return AuthComponent;
};

export default withAuth;