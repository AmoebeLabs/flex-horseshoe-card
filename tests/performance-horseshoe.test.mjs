import { runPlan21Benchmark } from './performance-plan21.mjs';

runPlan21Benchmark(process.argv.slice(2), ['P21-I']).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
