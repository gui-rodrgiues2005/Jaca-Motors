export const checkAuth = () => {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (!token || !expiration) {
        clearAuth();
        return false;
    }

    // Verifica se o token expirou
    if (new Date().getTime() > parseInt(expiration)) {
        clearAuth();
        return false;
    }

    return true;
};

export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
};