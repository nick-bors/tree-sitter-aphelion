# tree-sitter-aphelion

This is an (incomplete) grammar for aphelion syntax.

> [!WARNING]  
> This project is not entirely complete and may not cover all of luna aphel64
> syntax. If this is the case, please submit an issue describing what isn't
> getting highlighted properly, as well as any relevant aphel64 snippets.

## Neovim setup
> [!IMPORTANT]
> This guide assumes the following prerequisites:
>   - You have correctly set up `nvim-treesitter` in your neovim configuration
>   - You are on a modern unix derivative (Linux, MacOs, *bsd, ...)
> Complete these first if you have not done so yet.

To use it with neovim, copy `queries/aphelion` to your neovim config 
directory (typically `~/.config/nvim/`).

```bash
$ mkdir ~/.config/nvim/queries
$ cp -r queries/aphelion ~/.config/nvim/queries
```

You can also symlink these so they update when you pull this repo. You should
use an absolute path here so the link doesnt break as you move directories.

```bash
$ mkdir -p ~/.config/nvim/queries
$ ln -s "$(pwd)/queries/aphelion" ~/.config/nvim/queries/aphelion
```

Next, in your `config` function for `nvim-treesitter`, load the parser as shown
below:

```lua
-- example for pckr.nvim
{'nvim-treesitter/nvim-treesitter',
	config = function()
		local parse_config = require("nvim-treesitter.parsers").get_parser_configs()
		parser_config.aphelion = {
			install_info = {
				url = "https://github.com/nick-bors/tree-sitter-aphelion.git",
				files = { "src/parser.c" },
				branch = "main",
			},
			filetype = "aphelion",
		}

		-- make sure this is AFTER the parser_config thing, so that
		-- nvim-treesitter can recognise "aphelion" as a parser.
		require('nvim-treesitter.configs').setup({
			ensure_installed = { 
				-- other languages
				"aphelion"
			},
			-- rest of config
		})
		
		-- filetype registration and detection
		vim.filetype.add({
			extension = {
				aphel = function(_, _)
					return "aphelion"
				end,
				aphel64 = function(_, _)
					return "aphelion"
				end,
				s = function(_, bufnr)
					-- read first 50 lines, assume there's a section
					-- somewhere there following aphelion syntax
					local lines = vim.api.nvim_buf_get_lines(bufnr, 0, 50, false)

					for _, line in ipairs(lines) do
						local trimmed = line:match("^%s*(.-)$")

						if trimmed ~= ""
							and not trimmed:match("^#")
							and trimmed:match([[%f[%w]section%f[%W]%s+"[^"]+"]])
						then
							return "aphelion"
						end
					end
				end,

				asm = function(_, bufnr)
					return vim.filetype.match({ buf = bufnr, filename = "x.s" })
				end,
			},
		})
	end
}
```
This is package-manager agnostic, so you can easily adapt it to your package 
manager of choice (e.g Lazy.nvim). Make sure that this is in the `setup` or 
`config` callback that runs on plugin load.

Thats all! You should now have beautiful tree-sitter highlighting for `aphel64` 
assembly.
