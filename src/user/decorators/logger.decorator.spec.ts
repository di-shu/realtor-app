import { LoggerDecorator } from './logger.decorator';

describe('LoggerDecorator', () => {
  const target = {
    constructor: {
      name: 'Test',
    },
  };
  const propertyKey = 'Property key';
  const descriptor: PropertyDescriptor = {};

  it('should call console.log with correct params', async () => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());

    LoggerDecorator()(target, propertyKey, descriptor);
    expect(console.log).toBeCalledWith(
      `Called: `,
      `${target.constructor.name} -> ${propertyKey}`,
    );
  });
});
