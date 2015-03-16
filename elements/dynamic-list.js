Polymer({
  selected: null,
  items: [{description: 'loading...'}],

  isSelected: function (selected, key) {
    console.log(this.selected, key);
    return this.selected == key;
  },
});
