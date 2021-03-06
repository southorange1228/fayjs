import {
  Get,
  Controller,
  Autowired,
  Post,
  RequestHeader,
  RequestContext,
  RequestBody,
  Body,
  BaseController,
} from "../../../../dist";
import { TestService } from "../services/index.service";
import { DevConfig } from "../configs/testDev.config";

@Controller()
export class TestController extends BaseController {
  @Autowired
  private testService: TestService;


  // private ctx: any;

  private config: DevConfig;

  @Get("/")
  async testServiceFunc() {
    const result = await this.testService.index();
    if (result.a) {
      console.log(123);
    }
    this.ctx.body = result;
  }

  @Get("/controller")
  async testControllerFunc() {
    this.ctx.body = "Test Controller Success";
  }

  @Get("/config")
  async testConfigFunc(
    @RequestContext() ctx: any,
    @RequestHeader("host") header: any
  ) {
    this.ctx.body = JSON.stringify(this.config);
  }

  @Post("/formdata")
  async testFormDataFunc() {
    this.ctx.body = this.ctx.request.body;
  }

  @Post("/testrequestbody")
  async testRequestBodyFunc(@RequestBody("username") username: string) {
    this.ctx.body = username;
  }

  @Post("/testrequestbodys")
  async testRequestBodyFuncs(@Body() body: string) {
    this.ctx.body = body;
  }
}
