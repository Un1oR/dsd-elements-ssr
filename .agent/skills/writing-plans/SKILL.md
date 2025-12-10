---
name: writing-plans
description: Use when design is complete and you need detailed implementation tasks for engineers with zero codebase context - creates comprehensive implementation plans with exact file paths, complete code examples, and verification steps assuming engineer has minimal domain knowledge
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Language:** All plan artifacts (headings, step descriptions, inline comments in code samples) MUST be written in Russian. Keep tool/library names and shell commands in English where appropriate.
13

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** This should be run in a dedicated worktree (created by brainstorming skill).

**Save plans to:** `docs/tasks/YYYY-MM-DD-<task-name>/plan.md` (согласно docs skill)

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

-**Every plan MUST start with this Russian header (it drives the artifact language):**

```markdown
# План реализации: [Название фичи]

> **For coding agent:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Цель:** [Одно предложение, описывающее, что делаем]

**Архитектура:** [2–3 предложения об общем подходе]

**Технологии:** [Основные библиотеки/сервисы]

---
```

## Task Structure (template kept in Russian)

```markdown
### Задача N: [компонент/область]

**Файлы:**
- Создать: `path/new_file.py`
- Изменить: `path/existing.py:123-145`
- Тест: `tests/path/test_file.py`

**Шаг 1: Написать падающий тест**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**Шаг 2: Запустить тест и убедиться, что он падает**

Команда: `pytest tests/path/test_file.py::test_specific_behavior -v`
Ожидаем: FAIL с сообщением "function not defined"

**Шаг 3: Написать минимальную реализацию**

```python
def function(input):
    return expected
```

**Шаг 4: Запустить тест и убедиться, что он зелёный**

Команда: `pytest tests/path/test_file.py::test_specific_behavior -v`
Ожидаем: PASS

**Шаг 5: Коммит**

```bash
git add tests/path/test_file.py src/path/file.py
git commit -m "feat: <кратко>"
```
```

## Remember
- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- Reference relevant skills with @ syntax
- DRY, YAGNI, TDD, frequent commits

## Execution Handoff

After saving the plan, offer execution options (speak in Russian to the user):

"**План готов, сохранён в `docs/tasks/<task-name>/plan.md`. Есть два варианта:**

**1. Subagent-Driven (в этой сессии)** — используем executing-plans, быстрые итерации и код-ревью между задачами.

**2. Parallel Session (отдельная сессия)** — открываем новую сессию в воркспейсе, включаем executing-plans, выполняем задачи батчами с чекпоинтами.

**Как двигаемся дальше?**"

**If Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use executing-plans
- Stay in this session
- One task per iteration + code review
 
**If Parallel Session chosen:**
- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses executing-plans
