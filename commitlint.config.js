module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'jira-id-in-message': [2, 'always']
  },
  plugins: [
    {
      rules: {
        'jira-id-in-message': (parsed, when) => {
          const jiraIdPattern = /CAAWI-\d+/;
          const containsJiraId = jiraIdPattern.test(parsed.raw);
          const isRequired = when === 'always';
          if (isRequired) {
            return [
              containsJiraId,
              `Your commit message must include a JIRA task ID matching "CAAWI-#" (e.g. "CAAWI-123")`
            ];
          }
          return [true];
        }
      }
    }
  ]
};
