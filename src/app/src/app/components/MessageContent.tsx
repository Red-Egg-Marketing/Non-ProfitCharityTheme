import { Fragment, type ReactNode } from "react";

/**
 * Renders assistant/staff text with just enough formatting for a chat bubble:
 * **bold**, "- " / "• " bullet lists, [markdown](links), bare URLs, emails,
 * and US phone numbers (as tel: links). Everything is emitted as React
 * elements — no HTML parsing, no dangerouslySetInnerHTML.
 */

const INLINE_RE =
  /(\*\*[^*]+\*\*)|(\[[^\]]+\]\((?:https?:\/\/|mailto:|tel:)[^)\s]+\))|((?:https?:\/\/)?(?:[a-z0-9-]+\.)+(?:org|com|net|gov|edu|us|io)(?:\/[^\s)<>,]*)?)|([\w.+-]+@[\w-]+\.[\w.-]+)|(\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?:\s?x\d+)?)/gi;

const linkClass = "underline decoration-[#25a794]/60 hover:decoration-[#25a794] break-words";

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const [raw, bold, mdLink, url, email, phone] = m;

    if (bold) {
      out.push(<strong key={key++}>{bold.slice(2, -2)}</strong>);
    } else if (mdLink) {
      const [, label, href] = mdLink.match(/^\[([^\]]+)\]\(([^)]+)\)$/) ?? [];
      out.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {label}
        </a>,
      );
    } else if (url) {
      const trimmed = url.replace(/[.,]+$/, "");
      const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      out.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {trimmed}
        </a>,
      );
      if (trimmed.length < url.length) out.push(url.slice(trimmed.length));
    } else if (email) {
      out.push(
        <a key={key++} href={`mailto:${email}`} className={linkClass}>
          {email}
        </a>,
      );
    } else if (phone) {
      const digits = phone.replace(/\D/g, "").replace(/^(\d{10}).*$/, "$1");
      out.push(
        <a key={key++} href={`tel:+1${digits}`} className={linkClass}>
          {phone}
        </a>,
      );
    } else {
      out.push(raw);
    }
    last = idx + raw.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function MessageContent({ text }: { text: string }) {
  // Normalize inline "- **Item:**" runs onto their own lines so lists render even
  // when the model didn't add line breaks.
  const normalized = text.replace(/\s+(?=[-•]\s\*\*)/g, "\n");
  const lines = normalized.split("\n");

  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc pl-4 my-1 space-y-0.5">
        {list.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^\s*[-•*]\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
      return;
    }
    flushList();
    if (line.trim() === "") return;
    blocks.push(
      <p key={`p-${i}`} className="my-1 first:mt-0 last:mb-0">
        {renderInline(line)}
      </p>,
    );
  });
  flushList();

  return <Fragment>{blocks}</Fragment>;
}