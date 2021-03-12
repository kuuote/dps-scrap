nnoremap <buffer> <CR> <Cmd>call denops#notify("scrap", "jump", [getline(line(".")), charcol(".")])<CR>
command! -buffer ScrapLinks call scrap#showlinks('new')

setlocal tabstop=2
setlocal softtabstop=2
setlocal shiftwidth=2
setlocal noexpandtab
setlocal autoindent
