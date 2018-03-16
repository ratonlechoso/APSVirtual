export class User {
    constructor(
        public id: number = Math.floor(Math.random() * 10000),
        public _id: number = Math.floor(Math.random() * 10000),
        public first_name: string = "",
        public last_name: string = "",
        public email: string = "",
        public password: string = "",
        public avatar: string = "",
        public signupDate: String = "",
        public lastLogin: String = "",
        public editable: boolean = false,
        public roles: String = "", 
        public rol_id: number = 0,
        public pendiente: number = 0
    )  {}
}
