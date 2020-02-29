import { Controller, Get, Req, Post, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { ExecutionService } from "./execution.service";

@Controller('execution')
export class ExecutionController{
    constructor(private readonly _executionService: ExecutionService){}
    
    @Post('/')
    async SendExecution(@Res() res: Response, @Req() req: Request){
        let serverPayload = req.body;
        serverPayload.user_id = req.headers["userid"]
        let executionResult = await this._executionService.setExecutions(serverPayload);

        return res.status(200).json({
            error: executionResult.status ? null : executionResult.message,
            message: executionResult.message,
            status: executionResult.status,
            data: executionResult.data
        });
    }

}