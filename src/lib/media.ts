import { db as defaultDb } from "../db";
import { mediaAssets } from "../db/schema";

type Db = typeof defaultDb;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;

// Confere o conteúdo real (assinatura do arquivo), não só o tipo/extensão informados pelo cliente.
export function detectImage(bytes: Uint8Array): keyof typeof ALLOWED | null {
  const b = bytes;
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 12 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 12 && String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

export type BlobApi = { put: (path: string, body: Uint8Array, opts: { access: "public"; contentType: string }) => Promise<{ url: string; pathname: string }>; del: (url: string) => Promise<void> };

export async function saveImage(db: Db, blob: BlobApi, file: { bytes: Uint8Array; declaredType: string; alt: string }) {
  if (file.bytes.length === 0 || file.bytes.length > MAX_IMAGE_BYTES) throw new Error("TAMANHO_INVALIDO");
  const real = detectImage(file.bytes);
  if (!real || real !== file.declaredType) throw new Error("TIPO_INVALIDO");
  if (!file.alt.trim()) throw new Error("ALT_OBRIGATORIO");
  const path = `uploads/${crypto.randomUUID()}.${ALLOWED[real]}`; // nome único, extensão derivada do conteúdo
  const up = await blob.put(path, file.bytes, { access: "public", contentType: real });
  if (!up?.url) throw new Error("UPLOAD_FALHOU"); // só associa ao banco após confirmar o upload
  try {
    const [row] = await db.insert(mediaAssets).values({ url: up.url, blobPath: up.pathname, mime: real, sizeBytes: file.bytes.length, alt: file.alt.trim() }).returning();
    return row;
  } catch (e) {
    await blob.del(up.url).catch(() => {}); // evita arquivo órfão se o registro falhar
    throw e;
  }
}
