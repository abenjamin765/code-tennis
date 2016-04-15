(function($, CodeMirror, Haml, jade, less, Sass, autoprefixer, window, document, undefined) {
    $(function() {
        var theme = 'zenburn';
        var openEditors = 3;
        var areaCSS = document.getElementById('areaCSS');
        var areaHTML = document.getElementById('areaHTML');
        var areaJS = document.getElementById('areaJS');
        var style = document.getElementById('style');
        var script = document.getElementById('script');
        var view = document.getElementById('view');
        var viewDocument = view.contentDocument || view.contentWindow.document;
        var body = viewDocument.getElementsByTagName('body')[0];
        var head = viewDocument.getElementsByTagName('head')[0];

        var $showCSS = $('#showCSS');
        var $showJS = $('#showJS');
        var $showHTML = $('#showHTML');
        var $closePanel = $('.closePanel');
        var $cssSelect = $('#cssSelect');
        var $htmlSelect = $('#htmlSelect');
        var mode = {
            css: 'css',
            html: 'text/html',
            js: 'javascript'
        };

        $cssSelect.on('change', function() {
            var $this = $(this);
            var val = $this.val();
            mode.css = val;
            editorCSS.setOption("mode", mode.css);
        });


        $htmlSelect.on('change', function() {
            var $this = $(this);
            var val = $this.val();
            mode.html = val;
            editorHTML.setOption("mode", mode.html);
        });



        var editorCSS = CodeMirror.fromTextArea(areaCSS, {
            lineNumbers: true,
            theme: theme,
            indentUnit: 2,
            smartIndent: true,
            tabSize: 2,
            mode: mode.css,
            matchBrackets : true,
            autoCloseBrackets: true,
            indentWithTabs: false,
            keyMap: 'sublime'
        });
      Inlet(editorCSS);
        var editorHTML = CodeMirror.fromTextArea(areaHTML, {
            lineNumbers: true,
            theme: theme,
            indentUnit: 2,
            smartIndent: true,
            tabSize: 2,
            mode: mode.html,
            matchBrackets : true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            indentWithTabs: false,
            keyMap: 'sublime'
        });

        var editorJS = CodeMirror.fromTextArea(areaJS, {
            lineNumbers: true,
            theme: theme,
            indentUnit: 2,
            smartIndent: true,
            tabSize: 2,
            mode: mode.js,
            matchBrackets : true,
            autoCloseBrackets: true,
            indentWithTabs: false,
            keyMap: 'sublime'
        });

        body.appendChild(script);
        head.appendChild(style);

        editorCSS.on('update', function(obj) {
            style.remove();
            var css = obj.doc.getValue();
            css = mode.css === 'css' ? obj.doc.getValue() : Sass.compile(css);
            if (mode.css === 'text/x-less') {
                less.render(obj.doc.getValue(), function(e, result) {
                    if (!e) {
                        css = result.css;
                        var prefixed = autoprefixer().process(css);
                        style.innerHTML = prefixed;
                        head.appendChild(style);
                    }
                });
            } else {
                var prefixed = autoprefixer().process(css);
                style.innerHTML = prefixed;
                head.appendChild(style);
            }

        });

        editorJS.on('update', function(obj) {
            script.remove();
            script = document.createElement('script');
            script.innerHTML = obj.doc.getValue();
            body.appendChild(script);
        });


        editorHTML.on('update', function(obj) {
            script.remove();
            var code = obj.doc.getValue();
            var html = mode.html === 'jade' ? jade.compile(code) : code;

            html = mode.html === 'haml' ? Haml(html) : html;
            $(body).html(html);
            body.appendChild(script);
        });


      
        $showCSS.on('change', function() {
          if ($('.panel.css').hasClass('closed')) { 
              openEditors++;
            } else {
              if (openEditors < 2) {
                return false;
              }
              openEditors--;
            }
            $('.panel.css')
                .toggleClass('closed');
        });
        $showJS.on('change', function() {
          if ($('.panel.js').hasClass('closed')) { 
              openEditors++;
            } else {
              if (openEditors < 2) {
                return false;
              }
              openEditors--;
            }
            $('.panel.js')
                .toggleClass('closed');
        });
        $showHTML.on('change', function() {
          if ($('.panel.html').hasClass('closed')) { 
              openEditors++;
            } else {
              if (openEditors < 2) {
                return false;
              }
              openEditors--;
            }
            $('.panel.html')
                .toggleClass('closed');
        });

        $closePanel.on('click', function() {
 

            if ($(this).closest('.panel').hasClass('closed')) { 
              openEditors++;
            } else {
              if (openEditors < 2) {
                return false;
              }
              openEditors--;
            }
            $(this).closest('.panel').toggleClass('closed');
            var checked;
            if ($(this).closest('.panel').hasClass('css')) {
                checked = $showCSS.prop('checked');
                $showCSS.prop('checked', !checked);
            } else if ($(this).closest('.panel').hasClass('js')) {
                checked = $showJS.prop('checked');
                $showJS.prop('checked', !checked);
            } else if ($(this).closest('.panel').hasClass('html')) {
                checked = $showHTML.prop('checked');
                $showHTML.prop('checked', !checked);
            }
        });

      	$('.button').on('mousedown click moseup', function(e){
          var target = $(this).attr('for');
          var $target = $('#' + target);
          if ($target.prop('checked')) {
            if (openEditors < 2) {
              e.preventDefault;
                  return false;
            }
          }
        });
        $('body').addClass('loaded');


    });

})(window.jQuery, window.CodeMirror, window.Haml, window.jade, window.less, window.Sass, window.autoprefixer, window, document);

