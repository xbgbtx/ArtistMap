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

    let loc_data_url = `https://www.wikidata.org/wiki/${loc_id}`
    let data_anc = `<a href="${loc_data_url}">${loc_id}</a>`

    info_div.innerHTML = `Loc: ${data_anc}`;

    let loc_bands = await get_marker_data ( loc_id );

    console.log ( loc_bands );

    for ( const b of loc_bands )
    {
        let band_data_url = `https://www.wikidata.org/wiki/${b.band}`
        info_div.innerHTML += `<br/>Band: <a href="${band_data_url}">${b.band}</a>`
    }
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
