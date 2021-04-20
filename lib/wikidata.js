const wikidata_query_url = 'https://query.wikidata.org/sparql';
	
async function sparql_query( url, q )
{
    const fullUrl = `${url}?query=${encodeURIComponent(q)}`;

    const headers = { 'Accept': 'application/sparql-results+json' };

    return fetch( fullUrl, { headers } ).then( body => body.json() );
}

async function get_wd_data ( id )
{
    const q = `SELECT ?name ?article WHERE {
        ?article schema:about wd:${id} ;
                 schema:inLanguage ?lang ;
                 schema:name ?name ;
                  
                 schema:isPartOf <https://en.wikipedia.org/>; .
      FILTER (!CONTAINS(?name, ':')) .
      FILTER(?lang in ('en') ).
    }`;

    let response = await sparql_query( wikidata_query_url, q );

    let data = 
    {
        vars : response.head.vars,
        items : response.results.bindings
    }

    return data;
}

