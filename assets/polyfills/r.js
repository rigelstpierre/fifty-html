requirejs.config({
  shim: {
    'app': {
      deps: ['jquery']
    },
    'plugins': {
      deps: ['jquery']
    },
    'wow': {
      deps: ['jquery']
    },
    // 'foundation/app': {
    //   deps: [
    //   'foundation/jquery.cookie',
    //   ]
    // }
  },

  paths: {
    jquery  : "../../components/jquery/dist/jquery.min",
    WOW     : "../../components/WOW/dist/wow.min"
  },

  name: "main",
  out: "main.min.js"
});
require([ 
  '../../components/jquery/dist/jquery.min', 
  '../../components/WOW/dist/wow.min',
  'app',
  'plugins'
], function($) {

    new WOW().init();

})