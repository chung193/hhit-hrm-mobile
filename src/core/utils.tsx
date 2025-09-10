export const emailValidator = (email: string) => {
    const re = /\S+@\S+\.\S+/;

    if (!email || email.length <= 0) return 'Email cannot be empty.';
    if (!re.test(email)) return 'Ooops! We need a valid email address.';

    return '';
};

export const codeValidator = (code: string) => {
    const re = /^HHIT\d+$/; // HHIT + các số phía sau

    if (!code || code.length <= 0) return 'Mã nhân viên không được để trống.';
    if (!re.test(code)) return 'Mã nhân viên phải bắt đầu bằng "HHIT" và theo sau là các số.';

    return '';
};


export const passwordValidator = (password: string) => {
    if (!password || password.length <= 0) return 'Password cannot be empty.';

    return '';
};

export const nameValidator = (name: string) => {
    if (!name || name.length <= 0) return 'Name cannot be empty.';

    return '';
};