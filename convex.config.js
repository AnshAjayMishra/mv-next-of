/** @type {import('convex').Config} */
module.exports = {
  schemaPath: "./convex/schema.ts",
  functionsPath: "./convex/",
  auth: {
    providers: ["clerk"],
    domain: "https://befitting-cricket-422.convex.cloud",
    applicationID: "mockvault",
  },
}; 