# TODO

## same_as ref replacement

When an item overrides a `same_as` field with `ref(...)`, treat that field as a full replacement instead of merging it with the referenced item.

This is especially important for list-like config blocks such as `color_stops.colors`, where a referenced constant usually means: use this complete list here.

The item should still be able to add or override explicit local fields after the replacement, but it should not accidentally inherit list entries from the `same_as` source.
