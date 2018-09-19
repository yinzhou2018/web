(function() {
  const appListController = {
    formatAppId(value, rowData, rowIndex) {
      return `<a href=${value}>${value}</a`;
    },

    formatOperation(value, rowData, rowIndex) {

    }
  };

  window.appListController = appListController;
}())