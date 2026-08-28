# Sparkline Follow-up Work

## PR 1: Historical data readiness

A dynamically evaluated period can temporarily have no usable duration. This
is not specific to Flexible Horseshoe Card inputs: a Home Assistant helper or sensor can also be
`unknown` or `unavailable`, and arbitrary JavaScript can produce `undefined` or
`NaN`.

The sparkline should only create its graph and request history when the active
duration is a finite positive number. Until then it renders nothing, performs
no history request, and waits for the next normal entity update. It must not
substitute the 24-hour calendar default for an unresolved rolling-window
duration. Real-time graphs remain independent of duration and history.

Historical graphs must also remain empty while their first valid history
request is pending. Rolling-window and active-calendar graphs currently use
the current entity value as a temporary one-item history series, which produces
a misleading flat graph. Remove that placeholder behavior for every historical
mode. Do not calculate paths or statistics until Home Assistant history has
been accepted. Only then append the current entity state to active history.

The empty historical SVG has no pointer interaction. It preserves the configured
layout position and dimensions for the separate loading-indicator work.

This is runtime readiness, not a configuration error. JavaScript itself still
follows the normal template contract; expressions that throw remain user
configuration errors.

## PR 2: History loading indicator

Changing a dynamic duration can either reduce or expand the requested history
range:

- A reduction such as seven days to one day can be rendered immediately from
  the already loaded series.
- An expansion such as one day to seven days requires history that is not yet
  present. Rendering the short series against the larger range can temporarily
  produce a misleading straight line.

When the requested range is not represented by the accepted series and a
history request is active, render a spinner centered in the actual graph
viewport. Initial loading has no graph behind the spinner. During later range
expansion, retain the previous graph at `opacity: 0.2`; dim data, grid, axes,
ticks, and labels together. Disable pointer interaction, tooltips, and active
indicators until the matching response has been accepted. The spinner is a
separate full-opacity SVG layer. Responses for an obsolete runtime period
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
