(function () {
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(`${value}T00:00:00`));
  }

  function slugFromFile(file) {
    return file.split("/").pop().replace(/\.md$/i, "");
  }

  function stripQuotes(value) {
    return value.replace(/^["']|["']$/g, "");
  }

  function parseTags(value) {
    const trimmed = value.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      return trimmed.slice(1, -1).split(",").map((tag) => stripQuotes(tag.trim())).filter(Boolean);
    }
    return trimmed.split(",").map((tag) => stripQuotes(tag.trim())).filter(Boolean);
  }

  function parseFrontMatter(markdown, file) {
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
    const meta = {};
    let body = markdown;

    if (match) {
      body = markdown.slice(match[0].length);
      match[1].split("\n").forEach((line) => {
        const separator = line.indexOf(":");
        if (separator === -1) return;
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim();
        if (key === "tags") {
          meta.tags = parseTags(value);
        } else {
          meta[key] = stripQuotes(value);
        }
      });
    }

    return {
      file,
      title: meta.title || slugFromFile(file),
      slug: meta.slug || slugFromFile(file),
      date: meta.date || "",
      summary: meta.summary || "",
      tags: meta.tags || [],
      body
    };
  }

  function postFiles() {
    if (Array.isArray(window.BLOG_POST_FILES)) {
      return window.BLOG_POST_FILES;
    }
    return null;
  }

  async function loadPosts() {
    const files = postFiles();
    if (!files) {
      throw new Error("Could not load posts/manifest.js");
    }

    const posts = await Promise.all(files.map(async (file) => {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Unable to load ${file}`);
      }
      return parseFrontMatter(await response.text(), file);
    }));

    return posts.sort((a, b) => b.date.localeCompare(a.date));
  }

  function inlineMarkdown(text) {
    return escapeHtml(text)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function markdownToHtml(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").trim().split("\n");
    const html = [];
    let listOpen = false;
    let codeOpen = false;
    let codeLines = [];

    function closeList() {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
    }

    function closeCode() {
      if (codeOpen) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        codeOpen = false;
      }
    }

    lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("```")) {
        if (codeOpen) {
          closeCode();
        } else {
          closeList();
          codeOpen = true;
        }
        return;
      }

      if (codeOpen) {
        codeLines.push(line);
        return;
      }

      if (!trimmed) {
        closeList();
        return;
      }

      if (trimmed.startsWith("### ")) {
        closeList();
        html.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
        return;
      }

      if (trimmed.startsWith("## ")) {
        closeList();
        html.push(`<h3>${inlineMarkdown(trimmed.slice(3))}</h3>`);
        return;
      }

      if (trimmed.startsWith("- ")) {
        if (!listOpen) {
          html.push("<ul>");
          listOpen = true;
        }
        html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
        return;
      }

      closeList();
      html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
    });

    closeCode();
    closeList();
    return html.join("");
  }

  window.Blog = {
    escapeHtml,
    formatDate,
    loadPosts,
    markdownToHtml
  };
})();
