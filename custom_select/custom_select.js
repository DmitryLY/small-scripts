
function custom_select_generator( data ){
        
    var arrow = data.arrow;
    var select = data.element;
    var clear = data.clear;
    var change = data.change;
    var placeholder = data.placeholder

    if( !select || select.tagName !== "SELECT" ) return;

    custom_input_init( select );

    function custom_input_init( select ){

        data_value = select.getAttribute('data-value');
        data_label = select.getAttribute('data-label');

        

        function visible_list(e,display){
            if( display !== undefined )
                custom_select_list.style.display = display;
            else
                custom_select_list.style.display = custom_select_list.style.display == 'none' ? 'block' : 'none' ;
        }

        function clear_input_text(){
            custom_input_text.value = '';
            custom_input_value.value = '';
            get_select_list();
        }
        
        function set_option( text ){

            var option = this;

            if( text && typeof text === 'string' && ( text = text.trim() ).length ){
                var needle = new RegExp(text,'i');
                for( var i = 0; i < select.length; i++ ){
                    if( !needle.exec( select[i].innerText ) ) continue;
                    option = select[i];
                    break;
                }
            }

            if( !option )
                return; 

            custom_input_value.value = option.value;
            custom_input_text.value = option.text;
            custom_input_value.setAttribute('value', option.value);
            custom_input_text.setAttribute('value', option.text);
            custom_select_list.style.display = 'none';

            
            if( change )
                change.call(custom_input_value);
        }

        var select_by_arrows_element;

        function select_by_arrows( code ){

            if( !custom_select_list.children.length ) return;

            var where = code == 38 && 'previous' || 'next';

            ( !select_by_arrows_element && ( select_by_arrows_element = custom_select_list.children[ code == 38 ? custom_select_list.children.length - 1 : 0 ] ) ) || ( select_by_arrows_element[ where + 'ElementSibling'] && ( select_by_arrows_element = select_by_arrows_element[ where + 'ElementSibling'] ) );

            for( var i = 0; i < custom_select_list.children.length; i++ ){
                custom_select_list.children[i].className = custom_select_list.children[i].className.replace(/(^|\s+)highlight\b/, '');
            }

            select_by_arrows_element.className += ' highlight';

            ( select_by_arrows_element.offsetTop < select_by_arrows_element.parentNode.scrollTop && ( select_by_arrows_element.parentNode.scrollTop = select_by_arrows_element.offsetTop ) ) || ( select_by_arrows_element.offsetTop + select_by_arrows_element.offsetHeight >= select_by_arrows_element.parentNode.scrollTop + select_by_arrows_element.parentNode.offsetHeight && ( select_by_arrows_element.parentNode.scrollTop += select_by_arrows_element.offsetHeight ) );

            custom_input_text.value = select_by_arrows_element.innerText.trim();

        }

        function router(e){'use strict';
            if( select.indexOf(this) !== -1 ){
                set_option.call(this);
            }else if( e === false )
                clear_input_text();
            else if( e instanceof Event && e.keyCode ){
                if( e.keyCode == 38 || e.keyCode == 40 ) // Вверх || вниз
                    custom_select_list.style.display != 'none' && select_by_arrows(e.keyCode);
                else if( e.keyCode == 13 ) // Ентер
                    set_option( custom_input_text.value );
                else
                    get_select_list( true );
            }

            clear && ( custom_input_clear.style.display = custom_input_text.value.length ? 'block' : 'none' );
        }

        function get_select_list( needle ){

            if( needle )
                visible_list(null,'');

            needle = custom_input_text.value || false;

            var display = custom_select_list.style.display;
            custom_select_list.style.display = 'none';
            custom_select_list.innerHTML  = '';

            if( needle && ( needle = needle.trim() ).length )
                needle = new RegExp( needle.replace(/(\*|\(|\)|\[|\]|\^)/g,'\\$1') , 'i' );

                for( var i = 0; i < select.length; i++ ){
                    if( needle && !needle.exec( select[i].innerText ) )
                        continue;

                    var option = select_divs[i];
                    option.innerText = select[i].innerText;
                    custom_select_list.appendChild( option );
                }
                

            select_by_arrows_element && !select_by_arrows_element.parentNode && (select_by_arrows_element = undefined );

            custom_select_list.style.display = display;

            select_by_arrows_element && ( select_by_arrows_element.parentNode.scrollTop = select_by_arrows_element.offsetTop );

        }

        if( !select.tagName || select.tagName !== 'SELECT' ) return;

        var custom_input_box = document.createElement('DIV');
        custom_input_box.className = 'custom_input_box';

        var custom_input_value = document.createElement('INPUT');
        custom_input_value.type = 'hidden';
        custom_input_value.name = select.name;
        
        custom_input_value.autocomplete = 'off';

        custom_input_box.appendChild( custom_input_value );
        
        var custom_input_text_box = document.createElement('DIV');
        custom_input_text_box.className = 'custom_input_text_box ' + select.className;
        

        var custom_input_text = document.createElement('INPUT');
        custom_input_text.name = select.name + '_';
        custom_input_text.type = 'text';
        custom_input_text.autocomplete = 'off';


        

        if( placeholder ) custom_input_text.placeholder = placeholder;
        custom_input_text.addEventListener('keyup', router );
        custom_input_text.addEventListener('mousedown', visible_list.bind(null,null,'') );

        var custom_select_list = document.createElement('DIV');
        custom_select_list.className = 'custom_select_list';
        var custom_select_list_box = document.createElement('DIV');
        custom_select_list_box.className = 'custom_select_list_box';
        custom_select_list_box.appendChild( custom_select_list );


        custom_input_text_box.appendChild( custom_input_text );
        
        if( arrow ){
            var custom_input_text_arrow = document.createElement('DIV');
            custom_input_text_arrow.className = 'custom_input_text_arrow';
            custom_input_text_arrow.addEventListener( 'click' , visible_list );
            custom_input_text_box.appendChild( custom_input_text_arrow );
        }

        if( clear ){
            var custom_input_clear = document.createElement('DIV');
            custom_input_clear.className = 'custom_input_text_clear';
            custom_input_clear.addEventListener( 'click' , router.bind( null , false ) );
            custom_input_text_box.appendChild( custom_input_clear );
        }
        
        custom_input_box.appendChild( custom_input_text_box );

        custom_input_box.appendChild( custom_select_list_box );


        window.addEventListener('click', function(e){
            var element = e.target;

            while(element){
                if( element === custom_input_box ) return;
                element = element.parentNode;
            }

            visible_list( null , 'none' )

        });


        custom_input_value.value = data_value;
        custom_input_text.value = data_label;

        
        select.parentNode.insertBefore( custom_input_box , select );

        select.remove();

        select = [].slice.call( select.children );
        var select_divs = [];

        (function(){

            for( var i = 0; i < select.length; i++ ){

                var option = document.createElement('DIV');
                option.innerText = select[i].innerText;
                option.addEventListener('click', router.bind( select[i] ) );

                select_divs.push(option);
            }

        })();

        get_select_list( true );
        visible_list( null , 'none' )
        router();

    }

};
