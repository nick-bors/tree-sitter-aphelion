import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.aphelion.TreeSitterAphelion;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterAphelionTest {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterAphelion.language()));
    }
}
