/* eslint-disable @typescript-eslint/prefer-optional-chain */
import "reflect-metadata";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import logger from "../utils/logger";
import { Loader } from "../loader/fileLoad";
import { Options } from "../utils/interface";
import { getLocalIPAddress } from "../utils/common";
import {
  _Config,
  _Controller,
  _Middleware,
  _Service,
} from "../decorator/inject";

const router: KoaRouter = new KoaRouter();

export default class SoServer extends Koa {
  private options = {
    baseDir: process.cwd(),
  };
  private baseDir: string;
  private _router: KoaRouter;
  private _app: SoServer;

  public constructor(options?: Options) {
    super();
    this.options = options;
    this.env = process.env.NODE_ENV || "dev";
    this._router = router;
    this._app = this;
    this.baseDir = options
      ? options.baseDir
        ? options.baseDir
        : process.cwd()
      : process.cwd();
    try {
      const loader: Loader = new Loader(
        this.baseDir,
        this.env,
        this._app,
        this._router
      );
      loader.init();
    } catch (e) {
      logger.error(e);
      process.exit(0);
    }
  }

  public Listen(
    port = 12280,
    host = "0.0.0.0",
    backlog?: number,
    callback: () => void = () => {
      logger.warn(
        `SoServer Started Successful...\n  NetWork: \thttp://${getLocalIPAddress()}:${port}\n  Local: \thttp://127.0.0.1:${port}\n`
      );
    }
  ) {
    this._app.listen(port, host, backlog ? backlog : null, callback);
  }

  public close() {
    logger.info("SoServer Closed Successful...");
    process.exit(0);
  }
}
