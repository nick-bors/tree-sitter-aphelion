(instruction mnemonic: (identifier) @function.builtin)

(label (label_attribute) @attribute.builtin)
	
(section (section_attribute) @attribute.builtin)

(register) @variable.builtin

(comment) @comment @spell

(identifier) @variable
(string) @string
(immediate) @number

[
;  "include"
;  "forceinclude"

  "section"
;  "symbol"
;  "define"
;  "loc"

;  "entry"

; "global"
;  "local"
;  "weak"

;  "repeat"
;  "unaligned"

;  "align"
;  "zero"
;  "byte"
;  "qword"
;  "hword"
;  "word"
;  "string"

  ; "unmapped"
  ; "executable"
  ; "writable"
  ; "blank"
  ; "pinned"
  ; "common"
  ; "nonvolatile"
  ; "unique"
] @keyword

[
  "+"
  "-"
  "*"
  "/"
  "%"
  "|"
;  "^"
  "&"
] @operator

[
  ","
  ":"
] @punctuation.delimiter

[
  ")"
  "("
  "]"
  "["
] @punctuation.bracket
