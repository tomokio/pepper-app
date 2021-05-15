// This script is Automatic generation by tapper

var Tapper = Tapper || {}

Tapper.session = null;
Tapper.proxy   = { }

/**
 * Core
 */
Tapper.core = function($) {

    // T.B.D
    var PROXY_LEN = 2;

    // image preload
    var _preload_img = function() {
        var image = [
        'img/preloads/omocha_robot.png'
        ];
        $.each(image, function(i, src) {
            $('<img>').attr('src', src);
        });
    }

    // connect alproxy.
    var _connect = function(callback) {
        var proxy_num = PROXY_LEN;

        var get_service = function(name) {
            Tapper.session.service(name).then(
                // onSuccess.
                function(proxy) {
                    Tapper.proxy[name] = proxy;
                    proxy_num--;
                    if (proxy_num <= 0) callback();
                },
                // onFailed.
                function(error) {
                    console.error( error );
                    result_func();
                }
            );
        }

        QiSession(function( session ) {
            Tapper.session = session;

            get_service('ALMemory');
            get_service('ALAudioPlayer');
        }, null, Tapper_Debug ? Tapper_Debug_Host : null);
    }

    var _bind = function() {
        // bind events.
        Tapper.utl.subscribeEvent("Tapper/View/ChangeScene", function(id) {
            Tapper.view.changeScene(id);
        });

        Tapper.utl.subscribeEvent("Tapper/View/ButtonSelect", function (button_id) {
            Tapper.view.buttonSelect(id);
        });
    }

    var _self = {
        init: function() {
            Tapper.view.init();
            Tapper.contents.onLoad();

            _preload_img();
            _connect( function() {
                _bind();
                Tapper.utl.getData("Tapper/InitData", function(data) {
                    Tapper.init_data = JSON.parse(data);
                    Tapper.contents.onStart();
                }, Tapper.contents.onStart );
            });
        }
    }
    return _self;
}(jQuery);


/**
 * Common utility
 */
Tapper.utl = {
    raiseEvent: function(name, val) {
        Tapper.proxy.ALMemory.raiseEvent(name, val);
    },
    subscribeEvent: function(name, func) {
        var evt = new EventSubscription(name);
        Tapper.proxy.ALMemory.subscriber(name).then(function(sub) {
            evt.setSubscriber(sub);
            sub.signal.connect(func).then(function(id) {
                evt.setId(id);
            });
        });
        return evt;
    },
    getData: function(name, succeeded, failed) {
        Tapper.proxy.ALMemory.getData(name).then(succeeded, failed);
    }
}

/**
 * View utility
 */
Tapper.view = {
    init: function(){
        $(document).on('touchstart', '[data-btn-id]', function(){
            var node = $(this);
            node.addClass('touched');
        }).on('touchend', '[data-btn-id]', function(){
            var node = $(this);
            node.removeClass('touched');
            node.addClass('selected');
            Tapper.utl.raiseEvent("Tapper/View/ButtonTouched", node.attr('data-btn-id'));
        });
    },
    changeScene: function(id) {
        var scene_id = parseInt(id, 10);
        var scene_method = 'onScene' + scene_id;
        $('section#scene' + scene_id).show();
        $('section:not(#scene' + scene_id + ')').hide();
        try {
            Tapper.contents[scene_method]();
        } catch(e) {
            console.error("Undefined scene" + scene_id + ".")
        }
    },
    buttonSelect: function(id) {
        /*
        #var scene_id = parseInt(id, 10);
        */
        var button_id = id
        $('[data-btn-id='+ button_id +']').trigger('touchstart').trigger('touchend');
    },
    buttonReset: function(id) {
        $('[data-btn-id].selected').removeClass('selected');
    },
}


/**
 * SubscribeEvent info class
 */
function EventSubscription(event) {
    this._event       = event;
    this._internalId  = null;
    this._sub         = null;
    this._unsubscribe = false;
}
EventSubscription.prototype.setId = function(id) {
    this._internalId = id;
}
EventSubscription.prototype.setSubscriber = function(sub) {
    this._sub = sub;
}
EventSubscription.prototype.unsubscribe = function() {
    if (this._internalId != null && this._sub != null) {
        this._sub.signal.disconnect(this._internalId);
    } else {
        this._unsubscribe = true;
    }
}

$( Tapper.core.init );
