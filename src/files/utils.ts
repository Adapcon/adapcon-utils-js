import { FILE_EXTENSIONS } from '.'

export function getExtensionFromMimeType (mimeType: string): string | null {
  return FILE_EXTENSIONS[mimeType] || null
}
