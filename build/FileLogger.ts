export class FileLogger {
  private filesPerLine: number = 1
  private buffer: string[] = []
  private pad: number = 2
  
  constructor(filesPerLine: number = 1) {
    if (filesPerLine && filesPerLine > 2) {
      this.filesPerLine = filesPerLine
    }
  }

  log(file: string) {
    this.buffer.push(file)
    if (this.buffer.length >= this.filesPerLine) {
      this.flush()
    }
  }

  flush() {
    if (this.buffer.length) {
      this.pad = Math.max(this.pad, ...this.buffer.map(file => file.length + 2))
      const files = this.buffer.map(file => {
        const missingPad = Math.max(this.pad - file.length, 2)
        return file + ' '.repeat(missingPad)
      })

      console.log(files.join('  ').trim())
      this.buffer = []
    }
  }
}