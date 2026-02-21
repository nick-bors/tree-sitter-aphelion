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
      $.instruction
    ),

    section: $ => seq(
      repeat($.section_attribute),
      token("section"),
      field("name", $.string)
    ),
    
    section_attribute: $ => token(prec(1, choice(
        "unmapped",
        "writable",
        "executable",
        "blank",
        "pinned",
        "common",
        "nonvolatile",
        "unique",
    ))),

    label: $ => seq(repeat($.label_attribute), field("name", $.identifier), ":"),

    label_attribute: $ => token(prec(1, choice(
	"entry",
	"global",
	"local",
	"weak",
    ))),

    instruction: $ => prec.right(seq(
      field("mnemonic", $.identifier),
      optional(seq(
        field("operands", $._expression),
        repeat(seq(",", field("operands", $._expression))),
      )),
    )),

    _expression: $ => choice(
      $.binary_expression,
      $.unary_expression,
      $.atom,
    ),

    unary_expression: $ => prec(5,
      seq(
        field("operator", choice("-", "~")),
        field("argument", $._expression)
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
      $.register,
      $.identifier,
      $.immediate,
      $.string,
      seq(/[\[\(]/, $._expression, /[\)\]]/),
    ),

    register: $ => token(choice(
      "zr",
      /a[0-5]/,
      /l[0-13]/,
      /t[0-5]/,
      "[tfsli]p",
      /int[0-15]/,
      /int(ip|val|pte|cause|stat)/,
      /[ku]ptp/,
      "stat",
    )),

    immediate: $ => token(
      choice(
        /-?(\d|_)+/,
        /-?0x[0-9a-fA-F_]+/,
      )
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => token(seq(choice("#", ";", "//"), /.*/)),

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
