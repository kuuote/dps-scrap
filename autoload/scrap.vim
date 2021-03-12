function! s:jumplink() abort
  let l = getline('.')
  if l[0] == "\t"
    call win_gotoid(b:scrap_winpage)
    execute printf('edit %s/%s.scp', expand('%:p:h'), l[1:])
  endif
endfunction

function! s:updatelinks() abort
  if !has_key(w:, 'scrap_links')
    return
  endif
  let project_path = expand('%:p:h')
  let page_name = expand('%:t:r')
  call denops#notify("scrap", "updateLinks", [w:scrap_links, project_path, page_name])
endfunction

function! scrap#showlinks(cmd) abort
  let winpage = win_getid()
  execute a:cmd
  setlocal buftype=nofile bufhidden=hide noswapfile
  let linkspage = bufnr()
  let b:scrap_winpage = winpage
  nnoremap <buffer> <nowait> <silent> <CR> :<C-u>call <SID>jumplink()<CR>

  call win_gotoid(winpage)

  let w:scrap_links = linkspage
  augroup scrap_showlinks
    autocmd!
    autocmd BufWinEnter *.scp ++nested call s:updatelinks()
    autocmd BufWritePost *.scp ++nested call s:updatelinks()
  augroup END
  call s:updatelinks()
endfunction
