    function telephone_format( telephone , mask , mask_num){

        if( !telephone || !mask || !mask_num ) 
            return;

        var numbers = [];
        var telephone_array;

        function getNumbers(){

            numbers = [];

            telephone_array = telephone.value.split('');

            for( var i = 0, j = 0; i < mask.length; i++ ){
                if( mask[i] == mask_num ) {
                    while(j < telephone_array.length){
                        telephone_array_j = telephone_array?.[j].match(/\d+/) ? telephone_array[j] : undefined;
                        j++;
                        if( telephone_array_j ){
                            numbers.push( telephone_array_j );
                            break;
                        }
                    }
                }
            }
        }

        function render (){

            var pre_value = '';
            
            for( var i = 0, n = 0; i < mask.length; i++ )
                if( mask[i] == mask_num ) 
                    ( pre_value += numbers[n] || mask_num ) , n++ ;
                else
                    pre_value += mask[i];

            telephone.value = pre_value
            
        }

        getNumbers();
        render();

        telephone.addEventListener('input', handler);
        telephone.addEventListener('click', handler);
        telephone.addEventListener('keydown', handler);
        telephone.addEventListener('paste', handler);

        function handler(e){  

            var key = e.data?.match(/^\d+$/) && e.data;
            var inputType = e.inputType;
            
            if( (e.type === 'paste' || e.type === 'input') && !key && !inputType ) {
                if( e.type === 'paste' )
                    telephone.value = e.clipboardData.getData('text/plain');
                getNumbers();
                render();
                e.preventDefault();
                return;
            }

            var start_mask = telephone.selectionStart;
            var end_mask = telephone.selectionEnd;

            ( e.keyCode === 39 ) && ( start_mask++, end_mask++ );
            ( e.keyCode === 37 ) && ( start_mask--, end_mask-- );

            ( inputType === 'insertText' && end_mask === start_mask && (start_mask = --end_mask) );

            var start_num , end_num;

            for( var m = 0, n = 0; m < mask.length ; m++ ){
                if( mask[m] != mask_num ){
                    if( m === start_mask && ( inputType === 'deleteContentBackward' || e.keyCode === 37 ) ){
                        start_num = n > 0 ? n-1 : 0;
                    }
                    continue;
                } 
                ( start_num === undefined && m >= start_mask && ( start_num = n ) );
                ( end_num === undefined && m >= end_mask && ( end_num = n) );
                n++;
            }

            ( end_num === undefined && ( end_num = n ) );
            ( start_num === undefined && ( start_num = n ) );

            ( start_num != end_num && end_num-- );
            
            if( e.type === 'input' ){
                var array_undefined_length = end_num - start_num + 1;
                
                [].splice.apply( numbers , [ start_num , end_num - start_num + 1 || 1 , ].concat( Array( array_undefined_length ).fill(undefined) ) );

                ( key && start_num !== undefined && (numbers[start_num] = key) );
                
                render();
            }

            for( var selection_pos = 0, j = 0 , next_num = ( e.type !== 'input' || inputType === 'deleteContentBackward' || ( !key && inputType === 'insertText' ) || ( !key && start_num != end_num ) ? start_num : start_num + 1); selection_pos < mask.length ; selection_pos++ ){
                if( mask[selection_pos] != mask_num ) continue;
                if( j === next_num ) break;
                j++;
            }

            setSelection( telephone, selection_pos, selection_pos)
            
        }

        function setSelection(input, selectionStart, selectionEnd, binded) {
            input.selectionEnd = selectionStart;
            input.selectionStart = selectionEnd;

            if( !binded )
                setTimeout( setSelection.bind(null, input, selectionStart, selectionEnd, true), 0 )
        }

    }
