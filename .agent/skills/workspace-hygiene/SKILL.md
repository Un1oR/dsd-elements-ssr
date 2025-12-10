---
name: workspace-hygiene
description: Use when working in the repo to keep the workspace clean—temporary artifacts go to .scratch/, remove debug leftovers, avoid committing noise.
---

# Чистота рабочего дерева

- Временные скрипты/дампы клади в `.scratch/` (в .gitignore).
- После завершения задачи и достижения результата всегда удаляй временные артефакты: отладочные выводы в консоль, временные скрипты, тестовые файлы, которые не являются частью финального PR (содержимое `.scratch/`).
- Никогда не оставляй отладочные принты/заглушки в коммитах.
