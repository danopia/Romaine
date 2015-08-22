Polymer({
  is: 'multi-list',
  properties: {
    items: {
      type: Array,
      value: [{ description: 'loading...' }],
    },
    selectedValues: {
      value: [],
      notify: true,
    },
    noIcons: {
      type: Boolean,
      value: false,
    },
  },
  
  computeIcon: function (selectedList, key) {
    return 'check-box' + ((selectedList.base.indexOf(key) >= 0) ? '' : '-outline-blank');
  },
});
