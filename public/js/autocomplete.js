var shorten = function(x) {
    return x.toLowerCase().replace(/-/, '').replace(/ph/g, 'f')
        .replace(/h/g, '').replace(/[cq]/g, 'k').replace(/z/g, 's')
        .replace(/ae/g, 'e').replace(/[ye]/g, 'i').replace(/u/g, 'o')
        .replace(/(.)\1/g, '$1');
};

function generate_guid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function present_item(item) {
    var result = [];
    var marker_names;
    if(active_garden === '') {
        marker_names = item.gardens.map(function(x){return x.name;});
    } else {
        marker_names = [active_garden];
    }
    if(active_garden === '') {
        var row = $('<tr/>', {class: 'match_item'})
            .dblclick(function(x) {
                zoomToSelection('gardens', marker_names);
                window.getSelection().removeAllRanges();                
                return false; } )
            .mouseenter(function(x) {
                $(x.currentTarget).removeClass('ghini-highlighted-false');
                $(x.currentTarget).addClass('ghini-highlighted-true');
                markers_setcolor(marker_names, {color: 'orange'}); } )
            .mouseleave(function(x) {
                $(x.currentTarget).removeClass('ghini-highlighted-true');
                $(x.currentTarget).addClass('ghini-highlighted-false');
                markers_setcolor(marker_names, {color: 'red'}); } );
        row.append($('<td/>', {class: 'binomial', text: item.species_name}));
        row.append($('<td/>', {class: 'family', text: item.taxon.family}));
        result.push(row);
        for(var i in item.gardens) {
            row = $('<tr/>', {class: 'garden_row'})
                .dblclick(function(x) {
                    fireSelectGarden(x.currentTarget.children[0].textContent);
                    window.getSelection().removeAllRanges();                
                    return false; } )
                .mouseenter(function(x) {
                    $(x.currentTarget).removeClass('ghini-highlighted-false');
                    $(x.currentTarget).addClass('ghini-highlighted-true');
                    markers_setcolor([x.currentTarget.children[0].textContent], {color: 'orange'}); } )
                .mouseleave(function(x) {
                    $(x.currentTarget).removeClass('ghini-highlighted-true');
                    $(x.currentTarget).addClass('ghini-highlighted-false');
                    markers_setcolor([x.currentTarget.children[0].textContent], {color: 'red'}); } );
            row.append($('<td/>', {class: 'garden_name', text: item.gardens[i].name}));
            row.append($('<td/>', {class: 'plant_count', text: item.gardens[i].plant_count}));
            result.push(row);
        }
    } else {
    }
    return result;
}

function match_item(item, input, field_name, garden) {
    input = input.replace(/-/g, '.*');
    var reg = new RegExp('^' + shorten(input), 'i');
    return item[field_name].match(reg);
}

function match_species(val) {
    var objs = Object.values(objects_container.__taxa);
    $('#result').empty();
    if(val.length > 2) {
        objs = objs.filter(function(x) { return match_item(x, val, 'phonetic');});
        var elements = objs.map(present_item);
        elements.map(function(x) {$('#result').append(x);});
    }
}

function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array) { return array[i]; } );
    });
}      
