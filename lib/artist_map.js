const marker_data_url="data/raw/test_output"
async function page_loaded ()
{
    console.log ( "Artist Map starting..." );

    let map = create_map ();

    await add_locations ( map );
}

function create_map ()
{
    let map = L.map ("mapdiv").setView ( [51.505, -0.09], 2 );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
    {
        maxZoom: 19,
        attribution: "&copy; <a href=\"https://openstreetmap.org/copyright\">"+
                     "OpenStreetMap contributors</a>"
    }).addTo(map);

    return map;
}

async function add_locations ( map )
{
    let locs = await get_marker_data ( "locations" );

    for ( const loc of locs.slice(0,100) ) 
    {
        L.marker([loc.lat,loc.lon],
        {
            title : `${loc.artist_count} artists`
        })
            .on ( "click", () => location_clicked ( loc.location ) ) 
            .addTo(map);
    }
}

async function location_clicked ( loc_id )
{
    let info_div = document.getElementById ( "infodiv" );

    info_div.innerHTML = "";

    let loc_header = await wiki_data_html ( loc_id );
    loc_header.classList.add ( "header" );
    info_div.appendChild ( loc_header );

    let artist_div = document.createElement ( "div" );

    info_div.appendChild ( artist_div );

    let loc_bands = await get_marker_data ( loc_id );

    if ( loc_bands == null || loc_bands.length < 1 )
        return;

    for ( const b of loc_bands )
    {
        let artist_info = await wiki_data_html ( b.band );
        artist_info.classList.add ( "artist_info" );
        artist_div.appendChild ( artist_info );
    }
}

async function wiki_data_html ( id ) 
{
    let data = await get_wd_data ( id );

    let div = document.createElement ( "div" );

    if ( data == null || data.items == null || data.items.length < 1 )
    {
        let el = document.createElement ( "a",
        {
            href : `https://www.wikidata.org/wiki/${id}`,
            text : id
        });

        div.appendChild ( el );
        return div;
    }

    data = data.items [ 0 ];

    let article_a = document.createElement ( "a" );
    article_a.href = data.article.value;
    article_a.text = data.name.value;

    div.appendChild ( article_a );

    let img = document.createElement ( "img" );
    img.src = "assets/music_note.png";

    if ( data.img != null )
        img.src = data.img.value;

    div.appendChild ( img );

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
