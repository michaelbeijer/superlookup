# Term Page Template

Use this template to create new term pages in the `terms/` folder.

## Template

```markdown
---
title: [TERM]
slug: [term-slug]
description: [Brief description of the term]
source_lang: nl
target_lang: en
domain: [general/medical/legal/technical/financial/etc.]
last_updated: YYYY-MM-DD
tags:
  - [tag1]
  - [tag2]
---

# [TERM]

## Dutch

- **[primary term]** — [definition or explanation, if available]
- [synonym 1]
- [synonym 2]

## English

- [primary translation]
- [alternative 1] *(domain/context)*
- [alternative 2] *(domain/context)*

## Examples

| Dutch | English | Source |
|-------|---------|--------|
| [Example sentence in Dutch] | [Translation] | [source.com] |
| [Another example] | [Translation] | — |

## External links

- [TechDico: term](https://www.techdico.com/translation/dutch-english/[term].html)
- [Linguee: term](https://www.linguee.com/english-dutch/search?source=dutch&query=[term])
- [Other relevant link](URL)

## Notes

[Optional section for additional context, usage notes, or disambiguation]

## References

[^1]: [Source name](URL)
```

## Guidelines

1. **Slug**: Use lowercase, hyphen-separated (e.g., `cut-off-value`)
2. **Domain**: Choose from: general, medical, legal, technical, financial, automotive, aviation, etc.
3. **Dutch section**: List the Dutch term(s) with bold for primary term, include definition if available
4. **English section**: List translations with domain context in parentheses *(italicized)*
5. **Examples**: Real-world usage examples with sources
6. **External links**: Always include TechDico and Linguee links, add others as relevant
7. **References**: Use footnotes for definitions or sources cited in the Dutch/English sections
