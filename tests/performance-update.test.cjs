import('./performance-plan21.mjs').then(({ runPlan21Benchmark }) => (
  runPlan21Benchmark(process.argv.slice(2), ['P21-G', 'P21-H'])
)).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
