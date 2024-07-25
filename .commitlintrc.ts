export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'jira-issue-rule': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'jira-issue-rule': ({ subject }) => {
          const JIRA_ISSUE_REGEXP = /DGR-\d+$/
          return [JIRA_ISSUE_REGEXP.test(subject), `Your subject should contain jira issue at the end`]
        },
      },
    },
  ],
}
