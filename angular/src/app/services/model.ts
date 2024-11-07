export interface User {
    idUser?: string;
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
    idClient?: any;
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
    photoUser? : string;
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
        documentClient?: string;
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
    documentLawyer?: string;
    idCase?: string;
    nameCase?: string;
    descriptionCase?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    singleData: string;
}
export interface Document {
  idDocument?: string;
  urlDocument?: string;
  nameDocument?: string;
  typeDocument?: string;
  statusDocument?: string;
  userRegisterDocument?: string;
  dateDocument?: string;
  userUpdateDocument?: string;
  dateUpdateDocument?: string;
  sizeDocument?: string;
  nameIdCase: {
    idCase?: String;
    nameCase?: string;
    typeCase?: string;
  };
}
export interface SearchResults {
    cases?: any[];
    customers?: any[];
    lawyers?: any[];
}

export interface CommentCase {
    idComment?: string;
    description?: string;
    dateRegister?: string;
    lastUpdate?: string;
    idCase?: string;
    nameCase?: string;
    idUser?: string;
    nameUser?: string;
    photoUser?: string;
    important?: boolean;
}

export interface Notify {
    idNotify?: string;
    descriptionNotify?: string;
    urlNotify?: string;
    typeNotify?: string;
    dateRegister?: string;
    userRegister?: string;
    idUser?: string;
    nameUser?: string;
    notify?: boolean;
}
