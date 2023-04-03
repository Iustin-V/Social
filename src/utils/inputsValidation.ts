const errors = {
    mininumLengthName: "Name is too short or empty!",
    containingNumbers: "Name must not contain a number!",
    incorrectEmail: "Invalid email!",
    invalidPhone: "Invalid phone number!",
    mininumLengthMessage: "Message is too short or empty!",
    mininumLengthPassword:"Password must contain minimum 8 characters!",
    passwordUnmatch:"Passwords do not match"
};

const emailRegex = /\S+@\S+\.\S+/;
const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const nameValidation = (name: string) => {
    if (name.length < 3) {
        return errors.mininumLengthName;
    }
    if (/\d/.test(name)) {
        return errors.containingNumbers;
    }
    return "";
};

export const emailValidation = (email: string) => {
    if (!emailRegex.test(email)) {
        return errors.incorrectEmail;
    }
    return "";
};
export const phoneValidation = (phoneNumber: string) => {
    if (!phoneRegex.test(phoneNumber)) {
        return errors.invalidPhone;
    }
    return "";
};
export const messageValidation = (message: string) => {
    if (message.length < 3) {
        return errors.mininumLengthMessage;
    }
    return "";
};
export const passwordValidation = (password: string) => {
    if (password.length < 8) {
        return errors.mininumLengthPassword;
    }
    return "";
};

export const passwordConfirmationValidation = (message: string,password:string) => {
    if (message !== password) {
        return errors.passwordUnmatch;
    }
    return "";
};
