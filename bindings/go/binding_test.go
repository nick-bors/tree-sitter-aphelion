package tree_sitter_aphelion_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_aphelion "github.com/nick-bors/tree-sitter-aphelion.git/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_aphelion.Language())
	if language == nil {
		t.Errorf("Error loading Aphelion grammar")
	}
}
