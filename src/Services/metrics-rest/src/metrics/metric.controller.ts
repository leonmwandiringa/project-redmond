import { Controller, Get, Req, Post, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { MetricService } from "./metric.service";

@Controller('metric')
export class MetricController{
    constructor(private readonly _metricService: MetricService){}
    
    @Get('/')
    async findUser(@Res() res: Response, @Req() req: Request){
        let userFound = await this._metricService.getUser(req.params.cell.trim());
        return res.status(200).json({
            error: null,
            message: "user was found",
            status: true,
            data: userFound
        });
    }

}