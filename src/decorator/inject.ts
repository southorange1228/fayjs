import "reflect-metadata";
import {
  autowired_reg,
  provide_reg,
  injects_reg,
  Provide,
  Injects,
} from "./constants";

// ioc core container
export const iocContainer: WeakMap<Function, any> = new WeakMap<
  Function,
  any
>();

// user provided container
export const providedContainer: WeakMap<Function, any> = new WeakMap<
  Function,
  any
>();

/**
 * 中间件集合　前置中间件和后置中间件
 */
export const BeforeMiddleware: Map<number,any[]> = new Map<number,any[]>();
export const AfterMiddleware: Map<number,any[]> = new Map<number,any[]>();


/**
 * ioc实例集合
 */
export const _Controller: Set<Function | any> = new Set<Function | any>();
export const _Service: Set<Function | any> = new Set<Function | any>();
export const _Middleware: Set<Function | any> = new Set<Function | any>();
export const _Config: Set<Function | any> = new Set<Function | any>();
export const _Plugin: Set<Function | any> = new Set<Function | any>();

/**
 * IOC Core container inject
 * @param target class
 */
export function Inject(target: any) {
  if (!target) {
    return;
  }

  // instantiate target
  const targetInstance = new target();

  const depends = Reflect.getOwnMetadataKeys(target).filter(
    (meta: string) => "design:paramtypes" !== meta
  );

  depends.forEach((depClass: string) => {
    // autowired depend to instance
    if (depClass.match(autowired_reg)) {
      // get constructor of dependance
      const _constructor = Reflect.getMetadata(depClass, target);

      const dependName = depClass.replace(autowired_reg, "");
      // check if has been instantiated in iocContainer
      let depInstance = iocContainer.get(_constructor);
      if (!iocContainer.has(_constructor)) {
        // has not been instantiated , new dependance via recurring
        depInstance = Inject(_constructor);
      }

      // add dependance's instance to target
      targetInstance[dependName] = depInstance;
    }
  });

  // inject instance to container
  iocContainer.set(target, targetInstance);

  return targetInstance;
}

export function Provided(target: Function | any) {
  if (!target) {
    return;
  }
  // instantiate target
  const targetInstance = new target();

  const depends = Reflect.getOwnMetadataKeys(target).filter(
    (meta: string) => "design:paramtypes" !== meta
  );

  depends.forEach((depClass: string) => {
    if (depClass.match(injects_reg)) {
      const _constructor = Reflect.getMetadata(depClass, target);
      const dependName = depClass.replace(injects_reg, "");
      let depInstance = providedContainer.get(_constructor);
      if (!providedContainer.has(_constructor)) {
        depInstance = Provided(_constructor);
      }
      targetInstance[dependName] = depInstance;
    }
  });

  // inject instance to container
  providedContainer.set(target, targetInstance);

  return targetInstance;
}

export function Injected(target: any, propKey: string) {
  const _constructor = Reflect.getMetadata("design:type", target, propKey);
  Reflect.defineMetadata(
    `${Injects}@@${propKey}`,
    _constructor,
    target.constructor
  );
}
