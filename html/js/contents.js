// pepper contents

Tapper.contents = {

    onLoad: function() {
        console.log("onLoad.");
    },

    onStart: function() {
        console.log("onStart.");
        $("#s1-title").append(Tapper.init_data["scene1"]["title"]);
        $("#s1-info").append(Tapper.init_data["scene1"]["info"]);
    },

    onScene1: function() {
        console.log("onScene1");
    },

    onScene2: function() {
        console.log("onScene2");
        $("#s2-menu1").append("<p>" + Tapper.init_data["scene2"]["menu1"]["title"]+ "</p>");
        $("#s2-menu2").append("<p>" + Tapper.init_data["scene2"]["menu2"]["title"]+ "</p>");
    },

    onScene3: function() {
        console.log("onScene3");
         $("#s3-info").append("<p>" + Tapper.init_data["scene3"]["info"] + "</p>");
         $("#s3-header").append(Tapper.init_data["scene3"]["header"]);
         $("#s3-footer").append(Tapper.init_data["scene3"]["footer"]);
         $("#s3-end").append("<p>" + Tapper.init_data["scene3"]["menuend"]["title"] + "</p>");
    }
}
