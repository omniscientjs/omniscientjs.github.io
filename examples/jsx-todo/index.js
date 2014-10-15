/** @jsx React.DOM */
var React       = require('react'),
   immstruct    = require('immstruct'),
   component    = require('omniscient');

var structure = immstruct({
 items: [
   { checked: false, text: 'Buy milk' },
   { checked: true, text: 'Make example application with JSX' },
   { checked: false, text: 'Compile using the --harmony flag' },
   { checked: false, text: 'Check checkboxes' }
 ]
});

var checkedMixin = {
 onChecked: function () {
   this.props.cursor.item.update('checked', function (state) {
     return !state;
   });
 }
};

// Need to use function as => binds
var Item = component(checkedMixin, function(cursor) {
 return (
   <label>
     <input type="checkbox" onChange={this.onChecked} checked={cursor.item.get('checked')} />
     {cursor.item.get('text')}
   </label>
 );
});

var List = component((cursors) => (
 <form>
   <ul>
     {cursors.items.map((itemCursor, i) =>
       <li key={"key-" + i}>
         <Item item={itemCursor} />
       </li>
     ).toArray()}
   </ul>
 </form>
));

module.exports.name = 'jsx-todo';
module.exports.structure = structure;
module.exports.init = function (el) {
  render();
  structure.on('swap', render);

  function render () {
    React.renderComponent(
      <List items={structure.cursor('items')} />,
      el
    );
  }
};
