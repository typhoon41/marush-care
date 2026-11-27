---
name: work-items
description: Linking Marush work to its Azure Boards ticket when there is one - find or ask for the ticket number before starting, then add an AB#<id> footer to every commit and the PR description; no ticket means no link. Apply whenever starting a task, writing a commit message, or opening or editing a pull request in this repository.
---

# Azure Boards work items

Work in this repository is usually tracked by a ticket on the project's Azure Board. GitHub links a commit or PR to that ticket through an `AB#<id>` mention. A ticket is not required: work without one goes ahead unlinked.

## Before starting

Settle which ticket the work belongs to, if any:

1. If an Azure DevOps work-item tool is available (the azure-devops MCP server's work item or search tools), search the board for the ticket that matches the task.
2. Otherwise, or if no single ticket clearly matches, **ask the user for the ticket number**. Never guess, and never reuse a number from unrelated work.
3. If the user says there is no ticket, or not to link this work, add no `AB#` mention anywhere. That is a valid answer, not a gap to fill later.

Ask once per piece of work (a branch or PR), not once per commit.

Known tickets:

| Work | Ticket |
|---|---|
| Angular 22 uplift (the `code-modernization` plan in `analysis/marush/`, all its phases). It is linked from the PR after #28; #28 ships unlinked by the user's choice. | AB#50 |

## Commits

When there is a ticket, keep the Conventional Commits subject unchanged and put the link in a footer after a blank line. The subject feeds the release notes, so it carries no ticket number.

```
fix(deps): patch angular 20 ssr and express runtime advisories

AB#50
```

Every commit on a linked branch carries the footer, including docs and chore commits: release notes are built from the PR's individual commits. Commits already pushed without the footer stay as they are; rewriting pushed history is the user's call.

## Pull requests

When there is a ticket, the PR description starts with the ticket link (`AB#50`) on its own line, followed by the paragraph on what changed and why.
