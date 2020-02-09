import { Controller, Get, Req, Post, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AlertService } from "./alert.service";

@Controller('alert')
export class AlertController{
    constructor(private readonly _AlertService: AlertService){}
    
    @Get('/')
    async findUserServerAlerts(@Res() res: Response, @Req() req: Request){
        let requestingUser = req.headers["userid"]
        let getAlerts = await this._AlertService.getContainerAlerts(requestingUser);

        return res.status(200).json({
            error: null,
            message: "user servers metrics were found",
            status: true,
            data: getAlerts
        });
    }

    @Get(':server')
    async findUserServer(@Res() res: Response, @Req() req: Request){
        let requestingUser = req.headers["userid"]
        let getAlert = await this._AlertService.getServerAlert(requestingUser, req.params.server);

        return res.status(getAlert ? 200 : 403).json({
            error: getAlert ? null : "Server wasnt found.",
            message: getAlert ? "user server metrics was found" : "Server wasnt found.",
            status: getAlert ? true : false,
            data: getAlert
        });
    }

}