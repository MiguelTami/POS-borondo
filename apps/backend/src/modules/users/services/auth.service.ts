import { UserRepository } from "../repositories/user.repository";

export class AuthService {

    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }
}