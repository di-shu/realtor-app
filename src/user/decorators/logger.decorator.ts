export const LoggerDecorator = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    console.log(`Called: `, `${target.constructor.name} -> ${propertyKey}`);
  };
};
