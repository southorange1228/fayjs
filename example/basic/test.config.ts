import { Config } from "./../../dist/core";

@Config("dev")
export class TestConfig {
  public baseDir: string = __dirname;

  public mysql = {
    enable: true,
    client: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "",
    },
  };
}
