import GoTrue from 'gotrue-js';

const auth = new GoTrue({
    APIUrl: 'YOUR_GOTRUE_API_URL',
    audience: '',
    setCookie: false,
});

export const signUp = async (email, password) => {
    try {
        const response = await auth.signup(email, password);
        return {
            user: response.user,
            session: response.session,
            message: 'Sign up successful',
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const signIn = async (email, password) => {
    try {
        const response = await auth.login(email, password);
        return {
            user: response.user,
            session: response.session,
            message: 'Sign in successful',
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const signOut = async () => {
    try {
        await auth.currentUser().logout();
        return { message: 'Sign out successful' };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getCurrentUser = () => {
    return auth.currentUser();
};

export const isAuthenticated = () => {
    return !!auth.currentUser();
};