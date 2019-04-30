// Custom shadow painting code instead of neo-blessed's default

if (this.shadow) {
    // right
    y = Math.max(yi + 1, 0);
    for (; y < yl + 1; y++) {
        if (!lines[y]) break;
        x = xl;
        for (; x < xl + 2; x++) {
            if (!lines[y][x]) break;
            // Just make the shadows black, the blending tends to now work
            lines[y][x][0] = colors.colorNames.black;
            lines[y].dirty = true;
        }
    }
    // bottom
    y = yl;
    for (; y < yl + 1; y++) {
        if (!lines[y]) break;
        for (x = Math.max(xi + 1, 0); x < xl; x++) {
            if (!lines[y][x]) break;
            // Just make the shadows black, the blending tends to now work
            lines[y][x][0] = colors.colorNames.black;
            lines[y].dirty = true;
        }
    }
}