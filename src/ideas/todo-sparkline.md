# Sparkline Follow-up Work

## Dynamic duration readiness

A dynamically evaluated period can temporarily have no usable duration. This
is not specific to FHS inputs: a Home Assistant helper or sensor can also be
`unknown` or `unavailable`, and arbitrary JavaScript can produce `undefined` or
`NaN`.

The sparkline should only create its graph and request history when the active
duration is a finite positive number. Until then it renders nothing, performs
no history request, and waits for the next normal entity update. It must not
substitute the 24-hour calendar default for an unresolved rolling-window
duration.

This is runtime readiness, not a configuration error. JavaScript itself still
follows the normal template contract; expressions that throw remain user
configuration errors.

## History loading indicator

Changing a dynamic duration can either reduce or expand the requested history
range:

- A reduction such as seven days to one day can be rendered immediately from
  the already loaded series.
- An expansion such as one day to seven days requires history that is not yet
  present. Rendering the short series against the larger range can temporarily
  produce a misleading straight line.

When the requested range is not represented by the loaded series and a history
request is active, hide the incomplete graph and render a spinner centered in
the actual graph viewport. Replace it with the graph only after the matching
history response has been accepted. Responses for an obsolete runtime period
remain ignored.

An unresolved duration does not show a spinner because no request is active.
The spinner represents history I/O only.

Use a native SVG indeterminate spinner rather than an HTML Home Assistant
component inside a `foreignObject`. The outer spinner rotates continuously while
the visible arc grows and shrinks using animated `stroke-dasharray` and
`stroke-dashoffset`, matching familiar Material circular-progress behavior.
This requires no library and works in desktop browsers and Companion App
WebViews. Center it using the graph calculated x/y position and width/height,
excluding external axis and label space.

Testing should cover initial loading, range reduction, range expansion,
multiple rapid duration changes, stale responses, missing duration, calendar
and rolling-window periods, reduced-motion behavior, and more than one
sparkline in the same card.
