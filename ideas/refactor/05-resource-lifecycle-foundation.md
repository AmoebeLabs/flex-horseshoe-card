# 05 — Resource lifecycle foundation

## 1. Goal

Make replacement/disconnect reliably reach each resource-owning object's cleanup path before specialized pointer/Horseshoe work is refined later.

Rule:

```text
creator owns handle/reference -> creator cleanup stops/removes it
```

## 2. Prerequisites

Plans 01–04 complete so Sparkline History/Series/Graph ownership will not move again while lifecycle cleanup is wired.

## 3. Current-code validation

Inventory the complete `src` tree for timers, intervals, RAFs, global listeners, observers, animators, async owner identities and nested lifecycle-aware children. Verify tool replacement paths in `CardTools`, horseshoe replacement and parent disconnect/reconnect order.

## 4. Scope

- old tool instances are closed before replacement;
- new tools receive the already-current lifecycle notifications when parent remains connected;
- History owner cleanup is reached and its timers/request relevance end;
- cleanup is idempotent;
- composite owners forward cleanup to nested resource owners;
- existing Horseshoe animator and Sparkline pointer cleanup hooks are invoked where current handles already exist.

## 5. Out of scope

- fixing pointer captured-state/node-lifetime bugs (Plan 09);
- fixing arbitrary-progress path-cache growth or animator target semantics (Plan 10);
- palette/ChildCards stale completion rules (Plan 06).

This plan establishes the permanent cleanup route that those plans extend; it does not add a temporary resource manager.

## 6. Required replacement order

```text
old tools
 -> oldTool.disconnected()/concrete cleanup
 -> release old references
 -> construct/assign new tools
 -> give new tools current connected/HA lifecycle if parent is already active
```

Apply the same old-before-new rule to Horseshoe and other separately replaced instances.

## 7. Implementation sequence

1. Build resource ownership inventory with owner + cleanup site.
2. Add permanent replacement/disconnect/reconnect tests for currently-owned timers/resources.
3. Close old CardTools arrays before replacement.
4. Apply old-before-new cleanup to Horseshoe and nested lifecycle objects.
5. Make History cleanup reachable and idempotent.
6. Ensure late History work is inert through Plan 02's validity mechanism.
7. Preserve parent disconnect order unless a demonstrated dependency requires a tested change.
8. Verify reconnect/new tools do not duplicate already-owned resources.
9. Search every resource creation API and record remaining specialized gaps for Plans 09/10 rather than patching them with generic code.

## 8. Permanent tests

- old Sparkline history timer -> replacement/disconnect -> cancelled;
- old History result after replacement -> inert;
- old tool cleanup called before reference replacement;
- new tool immediately functional while parent remains connected;
- reconnect does not duplicate History/tool resources;
- idempotent cleanup.

Specialized pointer/Horseshoe assertions are added permanently in Plans 09/10.

## 9. Definition of Done

- replacement and DOM disconnect both reach old owner cleanup;
- History and existing concrete resource handles end through their functional owner;
- cleanup is idempotent;
- new tools receive correct current lifecycle when replacing inside a connected card;
- no central `ResourceManager`/registry exists;
- remaining pointer/path-specific defects are isolated behind stable cleanup entry points, not temporary compatibility code.

## 10. Guarantees for following plans

Following plans may assume:

- every tool/resource owner has a permanent cleanup entry path;
- config replacement closes old owners before constructing/activating replacements;
- specialized pointer/Horseshoe work only needs to correctly own its internal handles, not redesign CardTools lifecycle.

## 11. Source material

Refines old Plan 08 so it provides a foundation instead of pre-solving parts of old Plans 09/10/11.
