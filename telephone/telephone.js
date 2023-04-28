

function telephone_format( telephone , mask , mask_num){

    if( !telephone || !mask || !mask_num ) 
        return;

    var numbers = [];
    var telephone_array = telephone.value.split('');

    for( var i = 0; i < mask.length; i++ ){
        if( mask[i] == mask_num ) 
            numbers.push( telephone_array[i] && telephone_array[i].match(/\d+/) ? telephone_array[i] : undefined );
    }

    render();

    function render (){

        var pre_value = '';
        
        for( var i = 0, n = 0; i < mask.length; i++ )
            if( mask[i] == mask_num ) 
                ( pre_value += numbers[n] || mask_num ) , n++ ;
            else
                pre_value += mask[i];

        telephone.value = pre_value
        
    }

    telephone.addEventListener('keydown',function(e){

        if( e.keyCode != 39 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 40 )
            e.preventDefault();                

        if( !e.key.match(/\d+/) && e.keyCode != 8 && e.keyCode != 46 ) 
            return;

        var start_mask = telephone.selectionStart;
        var end_mask = telephone.selectionEnd;

        var start_num , end_num;

        for( var m = 0, n = 0; m < mask.length ; m++ ){
            if( mask[m] != mask_num ) continue;
            ( start_num === undefined && m >= start_mask && ( start_num = n ) );
            ( end_num === undefined && m >= end_mask && ( end_num = n) );
            n++;
        }

        ( end_num === undefined && ( end_num = n ) );
        ( start_num === undefined && ( start_num = n ) );

        ( start_num != end_num && end_num-- );
        
        ( start_num > 0 && end_num > 0 && e.keyCode == 8 && start_num === end_num && ( start_num = --end_num ) );

        [].splice.apply( numbers , [ start_num , end_num - start_num + 1 || 1 , ].concat( Array( end_num - start_num + 1 || 1 ).fill(undefined) ) );

        ( e.key.match(/\d+/) && start_num !== undefined && ( numbers[start_num] = e.key ) );
         
        render();

        for( var selection_pos = 0, j = 0 , next_num = ( e.keyCode == 8 || ( !e.key.match(/\d+/) && start_num != end_num ) ? start_num : start_num + 1); selection_pos < mask.length ; selection_pos++ ){
            if( mask[selection_pos] != mask_num ) continue;
            if( j === next_num ) break;
            j++;
        }


        telephone.selectionEnd = telephone.selectionStart = selection_pos;

    } );

}

