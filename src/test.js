import parse from './parse/index.js';

const test = (runtimeExpression) => {
  try {
    const parseResult = parse(runtimeExpression);
    return parseResult.result.success;
  } catch {
    return false;
  }
};

export default test;
