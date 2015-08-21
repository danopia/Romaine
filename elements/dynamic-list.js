Polymer({
  selected: null,
  showChecks: true,
  items: [{description: 'loading...'}],

  isSelected: function (selected, key) {
    return this.selected == key;
  },
});
