import { Controller, Get, Req, Post, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { StatService } from "./stat.service";

@Controller('stat')
export class StatController{
    constructor(private readonly _statService: StatService){}
    
    @Get('/')
    async findUserServerStats(@Res() res: Response, @Req() req: Request){
        let requestingUser = req.headers["userid"]
        let getStats = await this._statService.getContainerStats(requestingUser);

        return res.status(200).json({
            error: null,
            message: "user servers metrics were found",
            status: true,
            data: getStats
        });
    }

    @Get(':server')
    async findUserServer(@Res() res: Response, @Req() req: Request){
        let requestingUser = req.headers["userid"]
        let getStat = await this._statService.getServerStat(requestingUser, req.params.server);

        return res.status(getStat ? 200 : 403).json({
            error: getStat ? null : "Server wasnt found.",
            message: getStat ? "user server metrics was found" : "Server wasnt found.",
            status: getStat ? true : false,
            data: getStat
        });
    }

}