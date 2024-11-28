export const getErrorMessage = (error: any): string => {
    if (error.response) {
        const { data } = error.response;
        
        if (typeof data === 'string') {
            return data;
        }
        
        if (data.title) {
            return data.title;
        }

        if (data.message) {
            return data.message;
        }

        if (data.errors) {
            if (Array.isArray(data.errors)) {
                return data.errors[0];
            }
            
            const firstError = Object.values(data.errors)[0];
            if (Array.isArray(firstError)) {
                return firstError[0];
            }
            return String(firstError);
        }
    }
    
    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred';
}; 