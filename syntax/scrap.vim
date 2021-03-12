if exists('b:current_syntax')
  finish
endif

syn match ScrapLink /\[[^\]]\+\]/

hi def link ScrapLink Underlined

let b:current_syntax = 'scrap'
