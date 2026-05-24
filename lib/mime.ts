export const DEFAULT_MIME_TYPE = "application/octet-stream"

// Expanded slightly to accommodate the wide variety of files in your list
export type MimeIconKind =
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "text"
  | "document"
  | "3d"
  | "binary"

const MEDIA_CATEGORY: Record<string, string> = {
  image: "Image",
  video: "Video",
  audio: "Audio",
  font: "Font",
  model: "3D Model",
}

const MIME_GROUPS: Record<MimeIconKind, Record<string, string>> = {
  image: {
    "image/svg+xml": "SVG",
    "image/x-icon": "ICO Image",
    "image/vnd.microsoft.icon": "ICO Image",
    "image/tiff": "TIFF Image",
    "image/bmp": "BMP Image",
    "image/heic": "HEIC Image",
    "image/heif": "HEIF Image",
    "image/avif": "AVIF Image",
    "image/x-raw": "RAW Image",
  },
  audio: {
    "audio/mpeg": "MP3 Audio",
    "audio/x-wav": "WAV Audio",
    "audio/x-aiff": "AIFF Audio",
    "audio/x-flac": "FLAC Audio",
    "audio/x-m4a": "M4A Audio",
    "audio/vnd.dolby.dd-raw": "Dolby Audio",
  },
  video: {
    "video/x-msvideo": "AVI Video",
    "video/x-matroska": "MKV Video",
    "video/x-flv": "FLV Video",
    "video/x-m4v": "M4V Video",
    "video/vnd.dlna.mpeg-tts": "MPEG Video",
  },
  document: {
    // PDF & eBooks
    "application/pdf": "PDF",
    "application/epub+zip": "EPUB",
    "application/x-mobipocket-ebook": "MOBI eBook",
    "application/vnd.amazon.ebook": "AZW eBook",
    // Office
    "application/msword": "Word Document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word Document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
      "Word Template",
    "application/vnd.ms-excel": "Excel Spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel Spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
      "Excel Template",
    "application/vnd.ms-powerpoint": "PowerPoint Presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PowerPoint Presentation",
    "application/vnd.openxmlformats-officedocument.presentationml.template":
      "PowerPoint Template",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
      "PowerPoint Slideshow",
    "application/vnd.ms-access": "Access Database",
    "application/vnd.ms-project": "MS Project File",
    "application/vnd.visio": "Visio Diagram",
    // OpenDocument
    "application/vnd.oasis.opendocument.text": "ODT Document",
    "application/vnd.oasis.opendocument.text-template": "ODT Template",
    "application/vnd.oasis.opendocument.spreadsheet": "ODS Spreadsheet",
    "application/vnd.oasis.opendocument.spreadsheet-template": "ODS Template",
    "application/vnd.oasis.opendocument.presentation": "ODP Presentation",
    "application/vnd.oasis.opendocument.presentation-template": "ODP Template",
    "application/vnd.oasis.opendocument.graphics": "ODG Drawing",
    // iWork
    "application/vnd.apple.pages": "Pages Document",
    "application/vnd.apple.numbers": "Numbers Spreadsheet",
    "application/vnd.apple.keynote": "Keynote Presentation",
  },
  archive: {
    "application/zip": "ZIP Archive",
    "application/x-tar": "TAR Archive",
    "application/gzip": "GZ Archive",
    "application/x-gzip": "GZ Archive",
    "application/x-bzip2": "BZ2 Archive",
    "application/x-7z-compressed": "7Z Archive",
    "application/x-rar-compressed": "RAR Archive",
    "application/vnd.rar": "RAR Archive",
    "application/x-xz": "XZ Archive",
    "application/zstd": "ZST Archive",
    "application/x-iso9660-image": "ISO Disk Image",
    "application/x-apple-diskimage": "DMG Disk Image",
    "application/java-archive": "JAR Archive",
    "application/vnd.android.package-archive": "APK Package",
    "application/x-apple-package": "PKG Installer",
    "application/x-deb": "Debian Package",
    "application/x-rpm": "RPM Package",
  },
  code: {
    "application/json": "JSON",
    "application/ld+json": "JSON-LD",
    "application/geo+json": "GeoJSON",
    "application/schema+json": "JSON Schema",
    "application/yaml": "YAML",
    "application/toml": "TOML",
    "application/xml": "XML",
    "text/xml": "XML",
    "application/xhtml+xml": "XHTML",
    "text/html": "HTML",
    "text/css": "CSS",
    "application/javascript": "JavaScript",
    "application/x-javascript": "JavaScript",
    "text/javascript": "JavaScript",
    "application/typescript": "TypeScript",
    "text/typescript": "TypeScript",
    "text/x-python": "Python",
    "application/x-python-code": "Python",
    "text/x-java-source": "Java",
    "text/x-csrc": "C Source",
    "text/x-chdr": "C Header",
    "text/x-c++src": "C++ Source",
    "text/x-c++hdr": "C++ Header",
    "text/x-csharp": "C#",
    "text/x-go": "Go",
    "text/x-rustsrc": "Rust",
    "text/x-ruby": "Ruby",
    "text/x-php": "PHP",
    "application/x-php": "PHP",
    "text/x-swift": "Swift",
    "text/x-kotlin": "Kotlin",
    "text/x-scala": "Scala",
    "text/x-haskell": "Haskell",
    "text/x-lua": "Lua",
    "text/x-perl": "Perl",
    "text/x-r-source": "R",
    "text/x-sh": "Shell Script",
    "application/x-sh": "Shell Script",
    "application/x-bash": "Bash Script",
    "application/x-zsh": "Zsh Script",
    "application/x-powershell": "PowerShell",
    "text/x-sql": "SQL",
    "application/sql": "SQL",
    "text/x-diff": "Diff / Patch",
    "application/x-patch": "Diff / Patch",
    "application/vnd.sqlite3": "SQLite Database",
    "application/x-sqlite3": "SQLite Database",
  },
  text: {
    "text/plain": "Plain Text",
    "text/csv": "CSV",
    "text/tab-separated-values": "TSV",
    "text/markdown": "Markdown",
    "text/x-rst": "reStructuredText",
    "text/x-asciidoc": "AsciiDoc",
    "text/rtf": "RTF",
    "application/rtf": "RTF",
    "font/ttf": "TrueType Font",
    "font/otf": "OpenType Font",
    "font/woff": "WOFF Font",
    "font/woff2": "WOFF2 Font",
    "application/x-font-ttf": "TrueType Font",
    "application/x-font-otf": "OpenType Font",
    "application/font-woff": "WOFF Font",
    "text/calendar": "Calendar",
  },
  "3d": {
    "model/gltf+json": "glTF 3D Model",
    "model/gltf-binary": "glTF Binary 3D Model",
    "model/obj": "OBJ 3D Model",
    "model/stl": "STL 3D Model",
    "application/sla": "STL 3D Model",
    "application/x-step": "STEP CAD File",
    "application/x-iges": "IGES CAD File",
    "application/x-blender": "Blender File",
    "application/vnd.google-earth.kml+xml": "KML",
    "application/vnd.google-earth.kmz": "KMZ",
    "application/gpx+xml": "GPX",
  },
  binary: {
    "application/octet-stream": "Binary File",
    "application/wasm": "WebAssembly",
    "application/x-java-class": "Java Class",
    "application/x-msdownload": "Windows Executable",
    "application/x-executable": "Executable",
    "application/x-elf": "ELF Binary",
    "application/x-mach-binary": "Mach-O Binary",
    "multipart/form-data": "Form Data",
    "application/x-www-form-urlencoded": "Form Data",
    "message/rfc822": "Email Message",
    "application/vnd.ms-outlook": "Outlook Message",
    "application/vnd.apple.pkpass": "Apple Wallet Pass",
    "application/x-pkcs12": "PKCS#12 Certificate",
    "application/x-x509-ca-cert": "X.509 Certificate",
    "application/pgp-keys": "PGP Key",
    "application/pgp-encrypted": "PGP Encrypted Data",
  },
}

interface MimeMetadata {
  label: string
  kind: MimeIconKind
}

const MIME_DB = new Map<string, MimeMetadata>()

for (const [kind, mimes] of Object.entries(MIME_GROUPS)) {
  for (const [mime, label] of Object.entries(mimes)) {
    MIME_DB.set(mime, { label, kind: kind as MimeIconKind })
  }
}

export function normalizeMimeType(mimeType?: string | null): string {
  const value = mimeType?.trim()
  return value ? value : DEFAULT_MIME_TYPE
}

/** Converts a MIME type to a friendly label */
export function mimeToLabel(mime: string): string {
  const entry = MIME_DB.get(mime)
  if (entry) return entry.label

  // Fallback generation for unknown MIME types
  const [type, subtype] = mime.split("/")
  const ext = subtype?.replace(/^x-/, "").toUpperCase() ?? "File"
  const category = MEDIA_CATEGORY[type]

  return category ? `${ext} ${category}` : ext
}

/** Determines the best icon category for a MIME type */
export function getFileIconKind(mimeType: string): MimeIconKind {
  const entry = MIME_DB.get(mimeType)
  if (entry) return entry.kind

  // Fallback matching for unknown MIME types
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.startsWith("audio/")) return "audio"
  if (mimeType.startsWith("model/")) return "3d"
  if (mimeType.startsWith("text/")) return "text"

  return "document" // Defaulting to document or binary usually makes more sense than text
}
