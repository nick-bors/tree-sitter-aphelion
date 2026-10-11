(immediate) @number

(string) @string
(identifier) @variable

(mnemonic) @function

(label (label_attribute) @attribute)
(label name: (identifier) @label)
	
(define_decl name: (identifier) @variable @constant.macro)
"define" @keyword.directive.define

(data (data_modifier) @keyword.modifier)
;(data) @keyword.directive

(section (section_attribute) @attribute)
"section" @keyword

[
  "align"
  "loc"
  "byte"
  "qword"
  "hword"
  "word"
  "string"
] @keyword.directive

(section name: (string) @string)

(register) @variable @variable.builtin

(comment) @comment @spell

[
  "+"
  "-"
  "*"
  "/"
  "%"
  "|"
  "="
;  "^"
  "&"
] @operator

[
  ","
  ":"
] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
] @punctuation.bracket
