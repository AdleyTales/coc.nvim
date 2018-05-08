import { Neovim } from 'neovim'
import {CompleteOption, CompleteResult} from '../types'
import Source from '../model/source'
import buffers from '../buffers'

export default class Buffer extends Source {
  constructor(nvim: Neovim) {
    super(nvim, {
      name: 'buffer',
      shortcut: 'B'
    })
  }
  public async shouldComplete(opt: CompleteOption): Promise<boolean> {
    if (!this.checkFileType(opt.filetype)) return false
    let {input} = opt
    if (input.length === 0) return false
    return true
  }

  public async refresh():Promise<void> {
    await buffers.refresh(this.nvim)
  }

  public async doComplete(opt: CompleteOption): Promise<CompleteResult> {
    let {bufnr, input} = opt
    let words = buffers.getWords(bufnr)
    return {
      items: words.map(word => {
        return {
          word,
          menu: this.menu
        }
      })
    }
  }
}
