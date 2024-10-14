export interface User {
    id_user?: string;
    nameUser?: string;
    passwordUser?: string;
    userRegister?: string;
    dateRegister?: string;
    userUpdate?: string;
    lastUpdate?: string;
    photoUser?: string;
    statusUser?: boolean;
    rolUser?: string;
}

export interface Customers {
    id_client?: any;
    nameClient?: string;
    addressClient?: string;
    phoneClient?: string;
    emailClient?: string;
    typeClient?: string;
    userRegisterClient?: string;
    dateRegisterClient?: string;
    updateUserClient?: string;
    dateUpdateClient?: string;
    typeDocumentClient?: string;
    documentClient?: string;
    statusClient?: boolean;
    user: User
}

export interface Lawyers {
    id_lawyer?: string;
    nameLawyer?: string;
    phoneLawyer?: string;
    emailLawyer?: string;
    typeLawyer?: string;
    userRegisterLawyer?: string;
    dateRegisterLawyer?: string;
    userUpdateLawyer?: string;
    dateUpdateLawyer?: string;
    typeDocumentLawyer?: string;
    documentLawyer?: string;
    statusLawyer?: boolean;
    user: User
}