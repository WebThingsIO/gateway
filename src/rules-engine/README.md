# rules-engine
WebThings Gateway Rules Engine

The rules engine takes a list of rules and communicates with the gateway to
translate the rules into effects on things.

## Design

### Rules

A rule is a trigger and an effect. In english, a rule can be represented as "if
`trigger` happens then `effect` occurs". Triggers can be anything from
observations of things like "kitchen light is on" to abstract statements like
"it's 9:00 AM". Right now effects are effects on thing properties, like "turn
light on" or "set thermostat to 25&deg;". In the future, both triggers and
effects can expand to include online services.

### System overview
![System diagram](doc/fig.png)

The Rules Engine coordinates the rules by listening to the Gateway for thing
property changes. If a rule's trigger is met, the rule will tell the rules
engine its desired effect. The engine will then communicate this effect to the
gateway which then forwards it on to the physical thing.
