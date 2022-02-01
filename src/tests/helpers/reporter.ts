// Default Typescript jasmine spec reporter code for reporter.ts
// More info found at https://github.com/bcaudan/jasmine-spec-reporter/tree/master/examples/typescript

import {
  DisplayProcessor,
  SpecReporter,
  StacktraceOption
} from 'jasmine-spec-reporter';
import SuiteInfo = jasmine.SuiteInfo;

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: SuiteInfo, log: string): string {
    return `${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  //@ts-ignore
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.NONE
    },
    customProcessors: [CustomProcessor]
  })
);
