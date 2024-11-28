export const getErrorMessage = (error: any): string => {
    if (error.response) {
        // Если есть ответ от сервера
        const { data } = error.response;
        
        // Проверяем различные форматы ошибок
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
            // Если есть массив ошибок валидации
            if (Array.isArray(data.errors)) {
                return data.errors[0];
            }
            
            // Если ошибки в объекте
            const firstError = Object.values(data.errors)[0];
            if (Array.isArray(firstError)) {
                return firstError[0];
            }
            return String(firstError);
        }
    }
    
    // Если есть сообщение в самой ошибке
    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred';
}; 