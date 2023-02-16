

    function custom_select_generator( data ){
        
        var arrow = data.arrow;
        var select = data.element;
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
                    custom_select_list.style.display = custom_select_list.style.display == 'none' ? '' : 'none' ;
            }

            function clear_input_text(){
                custom_input_text.value = '';
            }
            
            function set_option( value , text ){
                if( !value.trim() ) return;
                custom_input_value.value = value;
                custom_input_text.value = text;
                custom_input_value.setAttribute('value', value);
                custom_input_text.setAttribute('value', text);
                custom_select_list.style.display = 'none';
                
                if( change )
                    change.call(custom_input_value);
            }

            function get_select_list( needle ){

                if( needle )
                    visible_list(null,'');

                needle = custom_input_text.value || false;

                var display = custom_select_list.style.display;
                custom_select_list.style.display = 'none';
                custom_select_list.innerHTML  = '';

                if( needle && ( needle = needle.trim() ).length )
                    needle = new RegExp( needle , 'i' );

                    for( var i = 0; i < select_list.length; i++ ){
                        if( needle && !needle.exec( select_list[i].innerText ) )
                            continue;

                        var option = document.createElement('DIV');
                        option.innerText = select_list[i].innerText;
                        option.addEventListener('click', set_option.bind( this , select_list[i].value , select_list[i].innerText ) );
                        custom_select_list.appendChild( option );
                    }
                    

                custom_select_list.style.display = display;
            }

            if( !select.tagName || select.tagName !== 'SELECT' ) return;

            var select_list = [].slice.call( select.children );

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
            //custom_input_text.className = 'custom_input_text';
            custom_input_text.name = select.name + '_';
            custom_input_text.type = 'text';
            custom_input_text.autocomplete = 'off';


            

            if( placeholder ) custom_input_text.placeholder = placeholder;
            custom_input_text.addEventListener('keyup', get_select_list.bind(null,true) );
            //custom_input_text.addEventListener('focus', visible_list.bind(null,null,'') );
            custom_input_text.addEventListener('mousedown', visible_list.bind(null,null,'') );
            //custom_input_text.addEventListener('blur', visible_list.bind(null,null,'none') );

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


            custom_input_value.value = data_value;select.getAttribute('data-value');
            custom_input_text.value = data_label;select.getAttribute('data-label');

            get_select_list( true );
            visible_list( null , 'none' )


            select.parentNode.insertBefore( custom_input_box , select );

            select.remove();

        }

    };
