import XCTest
import SwiftTreeSitter
import TreeSitterAphelion

final class TreeSitterAphelionTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_aphelion())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Aphelion grammar")
    }
}
