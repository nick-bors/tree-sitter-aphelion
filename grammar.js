/**
 * @file Tree sitter grammar for Aphel64 assembly
 * @author Nick Bors <nick@nickbors.cc>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "aphelion",

  extras: $ => [
    /[ \t\r]/,
    $.comment,
  ],

  rules: {
    source_file: $ => seq($._statement, repeat(seq($._terminator, optional($._statement)))),
    _terminator: $ => token(/\n+/),

    _statement: $ => choice(
      $.section,
      $.label,
      $.instruction,
      $.data,
      $.define_decl,
    ),

    section: $ => seq(
      repeat($.section_attribute),
      field("start", "section"),
      field("name", $.string),
      optional($.section_spec)
    ),

    define_decl: $ => seq(field("directive", "define"), field("name", choice($.string, $.identifier)), "=", $._expression),

    section_attribute: $ => token(prec(1, choice(
        "unmapped",
        "writable",
        "executable",
        "threadlocal",
        "blank",
        "common",
    ))),

    section_spec: $ => seq(field("directive", "align"), $._expression),

    label: $ => seq(repeat($.label_attribute), optional("."), field("name", $.identifier), ":"),

    label_attribute: $ => token(prec(1, choice(
	    "global",
	    "local",
	    "weak",
    ))),

    data: $ => seq(optional($.data_modifier), $.data_directive),

    data_directive: $ => choice(
      seq("align", $._expression),
      seq("loc", $._expression),
      seq("byte", $._expression),
      seq("qword", $._expression),
      seq("hword", $._expression),
      seq("word", $._expression),
      seq("string", $.string),
    ),

    data_modifier: $ => choice("unaligned", seq("repeat", $._expression)),

    mnemonic: _ => choice(
      /ssi(\.c)?/,
      /auir/,
      /fence(\.[sl])?/,
      /cinval(\.([id].)?(block|page|all))?/,
      /cfetch(\.(l|s|i|ls|li|si|lsi))?/,
      /tinval(\.(page|priv|all))?/,
      /(sys|f)?call/,
      /breakpt/,
      /spin/,
      /i?ret/,
      /[sl]ctrl/,
      /wait/,
      /(add|sub|and|or|nor|xor|mul)i?/,
      /[ui]mulh/,
      /[ui]mulh/,
      /[ui]divi?/,
      /[ui]remi?/,
      /s[ui]l(e|t)i?/,
      /seqi?/,
      /(sc?|ll?)[whqb]i?/,
      /jlr?/,
      /b[zn]/,
      /[ui]sr/,
      /ro[rl]/,
      /sl/,
      /si(\.[ui])?/,
      /mb(\.i)?/,
      /rev(\.([hqb]|bit))?/,
      /ext/,
      /dep/,
      /l(i|f?a)/,
      /[ls][whqb]a/,
      /nop/,
      /mov/,
      /c([tl]z|sb)/,
    ),

    instruction: $ => prec.right(seq(
      field("mnemonic", $.mnemonic),
      optional(seq(
        field("operands", $._inst_operand),
        repeat(seq(",", field("operands", $._inst_operand))),
      )),
    )),

    _inst_operand: $ => choice(
      $.register,
      $._expression
    ),

    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.atom,
    ),

    unary_expression: $ => prec(5,
      seq(
        field("operator", choice("-", "~")),
        field("operand", $._expression)
      )
    ),

    binary_expression: $ => choice(
      prec.left(4,
        seq(
          field("left", $._expression),
          field("operator", choice("*", "/", "%")),
          field("right", $._expression)
        )
      ),
      prec.left(3,
        seq(
          field("left", $._expression),
          field("operator", choice("+", "-")),
          field("right", $._expression)
        )
      ),
      prec.left(2,
        seq(
          field("left", $._expression),
          field("operator", "&"),
          field("right", $._expression)
        )
      ),
      prec.left(1,
        seq(
          field("left", $._expression),
          field("operator", "|"),
          field("right", $._expression)
        )
      ),
    ),

    atom: $ => choice(
      $.identifier,
      $.immediate,
      $.string,
      seq("(", $._expression, ")"),
      $.memory
    ),

    memory: $ => seq(
      "[",
      $.register,
      optional(seq("+", $.register)),
      optional(seq("+", $._expression)),
      "]"
    ),

    register: $ => token(choice(
      /zr/,
      /a[0-5]/,
      /l([0-9]|1[0-3])/,
      /t[0-5]/,
      /[tfsli]p/,
      /int([0-9]|1[0-5])/,
      /int(ip|val|pte|cause|stat)/,
      /[ku]ptp/,
      /stat/,
    )),

    immediate: $ => token(
      choice(
        /-?(\d|_)+/,
        /-?0x[0-9a-fA-F_]+/,
      )
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: $ => token(choice(
      seq(choice('//', '#', ';'), /(\\+(.|\r?\n)|[^\\\n])*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/',
      ),
    )),

    string: $ => seq(
      '"',
      repeat(choice($._escape_sequence, /[^"\\]/)),
      '"',
    ),

    _escape_sequence: $ => token(
      seq(
        '\\',
        choice(
          /[abfnrtv\\'"?]/,
          /[0-7]{1,3}/,
          /x[0-9a-fA-F]{2}/,
          /u[0-9a-fA-F]{4}/,
          /U[0-9a-fA-F]{8}/,
        ),
      ),
    ),

  }
});
