import React from 'react';

export default class SpellSearch extends React.Component {
    constructor(props) {
        super(props);

        this.handleCriteriaChange = this.handleCriteriaChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }
    handleFilterChange(filterType, filterValue, checked) {
        if (filterValue === 'x') {
            this.props.onCriteriaChange(filterType, []);
        } else {
            var filters = [];
            switch (filterType) {
                case 'levels':
                    filters = [... this.props.levels];
                    break;
                case 'rarities':
                    filters = [... this.props.rarities];
                    break;
                case 'traditions':
                    filters = [... this.props.traditions];
                    break;
                case 'sources':
                    filters = [... this.props.sources];
                    break;
            }
            var idx = filters.indexOf(filterValue);
            if (idx == -1 && checked) filters.push(filterValue);
            else if (idx != -1 && !checked) filters.splice(idx, 1);
            this.props.onCriteriaChange(filterType, filters);
        }
    }
    handleCriteriaChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.props.onCriteriaChange(name, value);
    }
    formSubmitAttempted(e) {
        e.preventDefault();
        document.activeElement.blur();
        return false;
    }
    render() {
        var spellOption = null;
        var showSpellOptions = (this.props.spellType && this.props.spellTypes.find(t => t.name == this.props.spellType).options.length > 1);

        var levelOptions = Array.from({ length: 11}, (_, i) => i == 0 ? 'C': i).concat('x');
        var rarityOptions = ['common', 'uncommon', 'rare', 'x'];
        var traditionOptions = ['arcane', 'divine', 'occult', 'primal', 'none', 'x'];
        var sourceOptions = ['Player Core', 'Player Core 2', 'Rage of Elements', 'Secrets of Magic', 'x'];

        return (
            <form className="spell-search row" onSubmit={this.formSubmitAttempted}>
                <div className="col-md filters">
                    <div className="level-row">{levelOptions.map((l) => {
                        return <span key={l} className="level-col">
                            <input id={"level-" + l} name='level' type="checkbox" checked={this.props.levels.indexOf(l) != -1} onChange={(ev) => this.handleFilterChange('levels', l, ev.target.checked)} value={l} />
                            <label htmlFor={"level-" + l} className="form-check-label">{String(l)}</label>
                        </span>;
                    })}</div>
                    <div className="tradition-row">{traditionOptions.map((t) => {
                        return <span key={t} className="tradition-col">
                            <input id={"tradition-" + t} name='tradition' type="checkbox" checked={this.props.traditions.indexOf(t) != -1} onChange={(ev) => this.handleFilterChange('traditions', t, ev.target.checked)} value={t} />
                            <label htmlFor={"tradition-" + t} className="form-check-label">{String(t)}</label>
                        </span>;
                    })}</div>
                    <div className="rarity-row">{rarityOptions.map((r) => {
                        return <span key={r} className="rarity-col">
                            <input id={"rarity-" + r} name='rarity' type="checkbox" checked={this.props.rarities.indexOf(r) != -1} onChange={(ev) => this.handleFilterChange('rarities', r, ev.target.checked)} value={r} />
                            <label htmlFor={"rarity-" + r} className="form-check-label">{String(r)}</label>
                        </span>;
                    })}</div>
                    <div className="source-row">{sourceOptions.map((s) => {
                        return <span key={s} className="source-col">
                            <input id={"source-" + s} name='source' type="checkbox" checked={this.props.sources.indexOf(s) != -1} onChange={(ev) => this.handleFilterChange('sources', s, ev.target.checked)} value={s} />
                            <label htmlFor={"source-" + s} className="form-check-label">{String(s)}</label>
                        </span>;
                    })}</div>
                </div>
                <div className="col-md criteria">
                    <div className="form-row">
                        <label htmlFor="spellName" className="col-form-label form-label">Search</label>
                        <div className="col">
                            <input className="form-control" id="spellName" name="spellName" type="search" value={this.props.spellName} onChange={this.handleCriteriaChange}
                                autoCapitalize="off"
                                autoComplete="off"
                                spellCheck="false"
                                autoCorrect="off" />
                        </div>
                    </div>
                    <div className="form-row">
                        <label htmlFor="spellType" className="col-form-label form-label">Type</label>
                        <div className="col">
                            <select className="form-control" id="spellType" name="spellType" value={this.props.spellType} onChange={this.handleCriteriaChange}>
                                <option value="">All</option>
                                {this.props.spellTypes.map((p) => { return <option key={p.name} value={p.name}>{p.name}</option> })}
                            </select>
                        </div>
                    </div>
                    {showSpellOptions ?
                        <div className="form-row">
                            <label htmlFor="spellOption" className="col-form-label form-label">Subtype</label>
                            <div className="col">
                                <select className="form-control" id="spellOption" name="spellOption" value={this.props.spellOption} onChange={this.handleCriteriaChange}>
                                    <option value="">{this.props.spellTypes.find(t => t.name == this.props.spellType)?.allLabel || "All"}</option>
                                    {this.props.spellTypes.find(t => t.name == this.props.spellType).options.map((p) => { return <option key={p.value} value={p.value}>{p.name}</option> })}
                                </select>
                            </div>
                        </div>
                        : null}
                    <div className="form-row">
                        <label htmlFor="sortBy" className="col-form-label form-label">Sort By</label>
                        <div className="col">
                            <select className="form-control" id="sortBy" name="sortBy" value={this.props.sortBy} onChange={this.handleCriteriaChange}>
                                {this.props.sortOptions.map((p) => { return <option key={p} value={p}>{p}</option> })}
                            </select>
                        </div>
                    </div>
                    <div className="form-row d-none d-sm-flex">
                        <label htmlFor="displayMode" className="col-form-label form-label">Display As</label>
                        <div className="col">
                            <select className="form-control" id="displayMode" name="displayMode" value={this.props.displayMode} onChange={this.handleCriteriaChange}>
                                {this.props.displayModes.map((p) => { return <option key={p} value={p}>{p}</option> })}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
};  