import { useState } from "react";
import { Upload } from "lucide-react";
import { client } from "../lib/api";

type Mime = "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "video/mp4" | "video/webm";
const types: Mime[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
];
export function MediaUpload({
  imagesOnly = false,
  label,
  onUpload,
}: {
  imagesOnly?: boolean;
  label: string;
  onUpload: (url: string, type: "image" | "video", name: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file: File) {
    setError("");
    if (!types.includes(file.type as Mime) || (imagesOnly && !file.type.startsWith("image/"))) {
      setError("Formato não permitido. Use JPG, PNG, WebP, AVIF, MP4 ou WebM.");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("O arquivo deve ter até 100 MB.");
      return;
    }
    setBusy(true);
    try {
      const signed = await client.upload.presign({
        filename: file.name,
        contentType: file.type as Mime,
        size: file.size,
      });
      const response = await fetch(signed.url, {
        method: "PUT",
        headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
        body: file,
      });
      if (!response.ok)
        throw new Error(
          "Não foi possível enviar o arquivo. Verifique a conexão e tente novamente.",
        );
      onUpload(signed.publicUrl, file.type.startsWith("video/") ? "video" : "image", file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <label className="upload-control">
        <Upload size={18} />
        <span>{busy ? "Enviando arquivo…" : label}</span>
        <input
          type="file"
          aria-label={label}
          accept={imagesOnly ? "image/jpeg,image/png,image/webp,image/avif" : types.join(",")}
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
            e.target.value = "";
          }}
        />
        {busy && <span className="spinner" />}
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
