import { Controller, Get, Req, Post, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private readonly _authService: AuthService){}
    
    @Get('user/:cell')
    async findUser(@Res() res: Response, @Req() req: Request){
        let userFound = await this._authService.getUser(req.params.cell.trim());
        return res.status(200).json({
            error: null,
            message: "user was found",
            status: true,
            data: userFound
        });
    }

    @Post('code')
    async sendPhoneCode(@Res() res: Response, @Req() req: Request){
        console.log('here u go')
        let cell = req.body.cell;
        await this._authService.sendCode(cell);
        return res.status(200).json({
            error: null,
            message: "code was sent to user",
            status: true,
            data: null
        });
    }

}