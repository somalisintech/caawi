module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'jira-id-in-body': [2, 'always']
  },
  plugins: [
    {
      rules: {
        'jira-id-in-body': (parsed, when) => {
          const jiraIdPattern = /CAAWI-\d+/;
          const containsJiraId = jiraIdPattern.test(parsed.body);
          const isRequired = when === 'always';
          if (isRequired) {
            return [containsJiraId, `Your commit message body must include a JIRA task ID matching "CAAWI-XXX"`];
          }
          return [true];
        }
      }
    }
  ]
};
