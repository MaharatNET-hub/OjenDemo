export function downloadTextFile(filename: string, content: string, mime = 'text/csv;charset=utf-8;') {
  const blob = new Blob(['﻿' + content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function toCsvRow(cells: (string | number)[]): string {
  return cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',') + '\r\n'
}
