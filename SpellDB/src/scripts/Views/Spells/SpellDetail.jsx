import React from 'react';
import ReactMarkdown from 'react-markdown';
import { RemarkPlugins, RemarkRenderers } from '../Utils/RemarkExtensions.jsx';
import ActionIcons from '../Utils/ActionIcons.jsx';
import Trait from '../Utils/Trait.jsx';
import VancianPrep from '../Bookmarks/VancianPrep.jsx';
import SpellAltPrep from './SpellAltPrep.jsx'

export default class SpellDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.addAltPrep = this.addAltPrep.bind(this);
    }
    addAltPrep() {
        this.props.bookmarkManager.addAltPrep(this.props.spell.name);
    }
    toggleBookmark() {
        this.props.bookmarkManager.toggleSpell(this.props.spell.name);
    }
    getVancianIcon(mode) {
        switch (mode) {
            case 'prep': return 'fa-book';
            case 'cast': return 'fa-magic';
        }
    }
    render() {
        var spell = this.props.spell;
        
        var cardSize = false;
        var actionToTheTop = true;
        var actions = (<span><ActionIcons action={spell.action} />{(spell.actionMax && <span> to <ActionIcons action={spell.actionMax} /></span> )}</span>);

        var headerTokens = [];
        if (!actionToTheTop && spell.action) headerTokens.push({'title': 'Action', 'value': actions});
        if (spell['casting-time']) headerTokens.push({ 'title': 'Casting Time', 'value': spell['casting-time'] });
        if (spell.trigger) headerTokens.push({ 'title': 'Trigger', 'value': spell.trigger });
        if (spell.range) headerTokens.push({ 'title': 'Range', 'value': spell.range });
        if (spell.area) headerTokens.push({ 'title': 'Area', 'value': spell.area });
        if (spell.targets) headerTokens.push({ 'title': 'Targets', 'value': spell.targets });
        if (spell.prerequisites) headerTokens.push({ 'title': 'Prerequisites', 'value': spell.prerequisites });
        if (spell.duration) headerTokens.push({ 'title': 'Duration', 'value': spell.duration });
        if (spell.cost) headerTokens.push({ 'title': 'Cost', 'value': spell.cost });
        if (spell.requirements) headerTokens.push({ 'title': "Requirements", 'value': spell.requirements });
        if (spell.value) headerTokens.push({ 'title': "Value", 'value': spell.value });
        if (spell.affected) headerTokens.push({ 'title': "Affects", 'value': spell.affected });

        var bodySections = [];
        bodySections.push({ 'title': null, className: 'mainText', 'text': spell.description });
 
        for (var level in spell.heightened) {
            bodySections.push({'title': <strong>Heightened({level}): </strong>, 'className': 'heighten', 'text': spell.heightened[level] });
        }

        return (
            <div className={cardSize ? "spellDetail clearfix cardSize" : "spellDetail clearfix"}>
                <div className="title">
                    <span className="spellName">
                        {spell.name} {(actionToTheTop && actions)}
                    </span>
                    <span className="spellClass">
                        
                        {this.props.vancian.enabled && <VancianPrep
                            spellName={spell.name}
                            prep={this.props.vancian.prep}
                            cast={this.props.vancian.cast}
                            type={spell.type}
                            allowPrep={this.props.vancianMode == 'prep'}
                            allowCast={this.props.vancianMode == 'cast'}
                            allowReset={this.props.vancianMode == 'cast' || this.props.vancianMode == 'prep'}
                            bookmarkManager={this.props.bookmarkManager}
                        />}
                        {this.props.vancian && spell.type == "Spell" ? <span className="bookmark" onClick={this.addAltPrep}>
                            <i className="fas fa-cog" />
                        </span> : null}
                        <span className={this.props.bookmarked ? "bookmark active" : "bookmark inactive"} onClick={this.toggleBookmark}>
                            <i className={this.props.bookmarked ? "fas fa-bookmark" : "far fa-bookmark"} />
                        </span>
                        {cardSize ? (spell.type.substr(0,2)) : (spell.type)} {spell.level}
                    </span>
                </div>
                <ul className="traits">
                    {spell.type !== "Condition" && spell.traits.map((t, index) => <Trait key={index} trait={t} />)}
                </ul>
                {
                (headerTokens.length > 0 || spell['saving throw'] || spell['defense'] || spell['rolls']) && 
                <div className="header">
                {headerTokens.map((t) => {
                    return <span key={t.title} className="headerElement"><strong>{t.title}</strong> {t.value}</span>
                })}
                {/* Legacy */ spell['saving throw'] && <div><span className="headerElement"><strong>Saving Throw</strong> {spell['saving throw']}</span></div>}
                {spell['defense'] && <div><span className="headerElement"><strong>Defense</strong> {spell['defense']}</span></div>}
                {spell['rolls'] && <div><span className="headerElement"><strong>Rolls</strong> {spell['rolls']}</span></div>}
                </div>
                }
                <div className="body">
                    {bodySections.map((s, index) => {
                        return <div key={index} className={s.className}>{s.title}<ReactMarkdown source={s.text} plugins={RemarkPlugins} renderers={RemarkRenderers} /></div>
                    })}
                </div>
                {spell['oldName'] && <div className="footerNote"><span className="headerElement"><strong>Pre-Remaster</strong> {spell['oldName']}</span></div>}
                {this.props.vancian.enabled && <div className="altPrep">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Lvl</th>
                                <th>Tradition</th>
                                <th>Prep</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.vancian.alt.map((a, idx) => 
                                <SpellAltPrep 
                                    key={idx}
                                    spell={spell}
                                    alt={a}
                                    bookmarkManager={this.props.bookmarkManager}
                                    allowPrep={this.props.vancianMode == 'prep'}
                                    allowCast={this.props.vancianMode == 'cast'}
                                    allowReset={this.props.vancianMode == 'cast' || this.props.vancianMode == 'prep'}
                                    />
                            )}
                        </tbody>
                    </table>
                </div>}
            </div>
        )
    }
};