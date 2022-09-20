module.exports = {
  moduleDirectories: ['node_modules'],
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
}