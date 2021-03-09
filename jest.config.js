module.exports = {
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/fileMock.ts",
    "\\.(css|less)$": "<rootDir>/tests/styleMock.ts"
  },
  testMatch: ["<rootDir>/tests/unit/**/*.spec.{j,t}s?(x)"]
};
