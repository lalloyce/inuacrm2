import GoTrue from 'gotrue-js';

const auth = new GoTrue({
    APIUrl: 'https://inuacrm.netlify.app/.netlify/identity',
    audience: '',
    setCookie: false,
});

export const login = async (email, password) => {
    try {
        const response = await auth.login(email, password, true);
        return { success: true, user: response };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const register = async (email, password) => {
    try {
        const response = await auth.signup(email, password);
        return { success: true, user: response };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const resetPassword = async (email) => {
    try {
        await auth.requestPasswordRecovery(email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const logout = () => {
    const user = auth.currentUser();
    if (user) {
        return user.logout();
    }
    return Promise.resolve();
};