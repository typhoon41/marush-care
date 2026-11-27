using Xunit.Sdk;
using Xunit.v3;

// Each test class owns one in-memory API host; running them one at a time keeps the server clock, the thread culture
// the API sets per request, and Serilog's shared log file free of cross-talk.
[assembly: Parallelization(Mode = ParallelMode.None)]
