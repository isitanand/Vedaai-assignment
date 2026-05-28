"use client";

import { useRef, useState } from "react";
import { CheckCircle2, FileText, ImageIcon, UploadCloud, X } from "lucide-react";
import { Button } from "../ui/button";

interface UploadedFile {
  name: string;
  type: "text" | "image";
  content: string | null;
}


export function FileDropzone({ onText }: { onText: (text: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  function pushCombined(updated: UploadedFile[]) {
    const combined = updated
      .map((f) => f.content)
      .filter(Boolean)
      .join("\n\n---\n\n")
      .slice(0, 4000);
    onText(combined || null);
  }

  function handleFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;

    const newFiles: UploadedFile[] = [];
    let pending = incoming.length;

    Array.from(incoming).forEach((file) => {
      const isText = file.type.startsWith("text") || /\.(txt|md|csv)$/i.test(file.name);
      if (isText) {
        const reader = new FileReader();
        reader.onload = () => {
          newFiles.push({ name: file.name, type: "text", content: String(reader.result).slice(0, 4000) });
          pending--;
          if (pending === 0) commit(newFiles);
        };
        reader.readAsText(file);
      } else {
        newFiles.push({ name: file.name, type: "image", content: null });
        pending--;
        if (pending === 0) commit(newFiles);
      }
    });
  }

  function commit(newFiles: UploadedFile[]) {
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const unique = newFiles.filter((f) => !existingNames.has(f.name));
      const updated = [...prev, ...unique];
      pushCombined(updated);
      return updated;
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function remove(name: string) {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.name !== name);
      pushCombined(updated);
      return updated;
    });
  }

  function clearAll() {
    setFiles([]);
    onText(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const hasFiles = files.length > 0;

  return (
    <div>
      {}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-7 text-center transition-all duration-300 ${
          hasFiles
            ? "border-success/40 bg-success/5"
            : "border-border bg-muted/30 hover:border-brand/50"
        }`}
      >
        {}
        <span
          className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ${
            hasFiles
              ? "bg-success text-white shadow-[0_4px_14px_rgba(34,197,94,0.4)]"
              : "bg-brand-gradient text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
          }`}
        >
          {hasFiles ? (
            <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
          ) : (
            <UploadCloud className="h-5 w-5" />
          )}
          {}
          {justAdded && (
            <span className="absolute inset-0 rounded-full bg-success/30 animate-ping" />
          )}
        </span>

        {hasFiles ? (
          <>
            <p className="mt-2.5 text-sm font-semibold text-success">
              {files.length} file{files.length > 1 ? "s" : ""} uploaded
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Click or drag to add more files
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 font-semibold">Choose files or drag &amp; drop here</p>
            <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, TXT — upto 10MB each</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              Browse Files
            </Button>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".txt,.md,.csv,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {}
      {hasFiles && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div
              key={f.name}
              className="flex items-center gap-2.5 rounded-xl border border-success/30 bg-success/5 px-3 py-2 text-sm animate-fade-in"
            >
              {}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                {f.type === "text" ? (
                  <FileText className="h-3.5 w-3.5" />
                ) : (
                  <ImageIcon className="h-3.5 w-3.5" />
                )}
              </span>

              {}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">{f.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {f.type === "text" ? "Text · used as context" : "Image · name captured"}
                </span>
              </span>

              {}
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />

              {}
              <button
                type="button"
                onClick={() => remove(f.name)}
                aria-label={`Remove ${f.name}`}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {}
          {files.length > 1 && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-danger transition-colors"
            >
              <X className="h-3 w-3" /> Remove all files
            </button>
          )}
        </div>
      )}

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Upload images of your preferred document/image
      </p>
    </div>
  );
}
