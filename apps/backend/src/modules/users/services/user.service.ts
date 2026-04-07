import { UserRepository } from "../repositories/user.repository";

export class UserService {

    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }
}