# [Haichao Zhang](https://haichao-zhang.github.io/)

This is a no-build static blog for publishing research notes and results on GitHub Pages.

## Publish a new result

1. Copy `posts/template-new-experimental-result.md`.
2. Rename it with a unique lowercase slug, for example `posts/robot-policy-eval-2026.md`.
3. Edit the Markdown file.
4. Add one entry near the top of `posts/manifest.js`:

```js
{
  title: "Robot Policy Evaluation Result",
  slug: "robot-policy-eval-2026",
  date: "2026-04-22",
  summary: "One sentence explaining the result.",
  tags: ["Robotics", "Evaluation"],
  file: "posts/robot-policy-eval-2026.md"
}
```

5. Commit and push to GitHub.

The homepage automatically updates the dated post list and reader from `posts/manifest.js`.

## Post metadata

Each manifest entry needs:

   - `title`
   - `slug`
   - `date`
   - `summary`
   - `tags`
   - `file`

## Post body format

Each post file supports a small Markdown-style subset:

- `### Heading`
- `- Bullet`
- `[Link text](https://example.com)`
- `` `inline code` ``
- `**bold text**`
- fenced code blocks with triple backticks

Keep each `slug` unique, lowercase, and URL friendly, for example `robot-policy-eval-2026`.

## Preview locally

Because the homepage loads Markdown with `fetch`, use a tiny local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.
