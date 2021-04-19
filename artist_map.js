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
    let response = await fetch("data/raw/test_output/locations.csv");
    let text = await response.text ();
    let lines = text.split ( "\r\n" );

    for ( const l of lines.slice(1,100) ) 
    {
        let fields = l.split ( "," );
        [ loc, artist_count, lat, lon ] = fields;
        L.marker([lon,lat],
        {
            title : `${artist_count} artists`
        }).addTo(map);
    }
}
