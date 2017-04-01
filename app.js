;(function () {
    'use strict';

    var CodeMirror = React.createFactory(CodeMirrorEditor);
    var div = React.createFactory('div');
    var h2 = React.createFactory('h2');
    var h3 = React.createFactory('h3');
    var p = React.createFactory('p');
    var span = React.createFactory('span');
    var ul = React.createFactory('ul');
    var li = React.createFactory('li');
    var button = React.createFactory('button');
    var input = React.createFactory('input');

    var ls = localStorage.getItem("snippets");
    var snippets = ls ? JSON.parse(ls) : { snippets: { 'Snippet #1': 'function add(a, b) {\n' + '  return a + b;\n' + '}' } };

    var Application = React.createClass({
        getInitialState: function () {
            return {
                snippets: snippets.snippets,
                snippet: snippets.snippet || ((snippets.snippets && Object.keys(snippets.snippets).length > 0) ? Object.keys(snippets.snippets)[0] : ''),
                triggerUpdateSnippetName: null
            };
        },
        componentDidMount: function() {
            var self = this;

            setInterval(function () {
                localStorage.setItem('snippets', JSON.stringify(self.state));
            }, 1000);
        },
        createNewSnippet: function() {
            var s = this.state.snippets;
            s['Snippet #' + Number(Object.keys(this.state.snippets).length + 1)] = 'function add(a, b) {\n' + '  return a + b;\n' + '}';

            this.setState({ snippets: s })
        },
        triggerUpdateSnippetName: function(oldName) {
            this.setState({ triggerUpdateSnippetName: oldName })
        },
        updateSnippetName: function(e, oldName) {
            if (e.key === 'Enter') {
                var s = this.state.snippets;
                s[e.target.value] = s[oldName];
                delete s[oldName];

                var newState = { snippets: s, triggerUpdateSnippetName: null };

                if (this.state.snippet == oldName) newState.snippet = e.target.value;

                this.setState(newState);

                document.getElementById("list-btn-add").scrollIntoView();
            }
        },
        render: function () {
            var snippetComponents = [];
            var selectedSnippet = this.state.snippet;

            for (var i=0;i<Object.keys(this.state.snippets).length;i++) {
                (function(name) {
                    var self = this;

                    if (this.state.triggerUpdateSnippetName == name) {
                        snippetComponents.push(
                            li({
                                onDoubleClick: function() { self.triggerUpdateSnippetName(name) },
                                onClick: function() {self.setState({snippet: name})},
                                className: selectedSnippet == name ? 'active' : ''
                            }, input({type: 'text', autoFocus: true, onFocus: function(e){e.target.select()}, defaultValue: name, className: 'form-control', onKeyPress: function(e) {self.updateSnippetName(e, name, e.target.value)}}))
                        )
                    } else {
                        snippetComponents.push(
                            li({
                                onDoubleClick: function() { self.triggerUpdateSnippetName(name) },
                                onClick: function() {self.setState({snippet: name})},
                                className: selectedSnippet == name ? 'active' : ''
                            }, span({}, name))
                        )
                    }
                }.bind(this))(Object.keys(this.state.snippets)[i])
            }

            return (
                div({className: 'row'},
                    div({className: 'col-md-4'},
                        div({className: 'topbar topbar-title'}, h2({}, 'Snip!'), span({}, 'Store your snippet locally.')),
                        ul({}, snippetComponents),
                        ul({}, li({id: 'list-btn-add', className: 'list-btn-add', onClick: this.createNewSnippet}, '+ Add Snippet'))
                    ),
                    div({className: 'col-md-8'},
                        div({className: 'topbar topbar-code'}, h3({}, this.state.snippet)),
                        CodeMirror({
                            textAreaClassName: ['form-control'],
                            textAreaStyle: {minHeight: '10em'},
                            value: this.state.snippets[this.state.snippet],
                            mode: 'javascript',
                            theme: 'neo',
                            lineNumbers: true,
                            lineWrapping: true,
                            onChange: function (e) {
                                var s = this.state.snippets;
                                s[this.state.snippet] = e.target.value;

                                this.setState({snippets: s});
                            }.bind(this)
                        })
                    )
                )
            )
        }
    });

    React.render(React.createElement(Application), document.getElementById('container'));
}());
