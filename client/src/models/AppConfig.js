const AppConfig = {
  project: {
    identiconOption: {
      margin: 0.3,
      size: 400,
    }
  },

  profile: {
    identiconOption: {
      margin: 0.25,
      size: 200,
    }
  },

  textEditor: {
    tinyMCEConfig: {
      height: 300,
      menubar: 'edit insert format',
      plugins: 'link bdesk_photo',
      toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | outdent indent | bdesk_photo'
    }
  },

  button: {
    requestText: 'Requesting..',
  },

  postTypes: [
    'All',
    '=====================',
    'Career Expert',
    'Company Inside',
    'System Design',
    'Package',
    '=====================',
    'Interview Experience',
    'Job Seek',
    'Referral',
    '=====================',
    'Program Introduction',
  ],

  companyOptions: [
    'All',
    'Amazon',
    'Google',
    'Facebook',
    'Bloomberg',
    'Microsoft',
    'Yelp',
    'Uber',
    'Oracle',
    'Indeed',
    'Pinterest',
    'Dropbox',
    'Apple',
    'Linkedin',
    'Quora',
    'VMware',
    'Airbnb',
    'Stripe',
    'Plaid',
    'Twilio',
    'Lyft',
  ]
};

export default AppConfig;
