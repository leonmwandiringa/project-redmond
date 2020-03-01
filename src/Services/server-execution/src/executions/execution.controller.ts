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

    @Get(':server')
    async GetExecutions(@Res() res: Response, @Req() req: Request){
        let user_id = req.headers["userid"]
        let executionResult = await this._executionService.getServerExecutions(user_id, req.params.server);

        return res.status(200).json({
            error: executionResult.length > 0 ? null : "no server executions were found",
            message: executionResult.length > 0 ? "server executions were found" : "no server executions were found",
            status: executionResult.length > 0 ? true : false,
            data: executionResult
        });
    }

}