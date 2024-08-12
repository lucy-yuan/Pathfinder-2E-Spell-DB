let spells = require("./../data/spells.json");
const overrides = require("./../data/dino.json");
const condition = require("./../data/condition.json");
const spellTypes = require("./../data/spellTypes.json");
export function loadSpellData() {
    spells = spells.filter(function(x) { 
        return !overrides.find(function(y) { return x.name == y.name});
    });
    spells = spells.concat(overrides);
    spells = spells.concat(condition);
    return { spells, spellTypes };
};