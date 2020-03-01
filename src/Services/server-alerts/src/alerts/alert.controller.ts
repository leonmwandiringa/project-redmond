import { Controller, Get, Req, Post, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AlertService } from "./alert.service";

@Controller('alert')
export class AlertController{
    constructor(private readonly _AlertService: AlertService){}
    
    @Post('/')
    async createServerAlerts(@Res() res: Response, @Req() req: Request){
        let reqPayload = req.body
        reqPayload.userid = req.headers["userid"]
        let getAlerts = await this._AlertService.createServerAlert(reqPayload);

        return res.status(200).json({
            error: getAlerts.status ? null : getAlerts.message,
            message: getAlerts.message,
            status: getAlerts.status,
            data: getAlerts.data
        });
    }

    @Get(':server')
    async findUserServer(@Res() res: Response, @Req() req: Request){
        let requestingUser = req.headers["userid"]
        let getAlert = await this._AlertService.getServerAlerts(requestingUser, req.params.server);

        return res.status(getAlert ? 200 : 403).json({
            error: getAlert ? null : "Server alerts wasnt found.",
            message: getAlert ? "user server alerts was found" : "Server alert wasnt found.",
            status: getAlert ? true : false,
            data: getAlert
        });
    }

}