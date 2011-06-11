var nanaian_com_nav = (function() {

    function bind(obj, method) {
        return function() {
            var args = [];
            for(var n = 0; n < arguments.length; n++) {
                args.push(arguments[n]);
            }
            return obj[method].apply(obj, args);
        };
    }

    function listen(evnt, elem, func) {
        if(elem.addEventListener) { // W3C DOM
            elem.addEventListener(evnt,func,false);
        }
        else if(elem.attachEvent) { // IE DOM
            var r = elem.attachEvent("on"+evnt, func);
            return r;
        }
        else {
            throw('This browser not supported.');
        }
    }

    function NavView() {
        if(!this instanceof NavView) {
            return new RenderView();
        }
        this.sections = [];
        this.active = null;
    }

    NavView.prototype.createElement = function(tag, text, attrs) {
        var e = document.createElement(tag);
        if(typeof text === 'string') {
            text = document.createTextNode(text);
        }
        if('nodeType' in text && text.nodeType === Node.TEXT_NODE) {
            e.appendChild(text.cloneNode(true));
        }

        if(attrs) {
            for(var a in attrs) {
                e.setAttribute(a, attrs[a]);
            }
        }
        return e;
    }

    NavView.prototype.linkForSection = function(s) {
        var h1 = s.getElementsByTagName('h1')[0];
        var link = this.createElement('a', h1.childNodes[0], {
            'href': '#' + s.getAttribute('id'),
            'rel': 'section'
        });
        link.section = s;
        listen('click', link, bind(this, 'displaySection'));
        return link;
    }

    NavView.prototype.insertNav = function() {
        var _d = document;
        var sections = _d.getElementsByClassName('main');
        var list = _d.createElement('ul');
        for(var i=0; i<sections.length; i++) {
            var li = _d.createElement('li');
            var link = this.linkForSection(sections[i]);
            li.appendChild(link);
            list.appendChild(li);
            this.sections.push(sections[i].getAttribute('id'));
        }

        var nav = _d.createElement('nav');
        nav.setAttribute('id', 'main');
        nav.appendChild(list);
        _d.getElementsByTagName('header')[0].appendChild(nav);
    }

    NavView.prototype.displaySection = function(section) {
        if(this.active) {
            this.active.style.display = 'none';
        }

        if('target' in section) {
            var evnt = section;
            section = evnt.target.section;
        }

        this.active = section;
        section.style.display = 'block';
        return false;
    }

    NavView.prototype.displaySectionInHash = function() {
        var hash = document.location.hash.replace( /^#/, '' );
        var s = document.getElementById(hash);
        if(s) {
            this.displaySection(s);
        }
    }

    NavView.prototype.init = function() {
        this.insertNav();        
        this.displaySectionInHash();
    }

    nav = new NavView();
    listen('load', window, bind(nav, 'init'));

})();
