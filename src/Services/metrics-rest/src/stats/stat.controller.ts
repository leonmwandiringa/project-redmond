import { Controller, Get, Req, Post, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { StatService } from "./stat.service";

@Controller('stat')
export class StatController{
    constructor(private readonly _statService: StatService){}
    
    @Get('/')
    async findUser(@Res() res: Response, @Req() req: Request){
        let requestingUser = req.headers["userid"]
        let getStats = await this._statService.getContainerStats(requestingUser);

        return res.status(200).json({
            error: null,
            message: "user servers metrics were found",
            status: true,
            data: getStats
        });
    }

}