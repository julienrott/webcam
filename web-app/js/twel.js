(function(){
  var twel = {
    options: [],
    session: undefined,
    publisher: undefined,
    
    init: function(options) {
      if (!options) {
        console.error('otions of twel are mandatory');
        return;
      }
      this.options.sessionId = options.sessionId || undefined;
      this.options.apiKey = options.apiKey || undefined;
      this.options.token = options.token || undefined;
    },
    
    initSession: function() {
      this.session = TB.initSession(this.options.sessionId);
    },
    
    connect: function() {
      this.session.connect(this.options.apiKey, this.options.token);
    },
    
    disconnect: function() {
      this.session.disconnect();
    },
    
    publishMyVideo: function(elementId, publisherOptions) {
      this.initSession();
      this.connect();
      this.publisher = TB.initPublisher(this.options.apiKey, elementId, publisherOptions);
      this.session.publish(this.publisher);
    },
    
    stopMyVideo: function() {
      this.session.unpublish(this.publisher);
      this.publisher.destroy();
    }

  };
  if(!window.twel){window.twel=twel;}
})();
