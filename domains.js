const DOMAIN_NAME = "thebma";
const DOMAIN_TLD = "local"

let _domains = [];

// Computes several value of the domain:
// a) Check if it includes out original domain name and tld.
// b) Get the constituent parts of the domain,
// c) Compute the depth of the domain. 
function computeDomain(url)
{
    //Strip out the port number.
    if(url.indexOf(":") != -1)
    {
        url = url.substr(0, url.indexOf(":"))
    }

    let domain = [];
    let domainMatchTld = false;
    let domainMatchName = false;
    let domainSplit = url.split(".");

    for(let i = 0; i < domainSplit.length; i ++)
    {
        let domainPart = domainSplit[i];
        if(domainPart === DOMAIN_NAME) domainMatchTld = true; 
        else if(domainPart === DOMAIN_TLD) domainMatchName = true;
        else domain.push(domainPart);
    }

    return { valid: (domainMatchTld && domainMatchName), domain: domain, depth: domain.length }
}

function addDomain(url, target)
{
    let data = computeDomain(url);

    if(data.valid)
    {
        let domainObject = 
        {
            url: url,
            depth: data.depth,
            domain: data.domain,
            endpoint: target,
            container: (target === null)
        }
    
        _domains.push(domainObject);
        console.log(`Registered ${url} as a domain.`);
    }
    else
    {
        console.log(`Failed to register ${url} as a domain.`);
    }

}

function getDomain(url)
{
    if(_domains.length == 0) return null;
    
    let data = computeDomain(url);
    if(!data.valid) return null;

    for(let i = 0; i < _domains.length; i++)
    {
        let idomain = _domains[i];
        if(idomain.container) continue;
        if(idomain.depth != data.depth) continue;

        const domainIntersection = data.domain.filter(element => idomain.domain.indexOf(element) !== -1);
        if(domainIntersection.length == data.domain.length) return idomain;
    }

    return null;
}

exports.getDomain = getDomain;

addDomain("thebma.local", "landing/");
addDomain("assets.thebma.local", "assets/");
addDomain("portfolio.thebma.local", "portfolio/");
addDomain("test.thebma.local", null);
addDomain("v1.test.thebma.local", "test/v1");
addDomain("v2.test.thebma.local", "test/v2");
addDomain("v3.test.thebma.local", "test/v3");




// SUB_DOMAINS.push( { url: "thebma.local",        depth: 0,   endpoint: "domains/landing/" } );
// SUB_DOMAINS.push( { url: "assets.thebma.local", depth: 1,   endpoint: "domains/assets/" } );
// SUB_DOMAINS.push( { url: "assets.thebma.local", depth: 1,   endpoint: "domains/assets/" } );




