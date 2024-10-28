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

export interface LawyersDTO {
    idLawyer?: string;
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
    statusLawyer?: string;
    idUser?: string;
    nameUser?: string;
    statusUser?: string;
}
export interface session {
    name: string;
    password: string
}

export interface Case {
    idCase?: string;
    nameCase?: string;
    descriptionCase?: string;
    dateInitCase?: string;
    dateEndCase?: string,
    statusCase?: string;
    userRegisterCase?: string;
    dateRegisterCase?: string;
    updateUserCase?: string;
    updateDateCase?: string;
    typeCase?: string;
    customer: {
        idClient?: string;
        nameClient?: string;
    }
}

export interface CaseLawyer {
    idCaseLawyer?: string;
    dateRegisterLawyer?: string;
    userRegisterLawyer?: string;
    statusLawyerCase?: string;
    idLawyer?: string;
    nameLawyer?: string;
    phoneLawyer?: string;
    emailLawyer?: string;
    idCase?: string;
    nameCase?: string;
    descriptionCase?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
export interface Document {
    id_document: string;
    urlDocument: string;
    nameDocument: string;
    typeDocument: string;
    statusDocument: string;
    userRegisterDocument: string;
    dateDocument: string;
    userUpdateDocument?: string;
    dateUpdateDocument?: string;
    nameIdCase: {
        idCase: number;
    }
}

export interface SearchResults {
    cases?: any[];
    customers?: any[];
    lawyers?: any[];
}