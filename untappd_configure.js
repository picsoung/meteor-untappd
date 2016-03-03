Template.configureLoginServiceDialogForUntappd.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForUntappd.fields = function () {
  return [
    {property: 'client_id', label: 'Client ID'},
    {property: 'client_secret', label: 'Client secret'},
    {property: 'redirect_uri', label: 'Redirect URI'}
  ];
};
