import { UserService } from "../services/user.service";
import { Request, Response } from "express";

export class UserController {

    private service: UserService;

    constructor() {
        this.service = new UserService();
    }
}