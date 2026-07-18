// Triggers a browser "Save As" download for an in-memory Blob (used for the
// certificate PDF, which arrives as an authenticated axios blob response
// rather than a plain <a href> link, since the API requires a Bearer token).
export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
