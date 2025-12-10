---
name: markdown-formatting
description: >
  Use when editing any Markdown file to apply SemBr line breaks and safe
  100-char wrapping.
---

# Markdown Formatting

## When to Use
- Любые правки Markdown: `docs/**`, `README`, скилы, заметки, тикеты, ответы.
- Не ограничено `docs/**`: применяй везде, где нужен Markdown.
- Стиль иной? Спроси перед массовым ререндером.

## Основные правила
- SemBr: разрывы по смыслу, рендер не меняем.
>  The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”,
>  “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this
>  document are to be interpreted as described in RFC 2119.
>
> 1. Text written as plain text or a compatible markup language MAY use semantic
>    line breaks.
> 2. A semantic line break MUST NOT alter the final rendered output of the
>    document.
> 3. A semantic line break SHOULD NOT alter the intended meaning of the text.
> 4. A semantic line break MUST occur after a sentence, as punctuated by a
>    period (.), exclamation mark (!), or question mark (?).
> 5. A semantic line break SHOULD occur after an independent clause as punctuated
>    by a comma (,), semicolon (;), colon (:), or em dash (—).
> 6. A semantic line break MAY occur after a dependent clause in order to clarify
>    grammatical structure or satisfy line length constraints.
> 7. A semantic line break is RECOMMENDED before an enumerated or itemized list.
> 8. A semantic line break MAY be used after one or more items in a list in order
>    to logically group related items or satisfy line length constraints.
> 9. A semantic line break MUST NOT occur within a hyphenated word.
> 10. A semantic line break MAY occur before and after a hyperlink.
> 11. A semantic line break MAY occur before inline markup.
> 12. A maximum line length of 80 characters is RECOMMENDED.
> 13. A line MAY exceed the maximum line length if necessary, such as to
>     accommodate hyperlinks, code elements, or other markup.
- Лимит: 100 символов UTF-8 (НЕ байтами).
- Переносим только строки >100: целимся в 100 (можно 98). Текущие переносы сохраняем.
- Не рефлоу абзац: меняем только нужные строки.
- Не рвём дефисные слова и ссылки.
- Списки: перенос после пункта ок для группировки.
- Ссылки/инлайн: перенос до/после, синтаксис не рвём.
- Длинные команды/URL не режь внутри флагов/кавычек: если >100, вынеси в отдельную строку
  или fenced-блок.

## Быстрый алгоритм
1) Перед правкой оцени стиль: если уже SemBr и <100 — оставь.
2) Добавляешь текст — сразу ставь переносы по SemBr.
3) Строка >100 — разбей по смыслу, лучше после точки/запятой.
4) Проверка: рендер без разрывов слов/ссылок.

## Типовые ошибки
- Массовый reflow всего документа без необходимости.
- Перенос по привычке на 80, игнорируя лимит 100.
- Разрыв внутри `[...]()` или `-слова`.
- Смена маркеров/отступов списков при обрезке.
- Проверка длины в байтах (`awk` без UTF-8) даёт ложное срабатывание на кириллице.
  Мерь в символах:

  ```
  LC_ALL=en_US.UTF-8 awk 'length>100{print NR, length}' file.md
  python - <<'PY'
  from pathlib import Path
  p = Path("file.md")
  print(max(len(l) for l in p.read_text().splitlines()))
  PY
  ```

## Коротко
- SemBr + лимит 100, трогаем только строки >100.
- Сохраняем рендер, не рвём ссылки и дефисные слова.
