if exists('g:loaded_scrap')
  finish
endif
let g:loaded_scrap = 1

augroup scrap
  autocmd!
  "autocmd User DenopsReady call denops#register('scrap', s:script)
  autocmd BufEnter *.scp nnoremap <buffer> <CR> <Cmd>call denops#notify("scrap", "jump", [getline(line(".")), col(".")])<CR>
  autocmd BufEnter *.scp command! ScrapLinks call scrap#showlinks('new')
augroup END
