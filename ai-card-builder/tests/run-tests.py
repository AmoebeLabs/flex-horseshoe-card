fhs_user_templates:
  templates:
    demo:
      template:
        type: card
        defaults:
        - entity: sensor.demo
      card:
        type: custom:flex-horseshoe-card
        entities:
        - entity: '[[entity]]'
        constants:
          center: 50
        layout:
          groups:
          - id: center
            xpos: 50
            ypos: 50
          gradients:
            fade:
              type: linear
              stops:
              - offset: 0
                color: black
              - offset: 100
                color: white
          clips:
            round:
              circles:
              - xpos: 50
                ypos: 50
                radius_percent: 50
          masks:
            roundmask:
              circles:
              - xpos: 50
                ypos: 50
                radius_percent: 50
          circles:
          - id: ring
            xpos: 50
            ypos: 50
            radius_percent: 40
          states:
          - id: value
            entity_index: 0
            xpos: 50
            ypos: 50
            old_unused_field: true
    default_entities_demo:
      template:
        type: card
      card:
        type: custom:flex-horseshoe-card
        default_entities:
        - entity: sensor.default
          slot: main
          name: Default name
        layout:
          states:
          - id: s
            entity_index: 0
            xpos: 50
            ypos: 50
views:
- title: Test
  cards:
  - type: custom:flex-horseshoe-card
    template:
      name: demo
      variables:
      - entity: sensor.one
  - type: custom:flex-horseshoe-card
    template:
      name: demo
      variables:
      - entity: sensor.two
  - type: custom:flex-horseshoe-card
    grid_options:
      columns: 6
    view_layout:
      grid-area: demo
    entities:
    - entity: sensor.one
    - entity: sensor.two
    constants:
      zpos:
        horseshoes: 10
    layout:
      controls:
      - id: t
        type: toggle
        entity_index: 0
        show:
          item_variant: switch
          item_viz: default
          item_style: ha
      - id: s
        type: select
        entity_index: 0
        option_map:
        - value: one
          text: One
        show:
          item_variant: segmented
          item_viz: viz_line
          item_style: outlined_round
        viz_line: {}
      - id: n
        type: number
        entity_index: 0
        show:
          item_variant: stepper
          item_viz: buttons
          item_style: filled_square
      - id: b
        type: button
        entity_index: 0
        show:
          item_variant: default
          item_viz: viz_button
          item_style: outlined_round
      - id: sl
        type: slider
        values:
        - entity_index: 0
        - entity_index: 1
        interaction:
          update_interval: 200
        value:
          position: top
        show:
          item_variant: range
          item_viz: circular
          item_style: ha
      horseshoes:
      - id: hs
        bar_mode: '[[[ return ''normal''; ]]]'
      sparklines:
      - id: sp
        zpos: calc(zpos.horseshoes - 1)
        width: 40
        height: 20
        period:
          type: '[[[ return ''rolling_window''; ]]]'
          rolling_window:
            bins:
              density: '[[[ return ''medium''; ]]]'
        sparkline:
          animate: true
          colorstops_transition: '[[[ return ''smooth''; ]]]'
          styles: {}
          show:
            chart_type: line
            chart_variant: '[[[ return ''line''; ]]]'
            grid: false
            axis:
              x: true
              y: false
  - type: custom:flex-horseshoe-card
    show:
      horseshoe: true
    horseshoe_scale:
      min: 0
      max: 100
    color_stops:
      colors:
        0: red
        100: green
  - type: custom:flex-horseshoe-card
    template: default_entities_demo
    entities:
    - entity: sensor.default
      name: Override name
  - type: custom:flex-horseshoe-card
    layout:
      aspectratio: 1/1
    cards:
      - type: custom:flex-horseshoe-card
        xpos: 25
        ypos: 65
        width: 40
        height: 40
        zpos: 2
        frameless: true
        style: |
          ha-card { background: transparent; }
        entities:
          - entity: sensor.child
        layout:
          states:
            - id: child-state
              entity_index: 0
              xpos: 50
              ypos: 50
