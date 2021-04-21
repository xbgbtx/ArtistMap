const marker_data_url="data/artist_locations"

//ID of location currently being displayed
var active_loc = null;

async function page_loaded ()
{
    console.log ( "Artist Map starting..." );

    let map = create_map ();

    await add_locations ( map );
}

function create_map ()
{
    let map = L.map ("mapdiv").setView ( [0, 0], 2 );

    map.setMaxBounds ( L.latLngBounds( L.latLng(-90,-180),  
                                       L.latLng( 90, 180) ) );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
    {
        maxZoom: 19,
        attribution: "&copy; <a href=\"https://openstreetmap.org/copyright\">"+
                     "OpenStreetMap contributors</a>",
        continuousWorld: false,
        noWrap: false
    }).addTo(map);

    return map;
}

async function add_locations ( map )
{
    let locs = await get_marker_data ( "locations" );
    let markers = L.markerClusterGroup (
    {
        iconCreateFunction: function ( cluster )
        {
            let artist_count = cluster.getAllChildMarkers ().reduce (
                ( total, m ) => total + m.artist_count, 0
            );
            let size = 30 + ( 10 * Math.floor(Math.log10(artist_count)) )
            return L.divIcon(
            { 
                html: `${artist_count}` ,
                iconSize: L.Point(size,size),
                className: "map_cluster"
            });
        }
    });

    for ( const loc of locs ) 
    {
        let m = L.marker([loc.lat,loc.lon],
        {
            title : `${loc.artist_count} artists`
        })
        .on ( "click", () => location_clicked ( loc.location ) );
        m["artist_count"] = parseInt(loc.artist_count);
        markers.addLayer ( m );
    }

    map.addLayer ( markers );
}

async function location_clicked ( loc_id )
{
    //store loc in global to enable breaking out of loop if user
    //clicks new location
    active_loc = loc_id;

    let info_div = document.getElementById ( "infodiv" );

    info_div.innerHTML = "";

    let loc_header = await wiki_data_html ( loc_id );
    loc_header.classList.add ( "header" );
    info_div.appendChild ( loc_header );

    let artist_div = document.createElement ( "div" );
    artist_div.classList.add ( "scroll" );

    info_div.appendChild ( artist_div );

    let loc_artists = await get_marker_data ( loc_id );

    if ( loc_artists == null || loc_artists.length < 1 )
        return;

    for ( const b of loc_artists )
    {
        if ( active_loc != loc_id )
            break;

        let artist_info = await wiki_data_html ( b.artist );
        artist_info.classList.add ( "artist_info" );
        artist_div.appendChild ( artist_info );
    }
}

async function wiki_data_html ( id ) 
{
    let data = await get_wd_data ( id );

    let div = document.createElement ( "div" );

    let img = document.createElement ( "img" );
    img.src = "assets/music_note.png";
    div.appendChild ( img );

    if ( data == null || data.items == null || data.items.length < 1 )
    {
        let el = document.createElement ( "a" );
        el.href = `https://www.wikidata.org/wiki/${id}`;
        el.text = id;
        div.appendChild ( el );
        return div;
    }

    data = data.items [ 0 ];

    if ( data.img != null )
        img.src = data.img.value;


    let article_a = document.createElement ( "a" );

    if ( data.article != null )
    {
        article_a.href = data.article.value;
        article_a.text = data.name.value;
    }
    else
    {
        article_a.href = `https://www.wikidata.org/wiki/${id}`;
        article_a.text = id;
    }

    div.appendChild ( article_a );

    return div;
}

async function get_marker_data ( id )
{
    let response = await fetch(`${marker_data_url}/${id}.csv`);
    let text = await response.text ();
    let lines = text.split ( "\r\n" );

    headers = lines [ 0 ].split(",");

    data = lines.slice ( 1 ).map ( ( line, idx ) =>
    {
        item = {};
        fields = line.split(",");

        if ( line.length < 1 || fields.length != headers.length )
            return null;

        fields.forEach ( ( f, idx ) => item [ headers[idx] ] = f );
        return item;
    });

    data = data.filter ( x => x !== null );

    return data;
}
