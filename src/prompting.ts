export const rulesDef = `Rules-definitions are pre-defined rules that you must follow. The format for defining a rule is as follows:

#define <rule_name> <rule_to_stick_to> #end

This format is inspired by C. Any output that does not adhere to a defined rule will be rejected.

Defined rules:
`;

export const backtick = (content: string) => { return `\`\`\`${content}\`\`\``; };

export function attachment(path: string, sourceCode: string) {
  return `here is the file located at \`${path}\`:

${backtick(sourceCode)}
  `
}