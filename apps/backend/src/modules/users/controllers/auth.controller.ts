import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {

    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }
}